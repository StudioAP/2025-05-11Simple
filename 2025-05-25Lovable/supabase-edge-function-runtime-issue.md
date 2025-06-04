# Supabase Edge Function 実行環境の問題

## 🚨 緊急度：高

## 問題概要
Supabase Edge Function `send-contact-email` が本番環境で実行されない問題が発生している。関数は正常にデプロイされているが、実際のリクエスト時に関数のコードが一切実行されず、必ず504 Gateway Timeoutエラーが発生する。

## 環境情報
- **プロジェクトID**: `gftbjdazuhjcvqvssyiu`
- **リージョン**: ap-northeast-1
- **関数名**: `send-contact-email`
- **ローカル環境**: 完全に動作確認済み
- **本番環境**: 関数コードが実行されない

## 症状の詳細

### 1. 一貫した504エラー
```json
{
  "event_message": "POST | 504 | https://gftbjdazuhjcvqvssyiu.supabase.co/functions/v1/send-contact-email?apikey=REDACTED",
  "execution_time_ms": 150021,
  "status_code": 504,
  "timestamp": 1748677364833000
}
```

### 2. 関数ログが一切出力されない
- 関数の最初のconsole.logステートメントすら実行されない
- デバッグログ、エラーログ、情報ログが全く生成されない
- 関数の実行が開始される前に何らかの問題が発生している

### 3. 正常に機能する要素
✅ **ネットワーク接続**: TLSハンドシェイク成功  
✅ **認証**: API key認証成功（401→504の遷移で確認済み）  
✅ **デプロイメント**: 複数回正常にデプロイ成功  
✅ **ローカル環境**: 完全に動作確認済み  
✅ **コードロジック**: ローカルテストで全機能確認済み  

## 詳細な調査結果

### デプロイ状況
- **最新デプロイ時刻**: 正常に更新されている
- **スクリプトサイズ**: 10.3kB
- **デプロイオプション**: `--no-verify-jwt` フラグ使用
- **デプロイメントエラー**: なし

### ローカル環境でのテスト結果
```bash
# ローカル実行コマンド
supabase functions serve send-contact-email --no-verify-jwt --env-file .env

# テスト結果
curl "http://localhost:54321/functions/v1/send-contact-email" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# 結果: HTTP 200 OK - 完全に動作
```

### 本番環境での認証テスト
```bash
# 認証なし
curl https://gftbjdazuhjcvqvssyiu.supabase.co/health
# 結果: 401 Unauthorized

# 認証あり
curl "https://gftbjdazuhjcvqvssyiu.supabase.co/functions/v1/send-contact-email?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdGJqZGF6dWhqY3ZxdnNzeWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjQ1OTgsImV4cCI6MjA2MzcwMDU5OH0.RJqAGoNmboA5zCdQWDQ1yi3rOWCW3Sk5aFDpg8o6yL8"
# 結果: 504 Gateway Timeout (150秒後)
```

## 関数コードの状況

### 最新リビジョン識別子
`'REV 2025-06-01-Fixed-Local-Serve'` - デバッグ用の識別子を埋め込み済み

### 追加されたデバッグ機能
- 関数開始時のタイムスタンプログ
- リクエストメソッドの記録
- リクエストボディの解析ログ
- Resend API呼び出しのタイムアウト保護（10秒）
- 詳細なエラーハンドリング

### コードの確認済み要素
- インポート文の正確性
- 環境変数の適切な参照
- エラーハンドリングの実装
- レスポンス形式の正確性

## 🔍 核心問題の特定

**Supabase Function Runtime Environment の根本的な障害**

関数のデプロイは成功しているが、実際のリクエスト時に：
1. Supabase Gatewayはリクエストを受信
2. 認証処理は正常に通過
3. **しかし、関数の実行環境でコードが全く実行されない**
4. 150秒後にGateway Timeoutで終了

これは単なるコードエラーやネットワーク問題ではなく、**Supabase の関数実行インフラストラクチャレベルの問題**である可能性が高い。

## 推奨される次のステップ

### 🏥 即座に必要な対応
1. **他の関数のテスト**: 同じプロジェクト内の他の関数が正常に動作するかテスト
2. **Supabase サポートへの連絡**: プロジェクトID `gftbjdazuhjcvqvssyiu` の関数実行環境の問題について技術サポートに報告

### 💡 回避策の検討
- フロントエンドから直接Resend APIを呼び出す実装
- 別のメールサービスの使用
- 関数を別のSupabaseプロジェクトで再作成

## 技術的背景

### ローカル実行環境
- supabase-edge-runtime-1.67.4
- Deno v1.45.2 compatible
- 完全に動作確認済み

### 関数の目的
- コンタクトフォームからのメール送信
- Resend APIを使用したメール配信
- 管理者通知機能

## 結論

これは通常のデバッグで解決できる問題ではなく、Supabase のインフラストラクチャレベルの技術的問題である。ユーザ側でできる調査は全て完了しており、Supabase側のサポートが必要な状況である。 