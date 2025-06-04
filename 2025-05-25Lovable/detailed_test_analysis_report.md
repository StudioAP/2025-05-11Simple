# Playwrightテスト詳細分析レポート

## 📊 **テスト実行結果サマリー**

### **実行環境**
- **フレームワーク**: Playwright (TypeScript)
- **ブラウザ**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **アプリケーション**: React + Supabase認証 + React Router
- **テスト日時**: 2025年6月3日

### **全体結果**
- **総テスト数**: 90件（5ブラウザ × 18テストケース）
- **失敗率**: 100%（主要テストすべてが失敗）
- **主要な失敗カテゴリ**:
  1. 認証フロー（新規登録・ログイン）
  2. 教室登録フォーム
  3. メール送信機能

---

## 🔍 **発見された主要問題**

### **1. 認証システムの根本的な問題**

#### **1-A. 新規ユーザー登録フローの失敗**
```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
Locator: locator('[data-testid="signup-success"]')
Expected: visible
Received: <element(s) not found>
```

**原因分析:**
- テストは `signup-success` 要素を期待しているが、実際のコードには存在しない
- Supabaseのメール確認フローが無効化されても、認証後の状態管理に問題がある

#### **1-B. Dashboard認証チェックのタイミング問題**

**問題のコード（Dashboard.tsx:32-36行目）:**
```typescript
useEffect(() => {
  if (!loading && !user) {
    navigate("/auth");
  }
}, [user, loading, navigate]);
```

**問題点:**
1. **レースコンディション**: `loading = false` になった瞬間に `user = null` でリダイレクトが発動
2. **認証状態の誤判定**: Supabaseの認証処理完了前にリダイレクトされる
3. **ループ現象**: ログイン成功 → ダッシュボード遷移 → 即座に認証ページにリダイレクト

### **2. 教室登録フォームのセレクター問題**

#### **2-A. フィールドセレクターの不一致**

**失敗したテストコード:**
```typescript
await page.fill('input[placeholder*="番地"], input[placeholder*="1-2-3"]', '1-2-3');
```

**実際のフォーム構造:**
```typescript
// ClassroomRegistration.tsx:738行目
<Input placeholder="例：神南1-1-1 ABCビル2F" {...field} data-testid="classroom-address" />
```

**問題点:**
- テストは `placeholder*="番地"` や `placeholder*="1-2-3"` を探している
- 実際のプレースホルダーは `"例：神南1-1-1 ABCビル2F"`
- `data-testid` 属性が存在するのに使用されていない

#### **2-B. その他のフィールドセレクター問題**

| テストセレクター | 実際のプレースホルダー | data-testid |
|---|---|---|
| `input[placeholder*="渋谷区"]` | `"例：渋谷区"` | `classroom-city` |
| `input[placeholder*="電話"]` | `"例：03-1234-5678"` | `classroom-phone` |
| `input[placeholder*="info"]` | `"info@example.com"` | `classroom-email` |

### **3. 認証ガード（ProtectedRoute）の実装問題**

#### **3-A. App.tsxのルート保護**

**修正前の問題:**
```typescript
// 保護されていないルート
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/classroom/register" element={<ClassroomRegistration />} />
```

**修正後:**
```typescript
// ProtectedRouteで保護
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 🛠️ **実施した修正とその効果**

### **修正1: Dashboard認証チェックの改善**

**修正前:**
```typescript
useEffect(() => {
  if (!loading && !user) {
    navigate("/auth");
  }
}, [user, loading, navigate]);
```

**修正後:**
```typescript
useEffect(() => {
  if (loading) {
    return; // ローディング中は何もしない
  }
  
  if (!user) {
    // ローディング完了後にユーザーが null の場合のみリダイレクト
    navigate("/auth");
  }
}, [user, loading, navigate]);
```

### **修正2: ProtectedRouteコンポーネントの追加**

```typescript
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // ローディング中
  if (loading) {
    return <LoadingSpinner />;
  }

  // 認証されていない場合はリダイレクト
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
```

### **修正3: テストセレクターの改善**

**修正前:**
```typescript
await page.fill('input[placeholder*="番地"], input[placeholder*="1-2-3"]', '1-2-3');
```

**修正後:**
```typescript
await page.fill('[data-testid="classroom-address"]', '神南1-1-1 ABCビル2F');
```

---

## ⚠️ **未解決の問題**

### **1. 認証成功メッセージの欠如**
- テストが期待する `[data-testid="signup-success"]` 要素が存在しない
- Supabaseの認証レスポンスハンドリングの確認が必要

### **2. 教室登録フォームの複雑な構造**
- 多段階フォーム（基本情報→所在地→連絡先→レッスン情報）
- 各セクションの適切な待機処理が必要

### **3. メール送信機能のテスト**
- Resend APIの設定確認が必要
- Edge Functionの動作検証が必要

---

## 📋 **推奨される次のアクション**

### **優先度 HIGH**

1. **認証フローの完全な見直し**
   ```typescript
   // Auth.tsx での成功メッセージ実装確認
   // useAuth.tsx でのセッション管理ロジック確認
   ```

2. **data-testid属性の統一**
   ```typescript
   // 全フォーム要素に適切なdata-testid付与
   // テストセレクターをdata-testidベースに変更
   ```

### **優先度 MEDIUM**

3. **Supabase設定の確認**
   - RLS (Row Level Security) ポリシーの確認
   - 認証設定（autoRefreshToken, persistSession）の確認

4. **Edge Function の動作確認**
   ```bash
   supabase functions serve
   # メール送信APIの手動テスト
   ```

### **優先度 LOW**

5. **テストの安定性向上**
   - グローバルセットアップでの認証状態保存
   - より柔軟な待機処理の実装

---

## 🔧 **具体的なコード修正提案**

### **1. Auth.tsx の成功メッセージ追加**

```typescript
// 新規登録成功時
{signupSuccess && (
  <div data-testid="signup-success" className="text-green-600">
    アカウントが作成されました！
  </div>
)}
```

### **2. useAuth.tsx のデバッグログ追加**

```typescript
useEffect(() => {
  console.log('Auth state changed:', { user: !!user, loading });
}, [user, loading]);
```

### **3. テストセレクターの統一**

```typescript
// 修正前
await page.fill('input[placeholder*="教室名"]', 'テスト教室');

// 修正後  
await page.fill('[data-testid="classroom-name"]', 'テスト教室');
```

---

## 📈 **期待される改善効果**

### **短期効果（修正後1週間以内）**
- ✅ 認証フローの安定化
- ✅ 教室登録テストの成功率向上
- ✅ テスト実行時間の短縮

### **中期効果（修正後1ヶ月以内）**
- 🔄 CI/CDパイプラインでの自動テスト導入
- 📊 継続的な品質監視
- 🚀 本格リリースに向けた信頼性確保

---

## ❓ **追加調査が必要な項目**

1. **Supabaseログの確認**
   - 認証APIレスポンスの詳細
   - RLSポリシーによる権限エラーの有無

2. **ブラウザコンソールエラー**
   - JavaScript実行時エラー
   - ネットワークエラー

3. **実際のユーザー操作との比較**
   - 手動テストでの動作確認
   - 実際のユーザージャーニーとの差異

---

**📞 相談事項:**
上記分析を踏まえ、特に認証フローの根本的な見直しと、テストセレクターの統一について、実装方針のアドバイスをお願いします。また、Supabaseの設定面で見落としている可能性のある設定項目があれば、ご指摘ください。 