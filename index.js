// 老张客户关系管理插件 - 全端适配版
const siyuan = require("siyuan");

// 插件激活入口（思源启动/启用插件时执行）
exports.onload = async function() {
    console.log("老张客户关系管理插件已激活");

    // 注册侧边栏入口（全端适配：PC侧边栏按钮，手机滑动侧边栏可见）
    await siyuan.sidebar.add({
        icon: "icon.png",
        title: "老张客户管理",
        position: "bottom",
        onClick: showCRMPanel
    });

    // 注册快速命令：新增客户（支持思源命令面板调用）
    await siyuan.commands.register({
        command: "zhanglao-crm:create-customer",
        title: "老张CRM：新增客户",
        callback: createCustomerNote
    });
};

// 显示CRM主面板（响应式尺寸，适配所有端）
async function showCRMPanel() {
    // 面板HTML（响应式样式，无固定尺寸，适配手机触屏）
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
            </div>
            <div id="customerList" style="max-height: 70vh; overflow-y: auto; box-sizing: border-box;"></div>
        </div>
    `;

    // 创建响应式面板（百分比尺寸+最大限制，适配PC/手机）
    const panel = await siyuan.panel.create({
        title: "老张客户关系管理",
        content: panelHTML,
        width: "80%",    // 手机端占80%屏幕宽，PC端最多400px
        maxWidth: 400,
        height: "70%",   // 手机端占70%屏幕高，PC端最多500px
        maxHeight: 500
    });

    // 绑定新增客户按钮事件（适配触屏/点击）
    panel.element.querySelector("#createCustomerBtn").addEventListener("click", createCustomerNote);
    
    // 绑定筛选按钮事件
    panel.element.querySelectorAll(".filterBtn").forEach(btn => {
        btn.addEventListener("click", function() {
            const status = this.dataset.status;
            loadCustomerList(panel.element.querySelector("#customerList"), status);
            // 高亮选中的筛选按钮
            panel.element.querySelectorAll(".filterBtn").forEach(b => b.style.background = "");
            this.style.background = "#e6f7ff";
        });
    });

    // 加载初始客户列表（全部）
    await loadCustomerList(panel.element.querySelector("#customerList"), "all");
}

// 创建客户笔记（全端适配：思源原生弹窗，相对路径存储）
async function createCustomerNote() {
    // 思源原生输入弹窗（PC居中，手机全屏适配）
    const customerName = await siyuan.dialog.prompt({
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

    // 存储到思源相对路径（全端通用，Docker/手机自动适配）
    await siyuan.blocks.createDocWithMd({
        path: "/老张客户管理", // 相对路径，非硬编码本地路径
        filename: customerName,
        markdown: customerContent
    });

    // 思源原生通知（PC右下角，手机顶部弹窗）
    siyuan.notification.show({
        title: "老张CRM - 成功",
        content: `客户「${customerName}」档案已创建！`
    });

    // 刷新客户列表（如果面板已打开）
    const customerListEl = document.querySelector("#customerList");
    if (customerListEl) {
        await loadCustomerList(customerListEl, "all");
    }
}

// 加载客户列表（支持按状态筛选，适配触屏点击）
async function loadCustomerList(containerEl, filterStatus = "all") {
    containerEl.innerHTML = "";

    // 查询「老张客户管理」目录下的所有客户笔记（思源SQL，全端通用）
    let sql = `
        SELECT * FROM blocks 
        WHERE path LIKE '/老张客户管理/%' 
        AND type = 'd'
        ORDER BY created DESC
    `;
    const docs = await siyuan.sql.query(sql);

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

        // 点击打开客户笔记（思源原生方式，全端一致）
        item.addEventListener("click", () => {
            siyuan.workspace.openDocByPath(doc.path);
        });

        containerEl.appendChild(item);
    });
}