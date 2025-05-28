export const NotionLoadingSpinner = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">{text}</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    </div>
  );
};
