# Supabase Edge Functionエラー (500 + JSON Parse Error) の相談

## 📅 状況
- **日時**: 2025年5月31日 (以前の問題解決直後)
- **プロジェクト**: Supabase project `gftbjdazuhjcvqvssyiu` (ap-northeast-1)
- **エラー発生箇所**: ブラウザのコンソール

## 🎯 確認されたエラーメッセージ

1.  **リソースロード失敗**:
    ```
    gftbjdazuhjcvqvssyiu.supabase.co/functions/v1/send-general-contact:1 Failed to load resource: the server responded with a status of 500 ()
    ```
2.  **フロントエンドJSONパースエラー**:
    ```
    お問い合わせ送信エラー: SyntaxError: Unexpected token 'F', "Failed to send email" is not valid JSON
    ```

## 📝 ABEさんによる初期分析 (非常に的確)

| 情報                                                               | 意味                                                             | 影響                        |
| ---------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------- |
| `Failed to load resource … 500`                                  | Edge Function `/send-general-contact` が 500 を返した             | バックエンド側で例外／return 500     |
| `Unexpected token 'F', "Failed to send email" is not valid JSON` | フロントは **JSON を期待** → 返って来た本文がただの文字列 `Failed to send email` だった | `JSON.parse()` が失敗し JS 例外 |

**結論**: 「メール送信自体に失敗」+「エラーレスポンスが JSON 形式になっていない」の 2 段階問題。

## ❓ 現状の不明点・確認が必要な点

1.  **`send-general-contact` 関数の実体**:
    *   この名前の関数ファイル (`supabase/functions/send-general-contact/index.ts`) が実際に存在するか？
    *   あるいは、以前修正した `send-contact-email` 関数をフロントエンドから `send-general-contact` という名前で呼び出しているのか？
    *   ワークスペースルート直下の `supabase/functions` ディレクトリには `ping` と `env-check` しか確認できなかった。
    *   以前作業していた `rhythm-find-harmony/supabase/functions/send-contact-email/index.ts` との関連性は？

## 🔥 想定される問題と対策 (ABEさん提案ベース)

### 1. 500エラーの原因特定
   - **アクション**: `supabase functions logs send-general-contact --project-ref gftbjdazuhjcvqvssyiu --limit 20` を実行し、サーバーログを確認。
   - **主な原因候補**:
     - リクエストJSONの必須フィールド不足 (`Missing field …`)
     - 環境変数 `RESEND_API_KEY` の未設定または不正 (`RESEND_API_KEY not set`)
     - Resend APIキーの無効化またはテスト制限 (`fetch ... 401`)
     - コード内のnullガード漏れ (`TypeError: Cannot read property`)

### 2. エラーレスポンスのJSON形式統一
   - **アクション**: 対象関数の `catch` ブロックおよびエラー時の `return new Response(...)` を以下のように修正。
     ```typescript
     catch (err) {
       console.error('send-general-contact error', err);
       return new Response(
         JSON.stringify({
           success: false,
           message: 'Failed to send email', // 具体的なエラーメッセージにしても良い
           detail: err instanceof Error ? err.message : String(err),
         }),
         { status: 500,
           headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' /* CORS対応 */ } }
       );
     }
     ```

### 3. フロントエンドの堅牢化
   - **アクション**: `fetch` 呼び出し箇所を修正し、レスポンスがJSONでない場合も考慮。
     ```typescript
     try {
       const res = await fetch(url, { /* ... */ });
       // レスポンスがJSON形式でない場合も考慮してパース
       let jsonResponse;
       try {
         jsonResponse = await res.json();
       } catch (e) {
         // JSONパースに失敗した場合、エラーレスポンスを生成
         const errorText = await res.text(); // 元のテキストを取得試行
         console.error('Non-JSON response received:', errorText);
         jsonResponse = {
           success: false,
           message: 'サーバーから予期しない形式の応答がありました。内容: ' + errorText.slice(0,100), // エラーメッセージにテキスト内容を含める
           detail: 'Response was not valid JSON'
         };
       }
       
       if (!res.ok || !jsonResponse.success) { // ステータスコードもチェック
         throw new Error(jsonResponse.message || '不明なエラーが発生しました。');
       }
       // 成功処理
     } catch (e) {
       console.error('お問い合わせ送信エラー', e);
       // UIにエラーメッセージを表示
     }
     ```

### 4. 一般的な落とし穴 (関数が異なる場合)
   - **環境変数 (Secrets) の設定漏れ**: 関数ごとに設定が必要。
   - **ビルド漏れ**: `supabase functions build` を忘れ、古い形式のimportが残っている。
   - **CORSプリフライト問題**: `OPTIONS` リクエストへの対応漏れ。

## 🔍 相談したい技術的質問

1.  **`send-general-contact` 関数の特定**: この関数はどこに定義されているのか？ `send-contact-email` と同一か、別ファイルか？パスはどこか？
2.  **上記特定後、500エラーの根本原因は何か？** (サーバーログに基づく)
3.  **エラーレスポンス形式の統一**: 提示された修正案で問題ないか？より良い方法はあるか？
4.  **フロントエンドの堅牢化**: 提示された修正案で問題ないか？より良いエラーハンドリング方法はあるか？
5.  **その他**: この状況で見落としている可能性のある問題点や、確認すべき事項はあるか？

**技術的に適切な判断と具体的なネクストアクションを求めています。** 