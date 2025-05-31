import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Switch } from "@amurex/ui/components";

interface HeaderProps {
  memoryEnabled: boolean;
  date: string;
  time: string;
}

export const MeetHeader = ({ memoryEnabled, date, time }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link
        href="/meetings"
        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 lg:text-base text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Meetings
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 text-zinc-400 text-sm">
          <div className="hidden items-center gap-2 border-r border-zinc-800 pr-4 hidden">
            <span className="text-zinc-400">Memory</span>
            <Switch
              checked={memoryEnabled}
              disabled={true}
              className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-zinc-700"
              aria-label="Toggle memory"
            />
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};
