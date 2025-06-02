import { ArrowRight, FileText } from "lucide-react";
import { useOnboardingStore } from "@amurex/ui/store";

export const OnboardKnowledgeSources = () => {
  const {
    selectedTools,
    selectedFiles,
    isUploading,
    uploadProgress,
    notionConnected,
    isNotionConnecting,
    toggleTool,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useOnboardingStore();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-[#1E1E1E] flex items-center justify-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#2D1B40] flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#9334E9]" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-center">
        Connect your knowledge sources
      </h1>
      <p className="text-gray-400 text-center mb-12">
        Connect your existing knowledge sources to get more personalized
        responses
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
        <ToolCard
          name="Notion"
          iconUrl="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
          connected={notionConnected}
          selected={selectedTools.includes("notion")}
          onClick={() => toggleTool("notion")}
          connecting={isNotionConnecting}
        />

        <ToolCard
          name="Obsidian"
          iconUrl="https://obsidian.md/images/obsidian-logo-gradient.svg"
          selected={selectedTools.includes("obsidian")}
          onClick={() => toggleTool("obsidian")}
        />

        <ToolCard
          name="Google"
          iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
          connected
        />
      </div>

      {selectedTools.includes("obsidian") && (
        <div className="w-full mb-8">
          <div
            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-[#9334E9] transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".md"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center justify-center">
              <UploadIcon />
              <p className="mt-2 text-gray-400">
                Drag and drop your Markdown files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Only .md files are supported
              </p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">
                Selected files ({selectedFiles.length})
              </h4>
              <ul className="max-h-40 overflow-y-auto bg-[#111111] rounded-lg p-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="text-gray-300 text-sm py-1 px-2 flex justify-between items-center"
                  >
                    <span>{file.name}</span>
                    <span className="text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </li>
                ))}
              </ul>
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-[#9334E9] h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Uploading... {uploadProgress.toFixed(0)}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center w-full mt-8 gap-4">
        <button
          onClick={() => {
            localStorage.setItem("onboardingCompleted", "true");
            window.location.href = "/search";
          }}
          className="px-6 py-2 rounded-lg text-white border border-[#9334E9] bg-[#9334E9] hover:bg-[#3c1671] hover:border-[#6D28D9] transition-colors flex items-center gap-2"
        >
          Complete onboarding
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

function ToolCard({
  name,
  iconUrl,
  connected,
  selected,
  onClick,
  connecting,
}: any) {
  return (
    <div
      className={`p-4 rounded-lg border flex flex-col justify-between h-full cursor-pointer ${
        connected || selected
          ? "border-green-500/30"
          : "border-gray-700 bg-black"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#2D1B40] flex items-center justify-center">
          <img src={iconUrl} alt={name} className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white">{name}</h3>
          <p className="text-sm text-gray-400">
            {connected
              ? `Connected to your ${name} workspace`
              : name === "Obsidian"
                ? "Upload your Markdown files"
                : `Connect your ${name} workspace`}
          </p>
        </div>
      </div>
      <button
        disabled={connecting}
        className={`px-3 py-1.5 mt-4 rounded-md transition-colors text-sm ${
          connected
            ? "bg-green-600 text-white hover:bg-green-700"
            : "text-white border border-[#9334E9] bg-[#9334E9] hover:bg-[#3c1671] hover:border-[#6D28D9]"
        }`}
      >
        {connecting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : connected ? (
          "Connected"
        ) : selected ? (
          "Selected"
        ) : (
          "Connect"
        )}
      </button>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 16.2091 19.2091 18 17 18H7C4.79086 18 3 16.2091 3 14C3 11.7909 4.79086 10 7 10Z"
        stroke="#9334E9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V16"
        stroke="#9334E9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14L12 12L10 14"
        stroke="#9334E9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
