# 老张客户关系管理（LaoZhang CRM）

> 📌 专为 **思源笔记（SiYuan）** 打造的轻量级客户关系管理插件，帮助你高效记录客户信息、跟进状态与沟通历史，**全端兼容（PC / Docker / 手机）**。

![思源CRM插件示意图](https://via.placeholder.com/800x400?text=老张CRM+界面预览) <!-- 可选：后续替换为真实截图 -->

## ✨ 功能亮点

- **快速建档**：一键创建标准化客户笔记模板（含姓名、电话、公司、状态等字段）
- **智能筛选**：按“待跟进 / 已成交 / 已流失”分类查看客户列表
- **跟进日志**：在客户笔记中追加沟通记录，时间线清晰可追溯
- **全端同步**：数据存储在思源笔记中，PC、Docker、手机三端实时同步
- **零学习成本**：完全基于思源原生块操作，无需额外数据库

## 🚀 安装方式

### 方法一：通过思源插件集市（推荐）
1. 打开 **思源笔记**
2. 进入 **设置 → 插件 → 市集**
3. 搜索关键词：`老张CRM` 或 `CRM`
4. 点击 **安装** → **启用**

### 方法二：手动安装（适用于网络受限环境）
1. 下载最新版 [`package.zip`](https://github.com/zhangyong2611/siyuan-plugin-zhanglao-crm/releases)
2. 解压到思源插件目录：
   - Windows: `%APPDATA%\SiYuan\plugins\`
   - macOS: `~/Library/Application Support/SiYuan/plugins/`
   - Linux: `~/.config/SiYuan/plugins/`
3. 重启思源，在 **本地插件** 中启用

## 📂 插件结构说明

| 文件 | 作用 |
|------|------|
| `plugin.json` | 插件元信息（名称、版本、入口等） |
| `index.js` | 主逻辑文件 |
| `icon.png` | 插件图标（128×128 透明 PNG） |
| `build.js` | 打包脚本（用于生成 `package.zip`） |

## 🛠️ 开发者信息

- **作者**：老张（[@zhangyong2611](https://github.com/zhangyong2611)）
- **仓库地址**：https://github.com/zhangyong2611/siyuan-plugin-zhanglao-crm
- **问题反馈**：欢迎提交 [Issues](https://github.com/zhangyong2611/siyuan-plugin-zhanglao-crm/issues)
- **贡献代码**：PR 欢迎！

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源协议 —— 免费使用、修改、分发。

---

> 💡 **提示**：如果你希望自定义功能或批量导入客户，请联系作者获取企业定制版支持。
