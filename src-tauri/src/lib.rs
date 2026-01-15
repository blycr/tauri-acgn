// 了解更多关于 Tauri 命令的信息，请访问 https://tauri.app/develop/calling-rust/

/**
 * 一个简单的打招呼函数，演示如何从 Rust 返回数据给前端
 * #[tauri::command] 宏用于将 Rust 函数导出为前端可调用的 API
 */
#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好, {}! 这是来自 Rust 后端的问候!", name)
}

/**
 * 桌面端入口点
 */
pub fn run() {
    // 使用 Builder 模式构建应用实例
    tauri::Builder::default()
        // 注册插件：文件系统支持
        .plugin(tauri_plugin_fs::init())
        // 注册插件：系统对话框支持（用于选择文件夹）
        .plugin(tauri_plugin_dialog::init())
        // 注册插件：系统默认浏览器/文件管理器打开链接等功能
        .plugin(tauri_plugin_opener::init())
        // 注册所有的 command 处理器
        .invoke_handler(tauri::generate_handler![greet])
        // 运行应用：整合生成的上下文（图标、配置等）
        .run(tauri::generate_context!())
        // 异常处理
        .expect("运行 Tauri 应用时发生错误");
}
