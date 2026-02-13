// 老张客户关系管理插件 - 全端适配版
// 核心修正：思源插件不使用 require("siyuan")，而是通过 onload 参数获取 app 对象

/**
 * 插件激活入口（思源启动/启用插件时执行）
 * @param {Object} app - 思源核心应用对象（插件的核心API入口）
 */
exports.onload = async function(app) {
    try {
        console.log("老张客户关系管理插件已激活");
        // 挂载app到全局（方便其他函数调用）
        globalThis.crmApp = app;

        // 1. 注册侧边栏入口（适配PC/移动端）
        await registerSidebar(app);
        
        // 2. 注册快速命令：新增客户（支持思源命令面板调用）
        await registerCommands(app);

    } catch (error) {
        console.error("老张CRM插件加载失败：", error);
        // 思源原生通知提示错误
        app.notification.show({
            title: "老张CRM插件错误",
            content: `加载失败：${error.message}`,
            type: "error"
        });
    }
};

/**
 * 注册侧边栏按钮
 * @param {Object} app 思源核心对象
 */
async function registerSidebar(app) {
    // 思源标准侧边栏注册方式
    app.addSidebar({
        key: "zhanglao-crm-sidebar", // 唯一标识
        icon: "icon.png", // 确保插件目录下有该图标文件
        title: "老张客户管理",
        position: "bottom", // 侧边栏底部显示
        callback: () => showCRMPanel(app) // 点击回调
    });
}

/**
 * 注册快速命令
 * @param {Object} app 思源核心对象
 */
async function registerCommands(app) {
    // 思源标准命令注册方式
    app.command.registerCommand({
        command: "zhanglao-crm:create-customer",
        name: "老张CRM：新增客户", // 注意：是name而非title
        callback: () => createCustomerNote(app)
    });
}

/**
 * 显示CRM主面板（响应式尺寸，适配所有端）
 * @param {Object} app 思源核心对象
 */
async function showCRMPanel(app) {
    try {
        // 面板HTML（响应式样式，适配手机触屏）
        const panelHTML = `
            <div style="padding: 16px; font-size: 14px; box-sizing: border-box;">
                <h3 style="margin: 0 0 16px 0; font-size: 1.2em;">老张客户列表</h3>
                <button id="createCustomerBtn" style="padding: 8px 16px; margin-bottom: 16px; cursor: pointer; font-size: 1em;">
                    新增客户
                </button>
                <div id="customerFilter" style="margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px;">
                    <button class="filterBtn" data-status="all" style="padding: 4px 12px; cursor: pointer; font-size: 0.9em;">全部客户</button>
                    <button class="filterBtn" data-status="待跟进" style="padding: 4px 12px; cursor: pointer; font-size: 0.9em;">待跟进</button>
                    <button class="filterBtn" data-status="已成交" style="padding: 4px 12px; cursor: pointer; font-size: 0.9em;">已成交</button>
                    <button class="filterBtn" data-status="已流失" style="padding: 4px 12px; cursor: pointer; font-size: 0.9em;">已流失</button>
                </button>
                <div id="customerList" style="max-height: 70vh; overflow-y: auto; box-sizing: border-box;"></div>
            </div>
        `;

        // 创建响应式面板（思源标准面板创建方式）
        const panel = await app.panel.createPanel({
            title: "老张客户关系管理",
            content: panelHTML,
            width: "80%",    // 手机端占80%屏幕宽，PC端最多400px
            maxWidth: 400,
            height: "70%",   // 手机端占70%屏幕高，PC端最多500px
            maxHeight: 500
        });

        // 绑定新增客户按钮事件（基于当前面板元素，避免跨面板污染）
        const createBtn = panel.element.querySelector("#createCustomerBtn");
        if (createBtn) {
            createBtn.addEventListener("click", () => createCustomerNote(app));
        }
        
        // 绑定筛选按钮事件
        const filterBtns = panel.element.querySelectorAll(".filterBtn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                const status = this.dataset.status;
                // 加载客户列表时传入当前面板的列表容器
                loadCustomerList(app, panel.element.querySelector("#customerList"), status);
                // 高亮选中的筛选按钮
                filterBtns.forEach(b => b.style.background = "");
                this.style.background = "#e6f7ff";
            });
        });

        // 加载初始客户列表（全部）
        await loadCustomerList(app, panel.element.querySelector("#customerList"), "all");

    } catch (error) {
        console.error("显示CRM面板失败：", error);
        app.notification.show({
            title: "老张CRM错误",
            content: `面板打开失败：${error.message}`,
            type: "error"
        });
    }
}

/**
 * 创建客户笔记（全端适配：思源原生弹窗+相对路径存储）
 * @param {Object} app 思源核心对象
 */
async function createCustomerNote(app) {
    try {
        // 思源原生输入弹窗（PC/移动端适配）
        const { data: customerName } = await app.dialog.prompt({
            title: "老张CRM - 新增客户",
            placeholder: "请输入客户名称（如：李四-XX公司）"
        });

        if (!customerName) return; // 用户取消输入则退出

        // 客户笔记模板（包含状态标签，方便筛选）
        const customerContent = `
# ${customerName}
- 客户名称：${customerName}
- 联系方式：
- 公司名称：
- 职位：
- 客户来源：
- 客户状态：待跟进
- 备注：
- 创建时间：${new Date().toLocaleString()}

## 跟进记录
- 【${new Date().toLocaleString()}】首次创建客户档案
        `.trim();

        // 确保「老张客户管理」目录存在（新增容错逻辑）
        const dirPath = "/老张客户管理";
        const dirExists = await app.sql.query(`SELECT * FROM folders WHERE path = '${dirPath}'`);
        if (dirExists.length === 0) {
            await app.tree.createFolder(dirPath);
        }

        // 存储到思源相对路径（思源标准创建文档方式）
        await app.file.createDocWithMd({
            path: dirPath,
            filename: customerName,
            markdown: customerContent
        });

        // 思源原生通知（PC右下角，手机顶部弹窗）
        app.notification.show({
            title: "老张CRM - 成功",
            content: `客户「${customerName}」档案已创建！`,
            type: "success"
        });

        // 刷新客户列表（仅当前面板存在时）
        const customerListEl = document.querySelector("#customerList");
        if (customerListEl) {
            await loadCustomerList(app, customerListEl, "all");
        }
    } catch (error) {
        console.error("创建客户笔记失败：", error);
        app.notification.show({
            title: "老张CRM错误",
            content: `创建客户失败：${error.message}`,
            type: "error"
        });
    }
}

/**
 * 加载客户列表（支持按状态筛选，适配触屏点击）
 * @param {Object} app 思源核心对象
 * @param {HTMLElement} containerEl 列表容器元素
 * @param {string} filterStatus 筛选状态
 */
async function loadCustomerList(app, containerEl, filterStatus = "all") {
    if (!containerEl) return;
    containerEl.innerHTML = "";

    try {
        // 查询「老张客户管理」目录下的所有客户笔记（思源标准SQL查询）
        const sql = `
            SELECT * FROM blocks 
            WHERE path LIKE '/老张客户管理/%' 
            AND type = 'd'
            ORDER BY created DESC
        `;
        const docs = await app.sql.query(sql);

        if (docs.length === 0) {
            containerEl.innerHTML = "<div style='color: #999; padding: 16px 0;'>暂无客户信息，点击「新增客户」创建</div>";
            return;
        }

        // 筛选客户（按状态）
        const filteredDocs = filterStatus === "all" 
            ? docs 
            : docs.filter(doc => {
                  // 从笔记内容中提取客户状态
                  return doc.content.includes(`客户状态：${filterStatus}`);
              });

        if (filteredDocs.length === 0) {
            containerEl.innerHTML = `<div style='color: #999; padding: 16px 0;'>暂无「${filterStatus}」状态的客户</div>`;
            return;
        }

        // 渲染客户列表（适配触屏，加大点击区域）
        filteredDocs.forEach(doc => {
            const item = document.createElement("div");
            item.style = "padding: 12px 8px; border-bottom: 1px solid #eee; cursor: pointer; box-sizing: border-box;";
            // 提取客户状态用于显示
            const statusMatch = doc.content.match(/客户状态：(.*)/);
            const status = statusMatch ? statusMatch[1] : "未分类";
            
            item.innerHTML = `
                <div style="font-weight: 500; font-size: 1em;">${doc.content.split("\n")[0].replace("# ", "")}</div>
                <div style="font-size: 0.9em; color: #666; margin-top: 4px;">状态：${status}</div>
                <div style="font-size: 0.8em; color: #999; margin-top: 4px;">创建时间：${new Date(doc.created).toLocaleString()}</div>
            `;

            // 点击打开客户笔记（思源原生方式）
            item.addEventListener("click", () => {
                app.workspace.openDocByPath(doc.path);
            });

            containerEl.appendChild(item);
        });
    } catch (error) {
        console.error("加载客户列表失败：", error);
        containerEl.innerHTML = `<div style='color: #f5222d; padding: 16px 0;'>加载失败：${error.message}</div>`;
    }
}

/**
 * 插件卸载时清理资源（规范写法，避免内存泄漏）
 */
exports.onunload = function() {
    console.log("老张客户关系管理插件已卸载");
    // 移除注册的命令和侧边栏
    if (globalThis.crmApp) {
        globalThis.crmApp.command.unregisterCommand("zhanglao-crm:create-customer");
        globalThis.crmApp.removeSidebar("zhanglao-crm-sidebar");
    }
};
