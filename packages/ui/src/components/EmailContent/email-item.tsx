import { CategoriesState, SampleEmail } from "./types";

export const EmailItem: React.FC<{
  email: SampleEmail;
  categories: CategoriesState;
  onClick: (sender: string) => void;
}> = ({ email, categories, onClick }) => (
  <div
    className="p-3 hover:bg-white/5 cursor-pointer transition-colors"
    onClick={() => onClick(email.sender)}
  >
    <div className="flex justify-between items-start">
      <div className="font-medium text-white">{email.sender}</div>
      <div className="text-xs text-zinc-500">{email.time}</div>
    </div>
    <div className="flex items-center gap-2 mt-1">
      <div className="text-sm text-zinc-400">{email.subject}</div>
      {email.category === "to_respond" && categories.categories.to_respond && (
        <span className="bg-[#F87171] text-black text-xs px-2 py-0.5 rounded">
          To respond
        </span>
      )}
      {email.category === "fyi" && categories.categories.fyi && (
        <span className="bg-[#F59E0B] text-black text-xs px-2 py-0.5 rounded">
          FYI
        </span>
      )}
      {email.category === "comment" && categories.categories.comment && (
        <span className="bg-[#F59E0B] text-black text-xs px-2 py-0.5 rounded">
          Comment
        </span>
      )}
      {email.category === "notification" &&
        categories.categories.notification && (
          <span className="bg-[#34D399] text-black text-xs px-2 py-0.5 rounded">
            Notification
          </span>
        )}
      {email.category === "meeting_update" &&
        categories.categories.meeting_update && (
          <span className="bg-[#60A5FA] text-black text-xs px-2 py-0.5 rounded">
            Meeting update
          </span>
        )}
      {email.category === "awaiting_reply" &&
        categories.categories.awaiting_reply && (
          <span className="bg-[#8B5CF6] text-white text-xs px-2 py-0.5 rounded">
            Awaiting reply
          </span>
        )}
      {email.category === "actioned" && categories.categories.actioned && (
        <span className="bg-[#8B5CF6] text-white text-xs px-2 py-0.5 rounded">
          Actioned
        </span>
      )}
    </div>
  </div>
);
