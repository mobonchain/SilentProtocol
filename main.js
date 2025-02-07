const axios = require('axios');
const fs = require('fs');
const { HttpsProxyAgent } = require('https-proxy-agent');
const chalk = require('chalk');

const POSITION_URL = "https://ceremony-backend.silentprotocol.org/ceremony/position";
const PING_URL = "https://ceremony-backend.silentprotocol.org/ceremony/ping";

function loadTokens() {
    try {
        const data = fs.readFileSync('token.txt', 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        console.log(chalk.green(`✅ Đã tải ${data.length} token(s).`));
        return data;
    } catch (err) {
        console.error(chalk.red("❌ Lỗi: Không thể đọc file token.txt!", err));
        return [];
    }
}

function loadProxies() {
    try {
        const data = fs.readFileSync('proxy.txt', 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        console.log(chalk.green(`🌐 Đã tải ${data.length} proxy(s).`));
        return data;
    } catch (err) {
        console.warn(chalk.yellow("⚠️ Không tìm thấy file proxy.txt, sẽ chạy không có proxy."));
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

function logMessages(messages) {
    const chunks = messages.match(/[\s\S]{1,4000}/g);
    for (const chunk of chunks) {
        console.log(chunk);
    }
}

async function runAutomation(tokens, proxies) {
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

            messages += `${data.name} | PING ${pingResult.success ? "Thành công" : "Thất bại"} | `;
            if (positionResult.success) {
                messages += `${positionResult.behind} | ${positionResult.timeRemaining}\n`;
            } else {
                messages += `Lỗi: ${positionResult.error}\n`;
            }
        }

        logMessages(messages);

        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

async function main() {
    const tokens = loadTokens();
    const proxies = loadProxies();

    if (tokens.length === 0) {
        console.log(chalk.red("🚫 Không có token nào. Thoát chương trình."));
        return;
    }

    if (proxies.length < tokens.length) {
        console.warn(chalk.yellow("⚠️ Số lượng proxy ít hơn số token. Một số token sẽ không dùng proxy."));
    }

    runAutomation(tokens, proxies);
}

main();
