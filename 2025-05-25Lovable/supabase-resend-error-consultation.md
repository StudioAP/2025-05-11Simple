# Supabase Edge Function (send-general-contact) の Resend API エラーに関する相談

## 1. 問題の背景と現在の状況

Supabase Edge Function `send-general-contact` が、お問い合わせフォームからのメール送信時に500エラーを返しています。
以前はログが全く出力されませんでしたが、`RESEND_API_KEY` の取得タイミングを `Deno.serve` のコールバック関数内に移動したところ、Supabase管理画面に以下のエラーログが出力されるようになりました。

## 2. 確認されたエラーログ (Supabase管理画面より)

### エラーパターン1 (最新のログ - 主な問題)

```json
{
  "event_message": "Email sending failed: {\\n  adminResponseStatus: 422,\\n  adminResponseBody: \'{\\"statusCode\\":422,\\"message\\":\\"Invalid `reply_to` field. The email address needs to follow the `email@example.com` or `Name <email@example.com>` format.\\",\\"name\\":\\"validation_error\\"}\',\\n  senderResponseStatus: 422,\\n  senderResponseBody: \'{\\"statusCode\\":422,\\"message\\":\\"Invalid `to` field. The email address needs to follow the `email@example.com` or `Name <email@example.com>` format.\\",\\"name\\":\\"validation_error\\"}\'\\n}",
  "event_type": "Log",
  "level": "error",
  "timestamp": "1748693437051237" 
}
```

**エラー内容の解析:**

*   **管理者向けメール (admin):** `adminResponseStatus: 422`。Resend APIからのエラーメッセージは「Invalid `reply_to` field. The email address needs to follow the `email@example.com` or `Name <email@example.com>` format.」
*   **送信者向けメール (sender):** `senderResponseStatus: 422`。Resend APIからのエラーメッセージは「Invalid `to` field. The email address needs to follow the `email@example.com` or `Name <email@example.com>` format.」

**示唆される問題:** Resend APIに渡している `reply_to` (管理者向けメール) および `to` (送信者向けメール) のメールアドレス形式が、Resendの要求するフォーマット (`email@example.com` または `Name <email@example.com>`) に準拠していない。これは、フォームから入力されたメールアドレス (`senderEmail`) が不正な形式であるか、APIに渡す際の処理に問題がある可能性を示唆しています。

### エラーパターン2 (少し前のログ - Resend設定の問題)

```json
{
  "event_message": "Email sending failed: {\\n  adminResponseStatus: 403,\\n  adminResponseBody: \'{\\"statusCode\\":403,\\"message\\":\\"You can only send testing emails to your own email address (akipinnote@gmail.com). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain.\\",\\"name\\":\\"validation_error\\"}\',\\n  senderResponseStatus: 200,\\n  senderResponseBody: null\\n}",
  "event_type": "Log",
  "level": "error",
  "timestamp": "1748690403288692"
}
```

**エラー内容の解析:**

*   **管理者向けメール (admin):** `adminResponseStatus: 403`。Resend APIからのエラーメッセージは「You can only send testing emails to your own email address (akipinnote@gmail.com). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain.」
*   **送信者向けメール (sender):** `senderResponseStatus: 200` (成功)。

**示唆される問題:** 現在の `from` アドレス (`Piano Search <onboarding@resend.dev>`) はResendのテスト用ドメインであり、認証済みアカウントのメールアドレス (`akipinnote@gmail.com`) 以外への送信が制限されています。管理者宛メール (`piano.rythmique.find@gmail.com`) がこれに該当するためブロックされています。解決にはResendでのドメイン認証と、認証済みドメインを使用した `from` アドレスへの変更が必要です。

## 3. 関連する関数コード (抜粋)

`rhythm-find-harmony/supabase/functions/send-general-contact/index.ts`

```typescript
// Deno Edge Function環境用
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface GeneralContactFormData {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    \'Access-Control-Allow-Origin\': \'*\',
    \'Access-Control-Allow-Headers\': \'authorization, x-client-info, apikey, content-type\',
    \'Access-Control-Allow-Methods\': \'POST, OPTIONS\',
  };

  if (req.method === \'OPTIONS\') {
    return new Response(\'ok\', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get(\'RESEND_API_KEY\');
    const { senderName, senderEmail, subject, message }: GeneralContactFormData = await req.json();

    // (必須フィールドの検証、APIキーの確認は省略)

    // 管理者へのメール送信
    const adminEmailResponse = await fetch(\'https://api.resend.com/emails\', {
      method: \'POST\',
      headers: {
        \'Authorization\': `Bearer ${RESEND_API_KEY}`,
        \'Content-Type\': \'application/json\',
      },
      body: JSON.stringify({
        from: \'Piano Search <onboarding@resend.dev>\', // 問題点2に関連
        to: [\'piano.rythmique.find@gmail.com\'],
        reply_to: senderEmail, // 問題点1に関連
        subject: `【ピアノサーチ】${subject}`,
        html: "...", // HTML本文
      }),
    });

    // 送信者への確認メール送信
    const senderEmailResponse = await fetch(\'https://api.resend.com/emails\', {
      method: \'POST\',
      headers: {
        \'Authorization\': `Bearer ${RESEND_API_KEY}`,
        \'Content-Type\': \'application/json\',
      },
      body: JSON.stringify({
        from: \'Piano Search <onboarding@resend.dev>\', // 問題点2に関連
        to: [senderEmail], // 問題点1に関連
        subject: \'【ピアノサーチ】お問い合わせを受け付けました\',
        html: "...", // HTML本文
      }),
    });

    if (!adminEmailResponse.ok || !senderEmailResponse.ok) {
      // ... (エラーログ出力、JSON形式でのレスポンス返却)
    }
    // ... (成功時のレスポンス返却)
  } catch (error) {
    // ... (エラーログ出力、JSON形式でのレスポンス返却)
  }
});
```

## 4. 提案された対策案

### 4.1. コード修正による対策 (主にエラーパターン1に対応)

1.  **入力メールアドレスのバリデーション強化:**
    *   `senderEmail` がResendの要求するメールアドレス形式 (`email@example.com`) になっているか、正規表現などで送信前にチェックする。
    *   無効な場合は、Resend APIを呼び出す前にクライアントに400エラー（詳細なメッセージ付き）を返す。
2.  **Resend APIへのパラメータ形式確認:**
    *   `to` および `reply_to` に渡すメールアドレスが、確実に文字列であり、かつ配列でラップされていることを確認する (例: `to: [validSenderEmail]`)。
    *   特に `reply_to: senderEmail` の部分で、`senderEmail` が単一の有効なメールアドレス文字列であることを保証する。
3.  **`from` アドレスに関する注意喚起 (エラーパターン2の根本解決ではないが、コード上で):**
    *   現在の `from: \'Piano Search <onboarding@resend.dev>\'` がテスト用であり、本番運用のためにはResendでのドメイン認証と認証済みドメインからのメールアドレスへの変更が必須であることをコードのコメント等で明記する。

#### 具体的なコード修正イメージ (一部抜粋):

```typescript
// ...
    const { senderName, senderEmail, subject, message }: GeneralContactFormData = await req.json();

    // メールアドレス形式の簡易バリデーション (より厳密な正規表現を推奨)
    const isValidEmail = (email: string): boolean => {
      if (!email) return false;
      // 簡単な形式チェック（実際にはもっと複雑な正規表現が良い）
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!isValidEmail(senderEmail)) {
      console.error(\'Invalid senderEmail format:\', senderEmail);
      return new Response(
        JSON.stringify({
          success: false,
          message: \'入力されたメールアドレスの形式が正しくありません。\',
          detail: `Invalid email format: ${senderEmail}. Expected format: email@example.com`,
        }),
        { status: 400, headers: { ...corsHeaders, \'Content-Type\': \'application/json\' } }
      );
    }

    // 管理者へのメール送信
    const adminEmailResponse = await fetch(\'https://api.resend.com/emails\', {
      // ...
      body: JSON.stringify({
        from: \'Piano Search <onboarding@resend.dev>\', // TODO: Resendでドメイン認証後、認証済みドメインのメールアドレスに変更
        to: [\'piano.rythmique.find@gmail.com\'],
        reply_to: [senderEmail], // 配列で渡す & senderEmailはバリデーション済み
        subject: `【ピアノサーチ】${subject}`,
        html: "...", 
      }),
    });

    // 送信者への確認メール送信
    const senderEmailResponse = await fetch(\'https://api.resend.com/emails\', {
      // ...
      body: JSON.stringify({
        from: \'Piano Search <onboarding@resend.dev>\', // TODO: Resendでドメイン認証後、認証済みドメインのメールアドレスに変更
        to: [senderEmail], // 配列で渡す & senderEmailはバリデーション済み
        subject: \'【ピアノサーチ】お問い合わせを受け付けました\',
        html: "...",
      }),
    });
// ...
```

### 4.2. Resend設定による対策 (エラーパターン2の根本解決)

*   **Resend管理画面でのドメイン認証:**
    *   Resend側で送信元ドメイン (`rhythm-find-harmony.com`) が正しく認証済み（Verified）であるか再確認。
    *   SPF/DKIMレコードがDNSに正しく設定され、Resend側で認識されているか。
*   **APIキーの権限**: 現在使用しているResend APIキーが、メール送信に必要な権限 (`full_access` または `sending_access`) を持っているかResend管理画面で確認。
*   **To/Fromアドレス形式**: `to`, `from` フィールドのメールアドレス形式がRFC標準に準拠しているか。
    *   `from` はResendで認証済みドメインのメールアドレスである必要がある。

## 5. 他のAIに聞きたいこと

1.  上記のエラー分析と原因の特定は妥当か？
2.  提案されたコード修正案（特にメールバリデーション、Resend APIへのパラメータ形式）は適切かつ十分か？他に考慮すべき点はあるか？
3.  Resendのドメイン認証と`from`アドレスの変更以外に、エラーパターン2（403エラー）に関して考えられる対策はあるか？
4.  これらの対策を実施することで、`send-general-contact`関数が安定してメール送信できるようになる見込みは高いか？
5.  その他、この問題を解決するために役立つアドバイスや視点があれば教えてほしい。 