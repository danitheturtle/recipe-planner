use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn progress_example(app: AppHandle, payload: String) {
    app.emit("example-started", &payload).unwrap();
    for progress in [1, 15, 50, 80, 100] {
        app.emit("example-progressed", progress).unwrap();
    }
    app.emit("example-finished", &payload).unwrap();
}

#[tauri::command]
pub fn custom_js_command(message: String) {
    println!("I was invoked from JavaScript! {}", message);
}
