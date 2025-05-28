// Loading UI component
export const GoogleCallbackLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-4">Google Integration</h1>
        <div className="mb-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-gray-700 mb-2">Connecting to Google...</p>
        <p className="text-sm text-gray-500">
          You&apos;ll be redirected in a moment.
        </p>
      </div>
    </div>
  );
};
