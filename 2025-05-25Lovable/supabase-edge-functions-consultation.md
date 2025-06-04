# Supabase Edge Functions 技術的異常事象の相談

## 📅 状況
- **日時**: 2025年5月31日
- **プロジェクト**: Supabase project `gftbjdazuhjcvqvssyiu` (ap-northeast-1)
- **問題**: 同一設定のEdge Functionsで異なる動作結果

## 🎯 核心的問題

### 事実
```
同一Supabaseプロジェクト内で：
✅ send-contact-email (10KB): 200 OK + 実メール配信成功
❌ ping (1KB, 最小構成): 500 Internal Server Error
❌ env-check (1KB): 500 Internal Server Error
```

### 異常性
- **同一ビルド設定**: 全て `import "jsr:@supabase/functions-js/edge-runtime.d.ts"` + `Deno.serve()`
- **同一プロジェクト**: 同一リージョン・同一デプロイ環境
- **同一タイミング**: 連続してデプロイ・テスト実行
- **異なる結果**: ファイルサイズと複雑さが唯一の違い

## 🧪 実験結果

### テスト1: ping関数最小化
```typescript
// 最小構成テスト
export default () => new Response('pong')
```
**結果**: ❌ 500 Error

### テスト2: import除去
```typescript
// import完全除去
export default () => new Response('pong')
```
**結果**: ❌ 500 Error

### テスト3: Deno.serve形式
```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
Deno.serve(() => new Response('pong'))
```
**結果**: ❌ 500 Error

### テスト4: send-contact-email確認
**結果**: ✅ 200 OK + 実メール配信確認済み

## 📊 動作する関数の特徴

### send-contact-email詳細
- **サイズ**: 約10KB
- **複雑度**: HTTP fetch（Resend API）、複数import、エラーハンドリング
- **外部依存**: Resend API呼び出し
- **応答時間**: 1.5秒
- **成功率**: 100%（複数回テスト）

```typescript
// 動作している関数の基本構造
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req: Request): Promise<Response> => {
  // Resend API呼び出し
  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData)
  });
  // 複雑な処理...
  return new Response(JSON.stringify({success: true}));
});
```

## 🚨 技術的仮説

### 有力な仮説
1. **ファイルサイズ依存**: 小さすぎるとランタイム初期化に失敗
2. **キャッシュ依存**: 大きいファイルは別キャッシュ経路で成功
3. **ビルド順序依存**: デプロイ順序により内部状態が異なる
4. **リソース競合**: 同時デプロイでランタイムリソース競合

### 証拠
- **一貫性の欠如**: 同一設定で異なる結果
- **サイズ相関**: 大きい関数のみ成功
- **タイミング要因**: 同時期デプロイで差異

## 🎯 運用上の判断要求

### 現在の選択肢
1. **安全重視**: Edge Functions問題完全解決まで運用延期
2. **スピード重視**: 監視強化してメイン機能（send-contact-email）で運用開始
3. **慎重重視**: ping問題解決 + 監視実装後に運用開始

### 運用リスク評価が必要な点
- **現在動作する機能が将来も安定するか**
- **小さな修正で再び500/504エラーが発生するか**
- **他の関数追加時に全体が不安定になるか**

## 📋 追加調査候補

### Supabase側で確認できること
1. **Dashboard Logs**: BOOT_ERROR、MODULE_ERROR の有無
2. **Metrics**: メモリ使用量、CPU使用量の差異
3. **Build Logs**: コンパイル過程での警告・エラー
4. **Regional Difference**: 他リージョンでの動作確認

### 技術的対策候補
1. **Local Build**: Deno bundle で事前ビルドしてからデプロイ
2. **Dependency Management**: import map 使用で依存関係明確化
3. **Health Check**: 別の軽量関数でヘルスチェック確立
4. **Monitoring**: メール送信ログをDB保存で監視強化

## 🔍 相談したい技術的質問

1. **この現象の技術的原因として最も可能性が高いものは何か？**
2. **同一設定で異なる結果が出るSupabase Edge Functionsの既知の問題があるか？**
3. **運用リスクを最小化する最適なアプローチは何か？**
4. **ping関数500エラーを解決する具体的な手順は？**
5. **この状況でメイン機能（send-contact-email）の運用を開始するのは技術的に妥当か？**

## 📊 現在の運用判断待ち状況

- **機能要件**: ✅ クリア（メール送信動作確認済み）
- **安定性**: ⚠️ 不明（同一設定で異なる動作）
- **監視**: ❌ 未実装
- **ロールバック**: ❌ 未準備

**技術的に適切な判断を求めています。** 