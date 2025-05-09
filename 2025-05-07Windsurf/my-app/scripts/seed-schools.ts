import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceRoleKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  process.exit(1);
}
// Use Service Role key to bypass RLS for seeding data
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const schools = [
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '東京ピアノアカデミー',
    catchphrase: '初心者歓迎！',
    description: '東京都心で本格的なピアノレッスンを提供します。',
    school_type: 'piano',
    prefecture: '東京都',
    city: '千代田区',
    address: '東京都千代田区1-1-1',
    fee_structure: { monthly: 8000 },
    keywords: ['ピアノ', '初心者', '個人レッスン'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/800x600.png?text=Tokyo+Piano+1',
      'https://placehold.co/400x300.png?text=Tokyo+Piano+2',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '大阪リトミック教室',
    catchphrase: '親子で楽しく！',
    description: 'リトミックで音楽とふれあいましょう。',
    school_type: 'rhythmic',
    prefecture: '大阪府',
    city: '大阪市',
    address: '大阪府大阪市2-2-2',
    fee_structure: { monthly: 7000 },
    keywords: ['リトミック', '親子', '体験'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/700x500.png?text=Osaka+Rhythmic+1',
      'https://placehold.co/300x200.png?text=Osaka+Rhythmic+2',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '京都音楽スクール',
    catchphrase: '楽しく続く！',
    description: '京都で人気の音楽教室。ピアノもリトミックもOK。',
    school_type: 'both',
    prefecture: '京都府',
    city: '京都市',
    address: '京都府京都市3-3-3',
    fee_structure: { monthly: 9000 },
    keywords: ['ピアノ', 'リトミック', '子供'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/800x500.png?text=Kyoto+Music+1',
      'https://placehold.co/400x250.png?text=Kyoto+Music+2',
      'https://placehold.co/600x400.png?text=Kyoto+Music+3',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '福岡ピアノスタジオ',
    catchphrase: '大人も大歓迎',
    description: '大人のためのピアノ教室。初心者から上級者まで。',
    school_type: 'piano',
    prefecture: '福岡県',
    city: '福岡市',
    address: '福岡県福岡市4-4-4',
    fee_structure: { monthly: 8500 },
    keywords: ['ピアノ', '大人', '趣味'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/900x600.png?text=Fukuoka+Piano+1',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '札幌リトミックランド',
    catchphrase: '音楽で育む心',
    description: '札幌で人気のリトミック教室。',
    school_type: 'rhythmic',
    prefecture: '北海道',
    city: '札幌市',
    address: '北海道札幌市5-5-5',
    fee_structure: { monthly: 7500 },
    keywords: ['リトミック', '幼児', '音楽教育'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/600x450.png?text=Sapporo+Rhythmic+1',
      'https://placehold.co/300x225.png?text=Sapporo+Rhythmic+2',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '名古屋ピアノ教室',
    catchphrase: '基礎からしっかり',
    description: '名古屋で基礎から学べるピアノ教室。',
    school_type: 'piano',
    prefecture: '愛知県',
    city: '名古屋市',
    address: '愛知県名古屋市6-6-6',
    fee_structure: { monthly: 8200 },
    keywords: ['ピアノ', '基礎', '子供'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/750x500.png?text=Nagoya+Piano+1',
      'https://placehold.co/375x250.png?text=Nagoya+Piano+2',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '横浜ミュージックガーデン',
    catchphrase: '音楽の楽しさ発見',
    description: '横浜で人気の総合音楽教室。',
    school_type: 'both',
    prefecture: '神奈川県',
    city: '横浜市',
    address: '神奈川県横浜市7-7-7',
    fee_structure: { monthly: 9500 },
    keywords: ['ピアノ', 'リトミック', '大人', '子供'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/800x550.png?text=Yokohama+Music+1',
      'https://placehold.co/400x275.png?text=Yokohama+Music+2',
      'https://placehold.co/600x350.png?text=Yokohama+Music+3',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '神戸ピアノサロン',
    catchphrase: 'プロ講師在籍',
    description: '神戸でプロの指導が受けられるピアノ教室。',
    school_type: 'piano',
    prefecture: '兵庫県',
    city: '神戸市',
    address: '兵庫県神戸市8-8-8',
    fee_structure: { monthly: 8800 },
    keywords: ['ピアノ', 'プロ', '個人'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/850x600.png?text=Kobe+Piano+1',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '広島リトミック教室',
    catchphrase: '体験レッスン受付中',
    description: '広島で体験できるリトミック教室。',
    school_type: 'rhythmic',
    prefecture: '広島県',
    city: '広島市',
    address: '広島県広島市9-9-9',
    fee_structure: { monthly: 7800 },
    keywords: ['リトミック', '体験', '幼児'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/700x450.png?text=Hiroshima+Rhythmic+1',
      'https://placehold.co/350x225.png?text=Hiroshima+Rhythmic+2',
    ],
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    title: '仙台ピアノ＆リトミック',
    catchphrase: '選べるレッスン',
    description: 'ピアノもリトミックも選べる教室。',
    school_type: 'both',
    prefecture: '宮城県',
    city: '仙台市',
    address: '宮城県仙台市10-10-10',
    fee_structure: { monthly: 8600 },
    keywords: ['ピアノ', 'リトミック', '選択制'],
    is_active: true,
    subscription_status: 'active',
    image_urls: [
      'https://placehold.co/780x520.png?text=Sendai+Music+1',
      'https://placehold.co/390x260.png?text=Sendai+Music+2',
    ],
  },
];

async function main() {
  // Delete all existing schools before inserting new ones
  console.log('Deleting existing school data...');
  const { error: deleteError } = await supabase
    .from('schools')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Match all rows for deletion

  if (deleteError) {
    console.error('Error deleting existing schools:', deleteError.message);
    return; // Stop seeding if deletion fails
  }
  console.log('Successfully deleted existing schools data.');

  for (const school of schools) {
    const { error } = await supabase.from('schools').insert([school]);
    if (error) {
      console.error(`Error inserting ${school.title}:`, error);
    } else {
      console.log(`Inserted: ${school.title}`);
    }
  }
  console.log('ダミーデータ投入完了！');
}

main();
