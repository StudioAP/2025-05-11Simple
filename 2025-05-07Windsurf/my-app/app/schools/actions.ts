'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Database } from '@/types/supabase'; 

interface FormState {
  message?: string | null;
  error?: string | null;
}

type SchoolInsert = Database['public']['Tables']['schools']['Insert'];

export async function createSchool(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'ログインしてください。認証が必要です。' };
  }

  const schoolName = formData.get('schoolName') as string;
  const categoryValue = formData.get('category') as string;

  const rawFormData: SchoolInsert = {
    title: schoolName, 
    description: formData.get('description') as string || undefined,
    address: formData.get('address') as string || undefined,
    school_type: categoryValue ? categoryValue as Database['public']['Enums']['school_type_enum'] : undefined, 
    keywords: (formData.get('features') as string)?.split(',').map(feature => feature.trim()).filter(feature => feature) || [], 
    user_id: user.id,
    is_active: false, 
    // city, prefecture など、フォームにないがスキーマに存在するフィールドは、別途取得するか、任意入力にするか検討
  };

  if (!rawFormData.title) {
    return { error: '教室名は必須です。' };
  }
  if (rawFormData.school_type && !['piano', 'rhythm', 'both'].includes(rawFormData.school_type)) {
    return { error: 'カテゴリの値が不正です (piano, rhythm, both のいずれか)。' };
  }

  try {
    const { data, error } = await supabase
      .from('schools')
      .insert(rawFormData)
      .select()
      .single(); 

    if (error) {
      console.error('Error inserting school:', error);
      return { error: `教室情報の登録に失敗しました: ${error.message}` };
    }

    if (data) {
      revalidatePath('/account');
      revalidatePath('/schools/new'); 
      revalidatePath(`/schools/${data.id}`);
      redirect(`/account?message=教室情報を登録しました！`);
    } else {
        return { error: '教室情報の登録に失敗しましたが、明確なエラーメッセージはありませんでした。' };
    }

  } catch (e: any) {
    if (e.message === 'NEXT_REDIRECT') {
      throw e; 
    }
    console.error('Unexpected error inserting school:', e);
    return { error: '予期せぬエラーが発生しました。' };
  }
}
