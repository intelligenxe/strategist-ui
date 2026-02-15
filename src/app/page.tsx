import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Strategist
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Upload documents, craft prompts, and get AI-powered strategic analysis.
        Our tool helps you make informed decisions backed by intelligent
        insights.
      </p>
      <Link
        href="/strategist"
        className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Get Started
      </Link>
    </div>
  );
}
