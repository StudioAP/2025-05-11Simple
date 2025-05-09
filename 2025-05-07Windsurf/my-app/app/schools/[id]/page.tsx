import { createClient } from '@/utils/supabase/client';
import type { Database, Tables } from '@/types/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

const getSchoolTypeLabel = (type: string | null): string => {
  if (!type) return '情報なし';
  switch (type) {
    case 'piano': return 'ピアノ教室';
    case 'rhythmic': return 'リトミック教室';
    case 'both': return 'ピアノ＆リトミック教室';
    default: return type;
  }
};

export default async function SchoolDetailPage({ params }: Props) {
  const supabase = createClient();
  const { id } = params;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.warn('Invalid ID provided for school detail page');
    notFound();
  }

  const { data: school, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching school details for ID ${id}:`, error);
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">教室情報の取得中にエラーが発生しました。しばらくしてからもう一度お試しください。</p>
      </div>
    );
  }

  if (!school) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">{school.title}</h1>
        {school.catchphrase && <p className="text-2xl text-gray-600 italic">「{school.catchphrase}」</p>}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <section className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">教室紹介</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="whitespace-pre-wrap">{school.description || '詳細な説明はありません。'}</p>
          </div>
        </section>

        <aside className="bg-blue-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">基本情報</h2>
          <ul className="space-y-3 text-gray-700">
            <li><strong>タイプ:</strong> {getSchoolTypeLabel(school.school_type)}</li>
            <li><strong>地域:</strong> {school.prefecture}{school.city}{school.address && `, ${school.address}`}</li>
            {school.fee_structure && typeof school.fee_structure === 'object' && school.fee_structure !== null && 'monthly' in school.fee_structure && typeof school.fee_structure.monthly === 'number' && (
              <li><strong>月額料金:</strong> <span className="font-semibold text-lg text-blue-600">{school.fee_structure.monthly.toLocaleString()}円</span></li>
            )}
          </ul>
        </aside>
      </div>

      {school.images && Array.isArray(school.images) && school.images.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">フォトギャラリー</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {school.images.map((url, index) => (
              <div key={index} className="aspect-w-1 aspect-h-1">
                <img
                  src={url} // SupabaseのストレージURLまたは外部URL
                  alt={`${school.title} イメージ ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg shadow-md"
                  onError={(e) => {
                    // 画像読み込みエラー時のフォールバックやロギング
                    console.error(`Error loading image: ${url}`, e);
                    // (e.target as HTMLImageElement).src = '/images/placeholder.png'; // 代替画像など
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {school.keywords && Array.isArray(school.keywords) && school.keywords.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">特徴・キーワード</h3>
          <div className="flex flex-wrap gap-3">
            {school.keywords.map((keyword: string, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                #{keyword}
              </span>
            ))}
          </div>
        </section>
      )}
      
      <div className="mt-10 text-center">
        {/* Linkコンポーネントを使用するか、単純なaタグで戻る */}
        <Link href="/search" className="text-blue-600 hover:text-blue-800 hover:underline">
          &larr; 検索結果に戻る
        </Link>
      </div>
    </div>
  );
}