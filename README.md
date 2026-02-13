# LaoZhang CRM (老张客户关系管理)

A lightweight customer relationship management plugin built exclusively for **SiYuan Note**, helping you efficiently record customer information, track follow-up status and communication history, with full compatibility across PC / Docker / mobile devices.

---

## 📸 Screenshot of SiYuan CRM Plugin

*(Add your plugin screenshot here: `preview.png`)*

---

## ✨ Key Features

- **Quick Creation**: One-click creation of standardized customer note templates (including fields like name, phone, company, status, etc.)
- **Smart Filtering**: Filter customer lists by "Follow-up", "Completed", or "Lost" status
- **Follow-up Log**: Add communication records directly in customer notes, with timelines for clear tracking
- **Full Sync**: Data stored natively in SiYuan notebooks, with real-time three-end synchronization (PC, Docker, mobile)
- **Zero Learning Curve**: Fully based on SiYuan's native block operations, no extra database required

---

## 🚀 Installation

### Method 1: Install via SiYuan Plugin Marketplace (Recommended)
1. Open SiYuan Note
2. Go to **Settings → Plugins → Marketplace**
3. Search for "LaoZhang CRM" or "CRM"
4. Click **Install → Enable**

### Method 2: Manual Installation (For restricted network environments)
1. Download the latest `package.zip` from the [Releases](https://github.com/zhangyong2611/siyuan-plugin-zhanglao-crm/releases) page
2. Extract it to your SiYuan plugins directory:
   - Windows: `%APPDATA%\SiYuan\plugins\`
   - macOS: `~/Library/Application Support/SiYuan/plugins/`
   - Linux: `~/.config/SiYuan/plugins/`
3. Restart SiYuan and enable the plugin locally

---

## 📁 Plugin Structure

| File          | Purpose                                                                 |
|---------------|-------------------------------------------------------------------------|
| `plugin.json` | Plugin metadata (name, version, entry point, etc.)                     |
| `index.js`    | Main logic file                                                         |
| `icon.png`    | Plugin icon (128×128 transparent PNG)                                  |
| `build.sh`    | Packaging script (used to generate `package.zip`)                       |

---

## 👨‍💻 Developer Information

- **Author**: LaoZhang (@zhangyong2611)
- **Repository**: https://github.com/zhangyong2611/siyuan-plugin-zhanglao-crm
- **Issue Feedback**: Welcome to submit [Issues](https://github.com/zhangyong2611/siyuan-plugin-zhanglao-crm/issues)
- **Code Contributions**: PRs are welcome!

---

## 📜 License

This project is open-sourced under the **MIT License** — you are free to use, modify, and distribute it.
