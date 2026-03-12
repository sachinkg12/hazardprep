export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">&#x1F50D;</div>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors inline-block"
        >
          Assess Your Risk
        </a>
      </div>
    </div>
  );
}
