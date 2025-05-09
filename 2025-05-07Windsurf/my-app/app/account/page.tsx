import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/sign-in'); // /sign-in にログインページがあると仮定
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    // エラーページにリダイレクトするか、エラーメッセージを表示するかなど検討
    return <p>プロ情報の読み込みに失敗しました。</p>;
  }

  if (!profile) {
    return <p>プロファイルが見つかりません。</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">アカウント情報</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">基本情報</h2>
        <p className="mb-2"><span className="font-semibold">メールアドレス:</span> {user.email}</p>
      </div>

      {profile && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">利用状況</h2>
          <p className="mb-2">
            <span className="font-semibold">現在のステータス:</span> 
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${profile.subscription_status === 'trialing' ? 'bg-blue-100 text-blue-700' : profile.subscription_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {profile.subscription_status === 'trialing' && 'お試し期間中'}
              {profile.subscription_status === 'active' && '有効'}
              {profile.subscription_status === 'inactive' && '無効'}
              {profile.subscription_status === 'canceled' && 'キャンセル済み'}
              {!(profile.subscription_status === 'trialing' || profile.subscription_status === 'active' || profile.subscription_status === 'inactive' || profile.subscription_status === 'canceled') && profile.subscription_status}
            </span>
          </p>
          {profile.trial_ends_at && profile.subscription_status === 'trialing' && (
            <p className="mb-2">
              <span className="font-semibold">お試し期間終了日:</span> 
              {new Date(profile.trial_ends_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          {/* Stripe連携後に支払い情報やプラン変更ボタンなどを追加 */} 
          <div className="mt-6">
            <Link href="/schools/new" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              教室情報を登録・編集する
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
