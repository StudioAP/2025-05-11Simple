# ピアノ教室・リトミック教室検索.org - 日本語メールテンプレート

## 1. メールアドレスの確認 (Confirm your email)

**Subject:** ピアノ教室・リトミック教室検索.org - メールアドレスの確認

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ピアノ教室・リトミック教室検索.org - メールアドレスの確認</title>
    <style>
        /* CSS styles */
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #2563eb; margin-bottom: 10px;">🎹 ピアノ教室・リトミック教室検索.org</h1>
        <h2>メールアドレスの確認</h2>
        <p>こんにちは、{{ .User.FirstName | default .User.Email }}</p>
        <p style="margin-bottom: 20px;">ピアノ教室・リトミック教室検索.orgにご登録いただき、ありがとうございます！</p>
        <p>アカウントを有効化するには、以下のボタンをクリックしてください：</p>
        <a href="{{ .ConfirmationURL }}" class="button">メールアドレスを確認する</a>
        <p class="fallback">または、以下のリンクをブラウザにコピー＆ペーストしてください：<br><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>
        <p class="note">このメールにお心当たりがない場合は、お手数ですが無視してください。</p>
    </div>
    <div class="footer">
        このメールは ピアノ教室・リトミック教室検索.org から自動送信されました。
        <br>
        © 2025 ピアノ教室・リトミック教室検索.org. All rights reserved.
    </div>
</body>
</html>
```

## 2. パスワードリセット (Reset your password)

**Subject:** ピアノ教室・リトミック教室検索.org - パスワードリセット

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ピアノ教室・リトミック教室検索.org - パスワードリセット</title>
    <style>
        /* CSS styles */
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #2563eb; margin-bottom: 10px;">🎹 ピアノ教室・リトミック教室検索.org</h1>
        <h2>パスワードリセット</h2>
        <p>こんにちは、{{ .User.FirstName | default .User.Email }}</p>
        <p style="margin-bottom: 20px;">ピアノ教室・リトミック教室検索.orgアカウントのパスワードリセットがリクエストされました。</p>
        <p>新しいパスワードを設定するには、以下のボタンをクリックしてください：</p>
        <a href="{{ .ConfirmationURL }}" class="button">パスワードをリセット</a>
        <p class="fallback">または、以下のリンクをブラウザにコピー＆ペーストしてください：<br><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>
        <p class="note">このリクエストにお心当たりがない場合は、お手数ですがこのメールを無視してください。パスワードは変更されません。</p>
    </div>
    <div class="footer">
        このメールは ピアノ教室・リトミック教室検索.org から自動送信されました。
        <br>
        © 2025 ピアノ教室・リトミック教室検索.org. All rights reserved.
    </div>
</body>
</html>
```

## 3. マジックリンク (Magic Link)

**Subject:** ピアノ教室・リトミック教室検索.org - ログインリンク

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ピアノ教室・リトミック教室検索.org - ログインリンク</title>
    <style>
        /* CSS styles */
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #2563eb; margin-bottom: 10px;">🎹 ピアノ教室・リトミック教室検索.org</h1>
        <h2>こんにちは、{{ .User.FirstName | default .User.Email }}</h2>
        <p style="margin-bottom: 20px;">ピアノ教室・リトミック教室検索.orgへのログインリンクです。以下のボタンをクリックして簡単にログインできます：</p>
        <a href="{{ .ConfirmationURL }}" class="button">ピアノ教室・リトミック教室検索.orgにログイン</a>
        <p class="fallback">または、以下のリンクをブラウザにコピー＆ペーストしてください：<br><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>
        <p class="note">このメールにお心当たりがない場合は、お手数ですが無視してください。</p>
    </div>
    <div class="footer">
        このメールは ピアノ教室・リトミック教室検索.org から自動送信されました。
        <br>
        © 2025 ピアノ教室・リトミック教室検索.org. All rights reserved.
    </div>
</body>
</html>
``` 