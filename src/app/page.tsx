// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-blue-400-50">
      <h1 className="text-5xl font-bold text-amber-50-600 mb-8">
        Welcome to your Freelance Marketplace!
      </h1>
      <p className="text-lg text-gray-700">
        Let's build something awesome.
      </p>
    </main>
  );
}