'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">&#x26A0;&#xFE0F;</div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
