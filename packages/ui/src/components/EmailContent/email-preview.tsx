import { EmailItem } from "./email-item";
import { EmailPreviewProps } from "./types";

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  emails,
  categories,
  onEmailClick,
}) => (
  <div className="w-[40%] flex flex-col">
    <div className="h-[88px]"></div>
    <div className="bg-black/80 rounded-xl border border-white/10 overflow-hidden h-fit shadow-2xl">
      <div className="bg-zinc-800/50 p-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center">
          <h3 className="text-white font-medium">Inbox Preview</h3>
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {emails.map((email) => (
          <EmailItem
            key={email.id}
            email={email}
            categories={categories}
            onClick={onEmailClick}
          />
        ))}
      </div>
    </div>
  </div>
);
