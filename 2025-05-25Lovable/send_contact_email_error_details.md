# Supabase Edge Function でのメール送信エラーに関する問い合わせ

現在、Supabase Edge Function を利用したお問い合わせフォームからのメール送信でエラーが発生しており、解決策についてアドバイスを求めています。

## 状況概要

お問い合わせフォームからデータが送信されると、Supabase Edge Function `send-contact-email` が呼び出されます。この関数は、メール送信サービスとして **Resend** を利用し、以下の2通のメールを送信しようとします。

1.  **教室運営者宛**: お問い合わせがあった旨と内容を通知するメール。
2.  **お問い合わせ送信者宛**: お問い合わせを受け付けたことを通知する確認メール。

現在、このメール送信処理の途中で「500 (Internal Server Error)」が発生しています。

## プロジェクト情報

*   **Supabase Project ID**: `gftbjdazuhjcvqvssyiu`
*   **メール送信サービス**: Resend
*   **発生箇所**: Supabase Edge Function `send-contact-email`

## エラーログ

SupabaseのFunctionログには、以下のエラーが出力されています。

```
Email sending failed: {
  classroomResponse: 200,
  senderResponse: 403,
  classroomError: null,
  senderError: \'\'\'{"statusCode":403,"message":"You can only send testing emails to your own email address (akipinnote@gmail.com). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain.","name":"validation_error"}\'\'\'
}
```

また、その直前のログには、送信しようとしたメールのデータが出力されています。

```
Sending email with data: {
  classroomName: "ああああああああああ",
  classroomEmail: "akipinnote@gmail.com", // 教室のメールアドレス（受信者）
  senderName: "ggggg",
  senderEmail: "abe-a@tachibana-u.ac.jp" // 問い合わせ送信者のメールアドレス
}
```

## `send-contact-email` Edge Function のコード

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface ContactFormData {
  classroomName: string
  classroomEmail: string
  senderName: string
  senderEmail: string
  senderPhone?: string
  message: string
}

serve(async (req) => {
  // CORSヘッダーを設定
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'POSTメソッドのみ許可されています。'
        }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { classroomName, classroomEmail, senderName, senderEmail, senderPhone, message }: ContactFormData = await req.json()

    // 必須フィールドの検証
    if (!classroomName || !classroomEmail || !senderName || !senderEmail || !message) {
      console.error('Missing required fields:', { classroomName, classroomEmail, senderName, senderEmail, message })
      return new Response(
        JSON.stringify({
          success: false,
          message: '必須フィールドが不足しています。'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // API キーの確認
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return new Response(
        JSON.stringify({
          success: false,
          message: 'メール送信の設定に問題があります。'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Sending email with data:', { classroomName, classroomEmail, senderName, senderEmail })

    // 教室運営者へのメール内容
    const toClassroomHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">【ピアノサーチ】お問い合わせがありました</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-bottom: 15px;">お問い合わせ内容</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">教室名:</td>
              <td style="padding: 8px 0;">${classroomName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">お名前:</td>
              <td style="padding: 8px 0;">${senderName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">メールアドレス:</td>
              <td style="padding: 8px 0;">${senderEmail}</td>
            </tr>
            ${senderPhone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">電話番号:</td>
              <td style="padding: 8px 0;">${senderPhone}</td>
            </tr>
            ` : \'\'\'\'\'\'}
          </table>
        </div>
        
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h3 style="color: #666; margin-bottom: 15px;">お問い合わせ内容:</h3>
          <p style="line-height: 1.6; white-space: pre-line;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            このメールは <strong>ピアノサーチ</strong> のお問い合わせフォームから自動送信されました。<br>
            お問い合わせいただいた方に直接ご返信ください。
          </p>
        </div>
      </div>
    `

    // 送信者への確認メール内容
    const toSenderHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">【ピアノサーチ】お問い合わせを受け付けました</h2>
        
        <p>${senderName} 様</p>
        
        <p>下記の内容でお問い合わせを受け付けました。<br>
        教室からのご連絡をしばらくお待ちください。</p>
        
        <p style="font-size: 0.9em; color: #777;">※このメールは送信専用です。ご返信いただいてもお答えできませんのでご了承ください。</p>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-bottom: 15px;">お問い合わせ内容</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">教室名:</td>
              <td style="padding: 8px 0;">${classroomName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">お名前:</td>
              <td style="padding: 8px 0;">${senderName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">メールアドレス:</td>
              <td style="padding: 8px 0;">${senderEmail}</td>
            </tr>
            ${senderPhone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">電話番号:</td>
              <td style="padding: 8px 0;">${senderPhone}</td>
            </tr>
            ` : \'\'\'\'\'\'}
          </table>
        </div>
        
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h3 style="color: #666; margin-bottom: 15px;">お問い合わせ内容:</h3>
          <p style="line-height: 1.6; white-space: pre-line;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            このメールは <strong>ピアノサーチ</strong> から自動送信されました。<br>
            ご不明点がございましたら、お気軽にお問い合わせください。
          </p>
        </div>
      </div>
    `

    // 教室運営者へのメール送信
    const classroomEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer ${RESEND_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Piano Search <onboarding@resend.dev>', // 将来的には認証済みドメインのメールアドレスに変更
        to: [classroomEmail],
        reply_to: senderEmail, // 教室運営者がこのメールに返信すると、お問い合わせ主のアドレスに送信される
        subject: \`【ピアノサーチ】${classroomName}へのお問い合わせ\`,
        html: toClassroomHtml,
      }),
    })

    // 送信者への確認メール送信
    const senderEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer ${RESEND_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Piano Search <onboarding@resend.dev>', // 将来的には認証済みドメインのメールアドレスに変更 (例: noreply@your-domain.com)
        to: [senderEmail], // 宛先は問い合わせ送信者
        subject: '【ピアノサーチ】お問い合わせを受け付けました',
        html: toSenderHtml,
      }),
    })

    if (!classroomEmailResponse.ok || !senderEmailResponse.ok) {
      // 詳細なエラー情報を取得
      const classroomError = !classroomEmailResponse.ok ? await classroomEmailResponse.text() : null
      const senderError = !senderEmailResponse.ok ? await senderEmailResponse.text() : null
      
      console.error('Email sending failed:', {
        classroomResponse: classroomEmailResponse.status,
        senderResponse: senderEmailResponse.status,
        classroomError,
        senderError
      })
      return new Response(
        JSON.stringify({
          success: false,
          message: 'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'お問い合わせを送信しました。確認メールをご確認ください。'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send-contact-email function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
```

## 問題点と推測

エラーログ `senderError: \'\'\'{"statusCode":403,"message":"You can only send testing emails to your own email address (akipinnote@gmail.com). To send emails to other recipients, please verify a domain at resend.com/domains, and change the \`from\` address to an email using this domain."...}\'\'\'` から、Resendの制約により、認証されていないドメインからのメール送信がブロックされていると判断できます。

具体的には、`from` アドレスが `Piano Search <onboarding@resend.dev>` に固定されているため、Resendのテスト環境の制約（登録されたメールアドレス以外への送信不可）に抵触していると考えられます。

## 期待されるメール送信フロー

ユーザー（お問い合わせ主）がお問い合わせフォームから送信すると、以下のようなメールフローを期待しています。

1.  **教室運営者宛メール**:
    *   **送信元(From)**: ウェブサイトの代表メールアドレス（例: `contact@your-verified-domain.com` や `noreply@your-verified-domain.com`）。Resendで認証済みのドメインである必要があります。
    *   **宛先(To)**: 教室運営者のメールアドレス (`classroomEmail`)。
    *   **返信先(Reply-To)**: お問い合わせ主のメールアドレス (`senderEmail`)。
    *   **件名**: 例「【ピアノサーチ】〇〇教室へのお問い合わせ」
    *   **本文**: お問い合わせ主の名前、メールアドレス、電話番号（任意）、メッセージ本文を含む。
    *   **目的**: 教室運営者がお問い合わせ内容を確認し、お問い合わせ主のメールアドレス宛に直接返信できるようにするため。

2.  **お問い合わせ送信者宛メール**:
    *   **送信元(From)**: ウェブサイトの代表メールアドレス（例: `noreply@your-verified-domain.com`）。Resendで認証済みのドメインである必要があります。
    *   **宛先(To)**: お問い合わせ主のメールアドレス (`senderEmail`)。
    *   **件名**: 例「【ピアノサーチ】お問い合わせを受け付けました」
    *   **本文**: 「〇〇様、お問い合わせありがとうございます。教室運営者からの返信をお待ちください。このメールは送信専用です。」といった自動返信の内容と、送信されたお問い合わせ内容のコピー。
    *   **目的**: お問い合わせが正常に受け付けられたことを通知するため。

## 質問

1.  このエラーを解決し、上記の「期待されるメール送信フロー」を実現するために、Resendでのドメイン認証以外にどのような対応が必要ですか？
2.  Resendでドメイン（例: `your-domain.com`）を認証した後、Edge Functionのコードは具体的にどのように修正するのが最も適切ですか？特に `from` アドレスの設定について、以下のように考えていますが、ご意見をお願いします。
    *   **教室運営者宛メールの `from`**: `お問い合わせ窓口 <contact@your-domain.com>` など。
    *   **お問い合わせ送信者宛メールの `from`**: `ピアノサーチ事務局 <noreply@your-domain.com>` など（返信不可であることを明確にするため）。
3.  `reply_to` の設定は現状のままで、期待する動作（教室運営者がお問い合わせメールに返信すると、お問い合わせ主のアドレスに送信される）は実現可能でしょうか？
4.  その他、セキュリティ（例: `RESEND_API_KEY` の取り扱い、不正利用対策など）や、より堅牢な実装にするためのアドバイスがあれば教えてください。

よろしくお願いいたします。 