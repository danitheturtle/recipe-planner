use std::sync::Mutex;

use ascon::AsconXofOutput;
use rand::prelude::*;

mod ascon;
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut seed = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut seed);
    let rng = AsconXofOutput::new_from_input(&seed);

    tauri::Builder::default()
        .manage(Mutex::new(rng))
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::custom_js_command,
            commands::generate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
