use std::sync::Mutex;

use rand::prelude::*;
use rand_distr::Distribution as _;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, State};

use crate::ascon::AsconXofOutput;

#[derive(Clone, Copy, Serialize, Deserialize)]
pub enum Distribution {
    Bernoulli { p: f64 },
    DiscreteUniform { min: i64, max: i64 },
    Dice { faces: u64, number: u64 },
    Uniform { min: f64, max: f64 },
    Normal { mean: f64, std: f64, round: bool },
    Exponential { rate: f64, round: bool },
    ChiSquared { degrees: f64, round: bool },
}

impl Distribution {
    /// NOTE: this does not check for NAN or INF yet.
    pub fn is_valid(&self) -> bool {
        match *self {
            Distribution::Bernoulli { p } => p >= 0.0 && p <= 1.0,
            Distribution::DiscreteUniform { min, max } => min <= max,
            Distribution::Dice { .. } => true,
            Distribution::Uniform { min, max } => min <= max,
            Distribution::Normal { std, .. } => std > 0.0,
            Distribution::Exponential { rate, .. } => rate > 0.0,
            Distribution::ChiSquared { degrees, .. } => degrees > 0.0,
        }
    }
}

#[tauri::command]
pub fn generate(rng: State<Mutex<AsconXofOutput>>, dist: Distribution) -> Result<f64, ()> {
    if dist.is_valid() {
        let mut rng = rng.lock().unwrap();
        Ok(generate_assume_valid(&mut rng, dist))
    } else {
        Err(())
    }
}
fn generate_assume_valid(rng: &mut AsconXofOutput, dist: Distribution) -> f64 {
    match dist {
        Distribution::Bernoulli { p } => rng.gen_bool(p) as u32 as f64,
        Distribution::DiscreteUniform { min, max } => rng.gen_range(min..=max) as f64,
        Distribution::Dice { faces, number } => {
            let mut r = 0;
            for _ in 0..number {
                r += rng.gen_range(1..=faces)
            }
            r as f64
        }
        Distribution::Uniform { min, max } => rng.gen_range(min..=max),
        Distribution::Normal { mean, std, round } => {
            let d = rand_distr::Normal::new(mean, std).unwrap();
            let mut r = d.sample(rng);
            if round {
                r = r.round()
            }
            r
        }
        Distribution::Exponential { rate, round } => {
            let d = rand_distr::Exp::new(rate).unwrap();
            let mut r = d.sample(rng);
            if round {
                r = r.round()
            }
            r
        }
        Distribution::ChiSquared { degrees, round }  => {
            let d = rand_distr::ChiSquared::new(degrees).unwrap();
            let mut r = d.sample(rng);
            if round {
                r = r.round()
            }
            r
        }
    }
}

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
