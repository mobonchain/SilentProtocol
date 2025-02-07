const axios = require('axios');
const fs = require('fs');
const { HttpsProxyAgent } = require('https-proxy-agent');

const POSITION_URL = "https://ceremony-backend.silentprotocol.org/ceremony/position";
const PING_URL = "https://ceremony-backend.silentprotocol.org/ceremony/ping";

const TELEGRAM_BOT_TOKEN = "YOUR_API_TOKEN_BOT_TELEGRAM"
const TELEGRAM_ADMIN_ID = "YOUR_ID_TELEGRAM"
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

let isSending = true;
let lastMessageId = null;

function loadTokens() {
    try {
        const data = fs.readFileSync('token.txt', 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        console.log(`✅ Đã tải ${data.length} token(s).`);
        return data;
    } catch (err) {
        console.error("❌ Lỗi: Không thể đọc file tokens.txt!", err);
        return [];
    }
}

function loadProxies() {
    try {
        const data = fs.readFileSync('proxy.txt', 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        console.log(`🌐 Đã tải ${data.length} proxy(s).`);
        return data;
    } catch (err) {
        console.warn("⚠️ Không tìm thấy file proxies.txt, sẽ chạy không có proxy.");
        return [];
    }
}

function getHeaders(token) {
    return {
        "Authorization": `Bearer ${token}`,
        "Accept": "*/*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    };
}

async function sendTelegramMessage(chatId, message) {
    try {
        if (lastMessageId) {
            await axios.post(`${TELEGRAM_API_URL}/deleteMessage`, {
                chat_id: chatId,
                message_id: lastMessageId
            });
        }

        const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        });

        lastMessageId = response.data.result.message_id;
        return lastMessageId;
    } catch (err) {
        console.error("❌ Lỗi gửi Telegram:", err.message);
        return null;
    }
}

async function handleTelegramCommands() {
    let offset = 0;
    while (true) {
        try {
            const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`, { params: { offset } });
            const updates = response.data.result;

            for (const update of updates) {
                offset = update.update_id + 1;

                const messageText = update.message?.text;
                const chatId = update.message?.chat.id;

                if (chatId !== parseInt(TELEGRAM_ADMIN_ID)) continue;

                if (messageText === "/stopsend") {
                    isSending = false;
                    await sendTelegramMessage(chatId, "❌ Đã tạm dừng gửi thông báo.");
                } else if (messageText === "/startsend") {
                    isSending = true;
                    await sendTelegramMessage(chatId, "✅ Đã tiếp tục gửi thông báo.");
                }
            }
        } catch (err) {
            console.error("❌ Lỗi xử lý lệnh Telegram:", err.message);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function getPosition(token, proxy) {
    try {
        const options = { headers: getHeaders(token) };
        if (proxy) options.httpsAgent = new HttpsProxyAgent(proxy);

        const response = await axios.get(POSITION_URL, options);
        return {
            success: true,
            behind: response.data.behind,
            timeRemaining: response.data.timeRemaining
        };
    } catch (err) {
        return {
            success: false,
            error: err.response?.status || err.message
        };
    }
}

async function pingServer(token, proxy) {
    try {
        const options = { headers: getHeaders(token) };
        if (proxy) options.httpsAgent = new HttpsProxyAgent(proxy);

        await axios.get(PING_URL, options);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.response?.status || err.message };
    }
}

async function runAutomation(tokens, proxies, chatId) {
    const tokenData = tokens.map((token, index) => ({
        token,
        name: `Tài khoản ${index + 1}`,
        proxy: proxies[index] || null
    }));

    while (true) {
        let messages = "";
        for (const data of tokenData) {
            const positionResult = await getPosition(data.token, data.proxy);
            const pingResult = await pingServer(data.token, data.proxy);

            messages += `${data.name} | PING ${pingResult.success ? "🟢" : "🔴"} | `;
            if (positionResult.success) {
                messages += `${positionResult.behind} | ${positionResult.timeRemaining}\n`;
            } else {
                messages += `Lỗi: ${positionResult.error}\n`;
            }
        }

        if (isSending) {
            const chunks = messages.match(/[\s\S]{1,4000}/g);
            for (const chunk of chunks) {
                await sendTelegramMessage(chatId, chunk);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

async function main() {
    const tokens = loadTokens();
    const proxies = loadProxies();

    if (tokens.length === 0) {
        console.log("🚫 Không có token nào. Thoát chương trình.");
        return;
    }

    if (proxies.length < tokens.length) {
        console.warn("⚠️ Số lượng proxy ít hơn số token. Một số token sẽ không dùng proxy.");
    }

    handleTelegramCommands();

    runAutomation(tokens, proxies, TELEGRAM_ADMIN_ID);
}

main();
