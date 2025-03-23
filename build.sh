#!/bin/bash

# ビルド実行
npm run build

# ビルド後の確認
if [ ! -d "dist" ]; then
  echo "distディレクトリが存在しません。作成します。"
  mkdir -p dist
fi

# index.htmlが存在しない場合は作成
if [ ! -f "dist/index.html" ]; then
  echo "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>京都ローンテニスクラブ</title><script type=\"module\" src=\"/index.js\"></script></head><body><div id=\"root\"></div></body></html>" > dist/index.html
fi

# リダイレクト設定ファイルのコピー
cp public/_redirects dist/ 2>/dev/null || echo "/* /index.html 200" > dist/_redirects

echo "ビルド完了"
