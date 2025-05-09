'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { Database, Tables } from '@/types/supabase';

function SearchResultsLogic() {
  const supabase = createClient();
  const searchParamsHook = useSearchParams();
  const keyword = searchParamsHook.get('q') || '';
  const pref = searchParamsHook.get('pref') || '';
  const type = searchParamsHook.get('type') || '';

  const [schools, setSchools] = useState<Tables<'schools'>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      setError(null);
      let queryBuilder = supabase.from('schools').select('*');

      if (keyword.trim()) {
        const searchTerm = `%${keyword.trim()}%`;
        queryBuilder = queryBuilder.or(
          `title.ilike.${searchTerm},catchphrase.ilike.${searchTerm},description.ilike.${searchTerm}`
        );
      }
      if (pref && pref !== 'すべて') {
        queryBuilder = queryBuilder.eq('prefecture', pref);
      }
      if (type && type !== 'すべて') {
        if (type === 'piano') {
          queryBuilder = queryBuilder.or('school_type.eq.piano,school_type.eq.both');
        } else if (type === 'rhythmic') {
          queryBuilder = queryBuilder.or('school_type.eq.rhythmic,school_type.eq.both');
        } else {
          // 他のタイプが将来追加される可能性を考慮（現在は'すべて'のみ）
          // queryBuilder = queryBuilder.eq('school_type', type); // この行は現状不要
        }
      }

      const { data, error: fetchError } = await queryBuilder;

      if (fetchError) {
        console.error('Client-side error fetching schools:', fetchError);
        setError('データの取得に失敗しました。');
        setSchools(null);
      } else {
        setSchools(data);
      }
      setLoading(false);
    };

    fetchSchools();
  }, [keyword, pref, type, supabase]);

  if (loading) {
    return <p className="text-center mt-8">検索中...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <>
      {(!schools || schools.length === 0) ? (
        <p className="text-center mt-8">該当する教室は見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {schools.map((school) => (
            <Link key={school.id} href={`/schools/${school.id}`} className="block hover:no-underline">
              <div className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-blue-700 group-hover:text-blue-800">{school.title}</h2>
                {school.catchphrase && <p className="text-gray-700 mb-1 italic text-sm">キャッチコピー: {school.catchphrase}</p>}
                {(school.prefecture || school.city) && (
                  <p className="text-gray-600 mb-1 text-sm">
                    地域: {school.prefecture} {school.city}
                  </p>
                )}
                {school.school_type && <p className="text-gray-600 mb-1 text-sm">タイプ: {school.school_type === 'piano' ? 'ピアノ教室' : school.school_type === 'rhythmic' ? 'リトミック教室' : school.school_type === 'both' ? 'ピアノ＆リトミック教室' : school.school_type}</p>}
                {school.fee_structure && typeof school.fee_structure === 'object' && school.fee_structure !== null && 'monthly' in school.fee_structure && typeof school.fee_structure.monthly === 'number' && (
                  <p className="text-gray-600 mb-1 text-sm">月額: <span className="font-semibold">{school.fee_structure.monthly.toLocaleString()}円</span></p>
                )}
                {school.keywords && Array.isArray(school.keywords) && school.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-200">
                    {school.keywords.slice(0, 3).map((kw: string, idx: number) => ( // 表示するキーワード数を制限
                      <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mr-1">#{kw}</span>
                    ))}
                    {school.keywords.length > 3 && <span className="text-xs text-gray-500">...他</span>}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

const PREFECTURES = [
  'すべて', '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

const SCHOOL_TYPES: { value: string; label: string }[] = [
  { value: 'すべて', label: 'すべてのタイプ' },
  { value: 'piano', label: 'ピアノ教室' },
  { value: 'rhythmic', label: 'リトミック教室' },
];

function SearchFormAndResults() {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const initialKeyword = searchParamsHook.get('q') || '';
  const initialPref = searchParamsHook.get('pref') || 'すべて';
  const initialType = searchParamsHook.get('type') || 'すべて';

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('q') as string;
    const pref = formData.get('pref') as string;
    const type = formData.get('type') as string;
    let url = `/search?q=${encodeURIComponent(query)}`;
    if (pref && pref !== 'すべて') {
      url += `&pref=${encodeURIComponent(pref)}`;
    }
    if (type && type !== 'すべて') {
      url += `&type=${encodeURIComponent(type)}`;
    }
    router.push(url);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
        <input
          type="text"
          name="q"
          defaultValue={initialKeyword}
          placeholder="キーワードで検索"
          className="border p-2 rounded-l-md focus:ring-blue-500 focus:border-blue-500 flex-grow md:flex-grow-0 md:w-48"
        />
        <select
          name="pref"
          defaultValue={initialPref}
          className="border p-2 md:rounded-none md:border-l-0 md:border-r-0"
        >
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>{pref}</option>
          ))}
        </select>
        <select
          name="type"
          defaultValue={initialType}
          className="border p-2 md:rounded-none md:border-l-0 md:border-r-0"
        >
          {SCHOOL_TYPES.map((typeOpt) => (
            <option key={typeOpt.value} value={typeOpt.value}>{typeOpt.label}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md md:rounded-l-none">
          検索
        </button>
      </form>
      <SearchResultsLogic />
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">教室検索</h1>
      <Suspense fallback={<div className="text-center mt-8">読み込み中...</div>}>
        <SearchFormAndResults />
      </Suspense>
    </div>
  );
}
