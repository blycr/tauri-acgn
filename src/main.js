const { open } = window.__TAURI__.dialog;
const { readDir } = window.__TAURI__.fs;

/**
 * 多语言配置对象
 * 为 ACGN Manager 提供中英文支持
 */
const i18n = {
  active: "zh", // 默认语言
  zh: {
    title: "ACGN Manager",
    welcome: "欢迎来到你的私人 ACGN 资源管理器",
    selectFolder: "选择漫画库目录",
    notSelected: "未选择目录",
    scanning: "扫描中...",
    noSubfolders: "未在该目录下发现子文件夹",
    scanFailed: "扫描失败",
    dialogTitle: "选择漫画库根目录"
  },
  en: {
    title: "ACGN Manager",
    welcome: "Welcome to your personal ACGN manager",
    selectFolder: "Select Library",
    notSelected: "No folder selected",
    scanning: "Scanning...",
    noSubfolders: "No subfolders found in this directory",
    scanFailed: "Scan failed",
    dialogTitle: "Select Manga Library Root"
  }
};

let selectFolderBtn;
let pathDisplay;
let mangaList;
let welcomeText;
let titleText;

/**
 * 切换界面语言
 * @param {string} lang - 目标语言 ('zh' 或 'en')
 */
function updateLanguage(lang) {
  i18n.active = lang;
  const t = i18n[lang];

  // 更新 UI 文本
  titleText.textContent = t.title;
  welcomeText.textContent = t.welcome;
  selectFolderBtn.textContent = t.selectFolder;
  if (pathDisplay.textContent === i18n.zh.notSelected || pathDisplay.textContent === i18n.en.notSelected) {
    pathDisplay.textContent = t.notSelected;
  }
}

/**
 * 调用 Tauri Dialog 插件打开文件夹选择框
 * 使用 async/await 处理跨进程调用
 */
async function selectFolder() {
  try {
    const t = i18n[i18n.active];
    const selected = await open({
      directory: true,  // 仅允许选择目录
      multiple: false,   // 禁止多选
      title: t.dialogTitle,
    });

    if (selected) {
      pathDisplay.textContent = selected;
      scanDirectory(selected);
    }
  } catch (err) {
    console.error("Failed to open dialog:", err);
    // 错误处理：在 ACGN 场景下通常是因为用户取消或权限问题
  }
}

/**
 * 核心逻辑：扫描本地目录并渲染列表
 * @param {string} path - 用户选择的磁盘路径
 */
async function scanDirectory(path) {
  const t = i18n[i18n.active];
  try {
    // 显示加载状态
    mangaList.innerHTML = `<p style="grid-column: 1/-1">${t.scanning}</p>`;

    // 使用 Tauri fs 插件列出目录项
    const entries = await readDir(path);

    mangaList.innerHTML = "";

    // 过滤出文件夹作为漫画条目（假设一个文件夹代表一部漫画/画集）
    const folders = entries.filter(e => e.isDirectory);

    if (folders.length === 0) {
      mangaList.innerHTML = `<p style="grid-column: 1/-1">${t.noSubfolders}</p>`;
      return;
    }

    // 批量创建漫画卡片
    folders.forEach(folder => {
      const item = document.createElement("div");
      item.className = "manga-item";
      // 这里的 📁 是临时的，未来我们可以调用 Rust 后端提取真实的封面图
      item.innerHTML = `
        <div class="manga-cover">📁</div>
        <div class="manga-title" title="${folder.name}">${folder.name}</div>
      `;
      mangaList.appendChild(item);
    });
  } catch (err) {
    console.error("Failed to scan directory:", err);
    mangaList.innerHTML = `<p style="grid-column: 1/-1; color: #ff64b4">${t.scanFailed}: ${err}</p>`;
  }
}

// 监听 DOM 加载完成事件，初始化交互逻辑
window.addEventListener("DOMContentLoaded", () => {
  selectFolderBtn = document.querySelector("#select-folder");
  pathDisplay = document.querySelector("#path-display");
  mangaList = document.querySelector("#manga-list");
  welcomeText = document.querySelector("#welcome-text");
  titleText = document.querySelector("h1");

  // 默认初始化为中文
  updateLanguage("zh");

  // 为按钮绑定点击事件
  if (selectFolderBtn) {
    selectFolderBtn.addEventListener("click", () => selectFolder());
  }

  // 预留语言切换入口（可以在 UI 上增加按钮调用 updateLanguage("en")）
});
