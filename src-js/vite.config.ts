import { defineConfig, loadEnv, UserConfig } from 'vite';
import * as react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export const makeConfig = ({
  dirname,
  mode = 'development',
}: {
  dirname: string;
  mode: string | undefined;
}): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  const { VITE_UI_PORT: uiPort = '6060' } = process.env;
  return {
    cacheDir: '../node_modules/.vite',
    root: dirname,
    clearScreen: false,
    server: {
      port: parseInt(uiPort ?? '6060'),
      strictPort: true,
    },
    plugins: [react.default(), tsconfigPaths()],
    css: {
      postcss: './src-js/postcss.config.js'
    },
    // to access the Tauri environment variables set by the CLI with information about the current target
    envPrefix: [
      'VITE_',
      'TAURI_PLATFORM',
      'TAURI_ARCH',
      'TAURI_FAMILY',
      'TAURI_PLATFORM_VERSION',
      'TAURI_PLATFORM_TYPE',
      'TAURI_DEBUG',
    ],
    build: {
      outDir: '../dist',
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  };
};
export default defineConfig(makeConfig({ dirname: './src-js/', mode: process.env.NODE_ENV }));
