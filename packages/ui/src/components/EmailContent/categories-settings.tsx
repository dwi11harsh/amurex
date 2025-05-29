import { CategoriesSettingsProps } from "./types";
import { CategoryItem } from "./category-item";
import { motion } from "framer-motion";

export const CategoriesSettings: React.FC<CategoriesSettingsProps> = ({
  categories,
  onToggle,
}) => (
  <motion.div
    className="overflow-hidden text-card-foreground shadow bg-black border-zinc-800 rounded-2xl"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
  >
    <div className="divide-y divide-white/10">
      <CategoryItem
        category="to_respond"
        checked={categories.categories.to_respond}
        onToggle={onToggle}
        categoryName="To respond"
        description="Awaiting your response"
        color="#F87171"
      />
      <CategoryItem
        category="fyi"
        checked={categories.categories.fyi}
        onToggle={onToggle}
        categoryName="FYI"
        description="Information you might need to know"
        color="#F59E0B"
      />
      <CategoryItem
        category="comment"
        checked={categories.categories.comment}
        onToggle={onToggle}
        categoryName="Comment"
        description="Team comments (Google Docs, Microsoft Office, etc.)"
        color="#F59E0B"
      />
      <CategoryItem
        category="notification"
        checked={categories.categories.notification}
        onToggle={onToggle}
        categoryName="Notification"
        description="Automated updates from tools you use"
        color="#34D399"
      />
      <CategoryItem
        category="meeting_update"
        checked={categories.categories.meeting_update}
        onToggle={onToggle}
        categoryName="Meeting update"
        description="Calendar updates from Zoom, Google Meet, etc."
        color="#60A5FA"
      />
      <CategoryItem
        category="awaiting_reply"
        checked={categories.categories.awaiting_reply}
        onToggle={onToggle}
        categoryName="Awaiting reply"
        description="Sent emails awaiting a reply"
        color="#8B5CF6"
        textColor="text-white"
      />
      <CategoryItem
        category="actioned"
        checked={categories.categories.actioned}
        onToggle={onToggle}
        categoryName="Actioned"
        description="Sent emails not awaiting a reply"
        color="#8B5CF6"
        textColor="text-white"
      />
    </div>
  </motion.div>
);
