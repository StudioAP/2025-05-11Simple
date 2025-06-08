# Playwrightにおける「管理画面」リンククリックの不安定性に関する相談

## 1. 問題の概要

WebアプリケーションのPlaywrightを用いたE2Eテストにおいて、ユーザーログイン後にトップページのヘッダーに表示される「管理画面」リンクのクリックが安定せず、頻繁にタイムアウトエラーが発生しています。

-   要素自体は開発者ツールで確認するとHTML上に存在しており、期待される `data-testid` や `href` 属性も付与されています。
-   複数のセレクター（`data-testid`指定、`href`属性とテキスト内容の組み合わせなど）を試しましたが、クリックの成功率が向上しません。
-   Playwrightの基本的な内部待機だけでは、要素がクリック可能な状態になるのを十分に待てていない可能性があります。

## 2. テスト環境と対象アプリケーション

-   **対象URL**: `https://0abff097.piano-rythmique.pages.dev/`
-   **テストフレームワーク**: Playwright (v1.41+ を想定)
-   **対象アプリケーションの技術スタック（推測）**: React, Vite, （状態管理やルーティングは標準的なライブラリを使用している可能性が高い）

## 3. 問題発生手順

1.  ログインページ (`/auth`) にアクセスし、有効な認証情報でログインを実行します。
2.  ログイン成功後、トップページ (`/`) に遷移します。（場合によっては手動でトップページに移動することもあります）
3.  トップページのヘッダー領域に表示されている「管理画面」というテキストを持つリンクをクリックしようとします。
4.  このクリック操作がタイムアウトエラー（例: `Timeout 30000ms exceeded. Call log: - waiting for locator(...)`）となり、テストが失敗します。

## 4. 確認済みのHTML構造（ログイン後、トップページヘッダー）

```html
<header class="bg-white shadow-sm py-4 sticky top-0 z-50">
  <div class="container mx-auto px-4 flex justify-between items-center">
    <!-- ... その他のヘッダー要素 ... -->
    <div class="space-x-2">
      <a class="inline-flex items-center justify-center gap-2 ..." 
         href="/dashboard" 
         data-testid="header-dashboard-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ... class="lucide lucide-layout-dashboard ...">
          <!-- SVG略 -->
        </svg>
        管理画面
      </a>
      <!-- ... その他の要素 ... -->
    </div>
  </div>
</header>
```

## 5. これまでに試したセレクターとアプローチ

-   `a[data-testid='header-dashboard-link']`
-   `a[href="/dashboard"]:has-text('管理画面')`
-   Playwrightの `click()` が持つデフォルトの待機タイムアウト（30秒）

## 6. 考えられる原因（初期考察と追加の観点）

### 初期考察
-   DOMレンダリングタイミングのズレ、CSSアニメーション/トランジション、透明なオーバーレイ要素、Reactのハイドレーション遅延など。

### 追加で疑うべき根本原因
| 観点                           | 具体例                                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **マウントの二度手間**                | 認証状態の切り替えで `<Header>` コンポーネント自体が再マウントされると、Playwright が最初に取得した DOM ノードが **GC 済みの幽霊ノード** になる。`React.StrictMode` を有効にした開発ビルドで起きやすい。 |
| **Re-render 中のレイアウトシフト**     | SVG アイコン読み込み・Web Font FOUT により `link` が数 px ずれ、Playwright のクリック座標が外れる（実際の座標は一致していても内部ヒットテストで miss になる）。                          |
| **ヘッダー高さゼロ問題**               | CSS の `height: 0` から `height: auto` へアニメーション‐トランジションしている最中は、`pointer-events: none` が当たっていることがある。                                 |
| **Service Worker の preload** | ログイン後 SW がキャッシュ更新をトリガーし、一瞬 UI スレッドがブロック → イベントループ遅延で actionability check 失敗。                                                     |

## 7. アドバイスと解決策の提案

以下では、質問ごとに "✅推奨 / ⚠️注意 / 💡補足" を付けて要点を整理しつつ、Playwright v1.41+ を前提にしたコード例と調査手順を示します。

### 7.1 Playwright での安定化テクニック

| テクニック                        | 回答                                                                                                               | 補足                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Locator の再生成**             | ✅ **必須**。`page.getByRole('link', { name: '管理画面' })` を**アクション直前に**呼び出して "幽霊ノード" の参照を避ける。                       | 1 行ならコストは無視できるので毎回生成で OK。                              |
| **クリック前アサーション**              | ✅ `await expect(locator).toBeVisible()` → 成功まで自動再試行され、結果的に `click()` 失敗が激減。                                      | 期待状態を明示した方がログも読みやすい。([playwright.dev](https://playwright.dev/docs/actionability))              |
| **Actionability Check への信頼** | ✅ Playwright の `click()` は「attached / visible / stable / enabled / unobscured」を自動確認。**`waitForTimeout` は最後の手段**。 | Actionability の 5 条件は公式ドキュメントに記載。([playwright.dev](https://playwright.dev/docs/actionability)) | 

### 7.2 おすすめスニペット & `state` の使い分け

```ts
// helpers/openDashboard.ts
import { Page, expect } from '@playwright/test'; // expect をインポート

export async function openDashboard(page: Page) {
  const dash = () => page.getByRole('link', { name: '管理画面' });

  await dash().waitFor({ state: 'visible' });  // ❶ appear
  await dash().waitFor({ state: 'stable' });   // ❷ 動きが止まる (v1.41+)
  await expect(dash()).toBeEnabled();          // ❸ disabled 解除

  await dash().click();                        // ❹ click
  await expect(page).toHaveURL('/dashboard');  // ❺ nav 完了
}
```

#### `waitFor({ state: ... })` 詳細指針

| `state`    | 待つもの                          | 典型用途                 |                   |
| ---------- | ----------------------------- | -------------------- | ----------------- |
| `attached` | DOM に挿入                       | SPA の再マウント直後         |                   |
| `visible`  | CSS で非表示でない                   | `display: none` → 表示 |                   |
| `enabled`  | `disabled` 属性解除               | 連打防止ボタン              |                   |
| `stable`   | **バウンディングボックスが 100 ms 変化しない** | スライド/フェードなどアニメ終了     | ([github.com](https://github.com/microsoft/playwright/issues/15195)) |

💡 同じノードに複数の `waitFor` を積むときは **軽い → 重い** 順（attached → visible → stable）の並びにするのがベター。

### 7.3 クリック代替策：フォーカス + Enter

```ts
const dashLocator = page.getByRole('link', { name: '管理画面' });
await dashLocator.focus();
await page.keyboard.press('Enter');
```

✅ HTML 規格上 `<a>` への `Enter` はクリックと同義。
⚠️ **`onBlur` が副作用トリガ**になっているフォーム等では、フォーカス移動が想定外挙動を起こす可能性があるので確認必須。

### 7.4 `force: true` の使用判断

| シナリオ                                                | 使って良いか                           |
| --------------------------------------------------- | -------------------------------- |
| チュートリアル用のツアー・コーチマークが **テスト対象外** と分かっており、それがクリックを妨げる | **◯ 一時的に可**                      |
| レイアウトバグを CI 通過まで "握りつぶす" 場合                         | **△ 応急処置**。本番コード修正後に削除必須         |
| 通常の UI 動作でクリックできない                                  | **✕ 禁止**。ユーザはクリックできないためテストの意味を失う | 

💡 参考記事も「**Do Not Force**」を推奨。([bondaracademy.com](https://www.bondaracademy.com/blog/do-not-force-playwright))

### 7.5 アプリケーション側の改善策

| 改善                                           | 効果                                                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **単一ノード再利用**                                 | `<a data-testid="dashboard-link" hidden={!loggedIn}>` のように属性だけ切替えれば DOM 再生成＝幽霊ノード問題が消える。                                     |
| **pointer-events: none** をグローバル UI オーバーレイに付与 | Toast / full-screen Loader がクリックを妨げる事故を防止。                                                                                   |
| **カスタムイベント同期**                               | Header マウント後に `window.dispatchEvent(new CustomEvent('headerReady'))` を emit → `page.waitForEvent('headerReady')` で**1 行同期**。 | 
| **`data-testid` 命名**                         | `機能-要素` (例: `dashboard-link`, `logout-button`) を **1 ファイルで enum 化**<br/>→ 実装・テストの typo を TypeScript で検出可。                    |

### 7.6 調査・デバッグを深掘りするコツ

#### 1. Trace Viewer

*   タイムライン下部の **「Screenshots」レーンで要素の出現タイミング** を確認。
*   "Before" と "After" の **BoundingBox の移動 (=レイアウトシフト)** を注視。([playwright.dev](https://playwright.dev/docs/actionability))

#### 2. PWDEBUG モード

*   Step 実行で「Pick locator」を毎回使う → **その瞬間** の推奨セレクターを控える。
*   上部 DevTools の Performance プロファイルで **メインスレッドのブロック** (Service Worker 更新など) を確認。

#### 3. コンソールログ

```ts
page.on('console', m => {
  if (m.type() === 'debug') console.log('[FRONT]', m.text());
});
```

*   フロント側で `console.debug('header-mounted', performance.now())` を仕込み、**サーバ時刻 vs ブラウザ時刻** のズレを比較。

#### 4. ビデオレコーディング

*   クリック座標に赤丸が描画されるので、**「赤丸は当たっているがリンクが動く」**ケースはレイアウトシフト確定。
*   再現しない動画は破棄されるため、`on-first-retry` がディスク節約に最適。

## 8. まとめ

1.  **Locator を毎回生成**し `visible → stable → enabled → click` の順で待つと、ほとんどのタイミング起因の flake を除去できます。
2.  アプリ側では **DOM 再生成の抑制** と **pointer-events の徹底管理** が最重要。
3.  調査は **Trace Viewer + PWDEBUG + コンソール時間ログ** の三段構えで "どの 100 ms 区間でリンクが逃げたか" を突き止めると、原因切り分けが一気に進みます。

この情報が、Playwrightテストの安定性向上の一助となれば幸いです。実装・テスト両面の改善を進めてもなお不安定な場合は、取得した trace zip や動画とともに再度共有いただければ、さらに具体的なアドバイスが可能です。 