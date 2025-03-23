import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import { resolve } from 'path';

// SPAアプリケーション用のページルート
const routes = [
  '/',
  '/manage-news'
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'generate-spa-pages',
      closeBundle() {
        // SPA用の各ルートディレクトリとindex.htmlを生成
        const indexContent = fs.readFileSync(resolve(__dirname, 'dist/index.html'), 'utf-8');
        routes.forEach(route => {
          if (route === '/') return; // ルートディレクトリはスキップ
          const routePath = route.substring(1); // 先頭の/を削除
          const dirPath = resolve(__dirname, `dist/${routePath}`);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          fs.writeFileSync(resolve(dirPath, 'index.html'), indexContent);
        });
        
        // _redirectsファイルを作成
        fs.writeFileSync(
          resolve(__dirname, 'dist/_redirects'),
          '/* /index.html 200'
        );
        
        console.log('SPA pages and redirects generated successfully!');
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Renderでの静的ホスティング用設定
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // SPAネットワークリクエストをindex.htmlにリダイレクトするためのキャッチオールファイル作成
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
}));
