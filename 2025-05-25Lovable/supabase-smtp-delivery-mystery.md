| **設定項目** | **現在の値** | **期待値/状態** |
| :--- | :--- | :--- |
| **Sender Name** | `ピアノ教室・リトミック教室検索.org` | ✅ 設定済み |
| **Sender Email** | `info@piaryth.org` | ✅ 設定済み |
| **Custom SMTP** | プロバイダ情報 | ❓ 未確認（Supabaseサポート待ち） |
| `send-contact-email` | `resend.emails.send` | `from`: `ピアノ教室・リトミック教室検索.org <info@piaryth.org>` |
| `send-general-contact` | `resend.emails.send` | `from`: `ピアノ教室・リトミック教室検索.org <noreply@piaryth.org>` |
| `stripe-test` | `resend.emails.send` | `from`: `StudioAP <abe.tachibana@gmail.com>` |

2.  **`from` アドレスのドメイン統一**:
    *   すべての送信元メールアドレスを `@piaryth.org` ドメインに統一する。
3.  **Sender Name**: `Piano Search` → `ピアノ教室・リトミック教室検索.org`
    *   Supabaseのメールテンプレート設定で送信者名を統一する。

#### 2.2.3. 問い合わせと再現テスト 