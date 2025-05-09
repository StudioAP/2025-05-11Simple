import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center py-12 md:py-24">
      <h1 className="text-4xl lg:text-5xl font-bold !leading-tight mx-auto max-w-2xl text-center text-blue-700">
        おけいこサーチ
      </h1>
      <p className="text-xl lg:text-2xl !leading-relaxed mx-auto max-w-xl text-center text-gray-600">
        あなたにぴったりのピアノ・リトミック教室がきっと見つかる！
      </p>
      <Link
        href="/search"
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-150 ease-in-out"
      >
        教室をさがす
      </Link>
    </div>
  );
}
