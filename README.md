 <h1 align="center">Hi 👋, I'm Mob</h1>
<h3 align="center">Join the Cryptocurrency Market, make money from Airdrop - Retroactive with me</h3>

- <p align="left"> <img src="https://komarev.com/ghpvc/?username=mobonchain&label=Profile%20views&color=0e75b6&style=flat" alt="mobonchain" /> <a href="https://github.com/mobonchain"> <img src="https://img.shields.io/github/followers/mobonchain?label=Follow&style=social" alt="Follow" /> </a> </p>

- [![TopAME | Bullish - Cheerful](https://img.shields.io/badge/TopAME%20|%20Bullish-Cheerful-blue?logo=telegram&style=flat)](https://t.me/xTopAME)

# Hướng dẫn cài đặt Auto Ping Silent Protocol
- Mã nguồn sử dụng để **Auto PING**, giúp kiểm tra vị trí và giữ cho tài khoản luôn trong hàng chờ

---

## Yêu cầu

1. Đã đăng ký **[Silent Protocol ](https://ceremony.silentprotocol.org/?ref=1667278375860441088)**
2. Chuẩn bị **API_TOKEN Bot Telegram** và **ID Telegram** nếu muốn nhận thông báo về **Bot Telegram** - **( Không bắt buộc )**
3. **Token** của **Silent Protocol**

### Cách lấy API_TOKEN Bot Telegram
- **Xem tại đây : https://t.me/ToolboxforAirdrop/10**
### Cách lấy Token Silent Protocol
1. Trên trang **Slient Protocol** nhấn **Ctrl + Shift + I** hoặc **F12** nếu dùng **Windows** và **Crtl + Shift + J** nếu dùng **macOS**
2. Truy cập vào thẻ **Console**
3. Gõ `localStorage.getItem('silent_jwt');`
4. Copy toàn bộ giá trị `eyJhbGciOi.............` nhớ xóa hai dấu ` `` ` ở hai đầu

---

## Cấu Trúc Dữ Liệu Trong File token.txt
```
eyJhbGciOi.............
eyJhbGciOi.............
eyJhbGciOi.............
```

---
## Cấu Trúc Dữ Liệu Trong File proxy.txt
```
http://username:pass@ip:port
http://username:pass@ip:port
http://username:pass@ip:port
```

--- 

## Cài Đặt Trên Windows

### Bước 1: Tải và Giải Nén File

1. Nhấn vào nút **<> Code"** màu xanh lá cây, sau đó chọn **Download ZIP**.
2. Giải nén file ZIP vào thư mục mà bạn muốn lưu trữ.
---

### Bước 2: Cấu Hình Token và Proxy

1. Mở lần lượt file `token.txt` và `proxy.txt`
2. Điền theo cấu trúc dữ liệu phía trên
3. Lưu file
4. Nếu muốn gửi thông báo về **Bot Telegram** thì mở `mainbot.js` lên
- Thay thế `YOUR_API_TOKEN_BOT_TELEGRAM` và `YOUR_ID_TELEGRAM` bằng **API_TOKEN Bot** và **ID Telegram** của bạn
- Lưu file
---

### Bước 3: Cài Đặt Module

1. Mở **Command Prompt (CMD)** hoặc **PowerShell** trong thư mục chứa mã nguồn.
2. Cài đặt các module yêu cầu bằng lệnh:
   ```bash
   npm install
   ```
---

### Bước 4: Chạy Ứng Dụng

1. Nếu **không** muốn nhận thông báo **Bot Telegram** mà sẽ in trực tiếp ra **Terminal**:
   ```bash
   node main.js
   ```
2. Nếu **muốn** nhận thông báo về **Bot Telegram**.
   ```bash
   node mainbot.js
   ```
- Vào **Telegram** mở **Bot** lên gõ `/startsend` để nhận thông báo
---

## Cài Đặt Trên Linux (VPS)

### Bước 1: Tạo Phiên `screen`

1. Đăng nhập vào VPS của bạn qua SSH.

2. Tạo một phiên `screen` mới để chạy công cụ **SilentProtocol** mà không bị gián đoạn khi bạn rời khỏi terminal:

   ```bash
   screen -S SilentProtocol
   ```
---

### Bước 2: Git Clone Dự Án

   ```bash
   git clone https://github.com/mobonchain/SilentProtocol.git
   cd SilentProtocol
   ```
---

### Bước 3: Cài Đặt Node.js và NPM

1. Kiểm tra xem Node.js và npm đã được cài đặt chưa:

   ```bash
   node -v
   npm -v
   ```

   Nếu chưa cài đặt, bạn có thể cài Node.js và npm bằng các lệnh sau (cho **Ubuntu/Debian**):

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

   Đối với các hệ điều hành khác, hãy tham khảo tài liệu chính thức của **[Node.js](https://nodejs.org/en/)**.
---

### Bước 4: Cài Đặt Các Module

1. Sau khi clone về, chạy lệnh sau để cài đặt các module yêu cầu:

   ```bash
   npm install
   ```
---

### Bước 5: Cấu Hình Token và Proxy

1. Mở lần lượt từng file `token.txt` và `proxy.txt`
   ```bash
   nano token.txt
   ```
   ```bash
   nano proxy.txt
   ```
2. Điền theo cấu trúc dữ liệu phía trên
3. Lưu file bằng tổ hợp phím **Ctrl + O**, sau đó thoát bằng **Ctrl + X**
4. Nếu muốn gửi thông báo về **Bot Telegram** thì mở `mainbot.js` lên
```bash
   nano mainbot.js
   ```
- Thay thế `YOUR_API_TOKEN_BOT_TELEGRAM` và `YOUR_ID_TELEGRAM` bằng **API_TOKEN Bot** và **ID Telegram** của bạn
- Lưu file bằng tổ hợp phím **Ctrl + O**, sau đó thoát bằng **Ctrl + X**
---

### Bước 6: Chạy Ứng Dụng

1. Nếu **không** muốn nhận thông báo **Bot Telegram** mà sẽ in trực tiếp ra **Terminal**:
   ```bash
   node main.js
   ```
2. Nếu **muốn** nhận thông báo về **Bot Telegram**.
   ```bash
   node mainbot.js
   ```
- Vào **Telegram** mở **Bot** lên gõ `/startsend` để nhận thông báo
---

### Bước 7: Để Ứng Dụng Chạy Tiếp Tục Sau Khi Đăng Xuất

Khi bạn muốn để ứng dụng chạy trong nền và không bị gián đoạn khi đăng xuất khỏi phiên SSH, bạn có thể tách khỏi phiên `screen` bằng cách nhấn `Ctrl + A` rồi nhấn `D`.

Để quay lại phiên `screen` đã tạo, bạn chỉ cần chạy lệnh:

```bash
screen -r TeaFi
```
