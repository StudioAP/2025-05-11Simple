import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Supabaseクライアントの型を明示的に定義（publicスキーマを指定）
export type TypedSupabaseClient = SupabaseClient<Database, "public">;

export const createClient = async (): Promise<TypedSupabaseClient> => {
  const cookieStore = await cookies();

  return createServerClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // name と options からオブジェクトを構築して delete メソッドに渡す
            cookieStore.delete({ 
              name,
              path: options.path,
              domain: options.domain,
              // secure: options.secure, // 必要に応じて追加
              // sameSite: options.sameSite, // 必要に応じて追加
            });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
