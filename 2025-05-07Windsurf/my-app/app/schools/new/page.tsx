'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { createSchool } from '../actions';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface FormState {
  message?: string | null;
  error?: string | null;
}

const initialState: FormState = {
  message: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      disabled={pending}
    >
      {pending ? '登録中...' : '登録する'}
    </button>
  );
}

export default function NewSchoolPage() {
  const [state, formAction] = useFormState(createSchool, initialState);
  const searchParams = useSearchParams();
  
  const [initialMessageFromQuery, setInitialMessageFromQuery] = useState<string | null>(null);

  useEffect(() => {
    const queryMessage = searchParams.get('message');
    const queryError = searchParams.get('error');
    if (queryMessage) {
      setInitialMessageFromQuery(queryMessage);
    }
    if (queryError) {
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">新しい教室情報を登録</h1>
      
      {state?.message && (
        <div className='p-4 mb-4 text-sm bg-green-100 text-green-700 rounded-lg'>
          {state.message}
        </div>
      )}
      {state?.error && (
        <div className='p-4 mb-4 text-sm bg-red-100 text-red-700 rounded-lg'>
          {state.error}
        </div>
      )}
      {initialMessageFromQuery && !state?.message && !state?.error && (
         <div className='p-4 mb-4 text-sm bg-green-100 text-green-700 rounded-lg'>
           {initialMessageFromQuery}
         </div>
      )}

      <form action={formAction} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="schoolName" className="block text-gray-700 text-sm font-bold mb-2">
            教室名
          </label>
          <input 
            type="text" 
            id="schoolName" 
            name="schoolName" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: ABC音楽教室"
            required 
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            教室紹介文
          </label>
          <textarea 
            id="description" 
            name="description" 
            rows={4} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="教室の特徴やレッスン内容などを入力してください"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
            住所
          </label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: 東京都渋谷区○○1-2-3 ビル4F"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
            電話番号
          </label>
          <input 
            type="tel" 
            id="phoneNumber" 
            name="phoneNumber" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: 03-1234-5678"
          />
        </div>

        <div className="mb-6"> 
          <label htmlFor="websiteUrl" className="block text-gray-700 text-sm font-bold mb-2">
            ウェブサイトURL
          </label>
          <input 
            type="url" 
            id="websiteUrl" 
            name="websiteUrl" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: https://www.example-school.com"
          />
        </div>

        <div className="mb-6"> 
          <label htmlFor="features" className="block text-gray-700 text-sm font-bold mb-2">
            特徴 (カンマ区切りで複数入力可)
          </label>
          <textarea 
            id="features" 
            name="features" 
            rows={3} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: 初心者歓迎, オンラインレッスン可, 無料体験あり"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="monthlyFeeMin" className="block text-gray-700 text-sm font-bold mb-2">
              月謝 (下限)
            </label>
            <input 
              type="number" 
              id="monthlyFeeMin" 
              name="monthlyFeeMin" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例: 5000"
            />
          </div>
          <div>
            <label htmlFor="monthlyFeeMax" className="block text-gray-700 text-sm font-bold mb-2">
              月謝 (上限)
            </label>
            <input 
              type="number" 
              id="monthlyFeeMax" 
              name="monthlyFeeMax" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例: 15000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              カテゴリ
            </label>
            <input 
              type="text" 
              id="category" 
              name="category" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例: piano, rhythm (いずれか一つ)"
            />
          </div>
          <div>
            <label htmlFor="subCategory" className="block text-gray-700 text-sm font-bold mb-2">
              サブカテゴリ
            </label>
            <input 
              type="text" 
              id="subCategory" 
              name="subCategory" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例: classical, jazz, pops (複数可、カンマ区切り)"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <SubmitButton />
          <Link href="/account" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            キャンセル (マイページへ)
          </Link>
        </div>
      </form>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
