import { CategoryToggleProps } from "./types";
import { motion } from "framer-motion";

export const CategoryItem: React.FC<CategoryToggleProps> = ({
  category,
  checked,
  onToggle,
  categoryName,
  description,
  color,
  textColor = "text-black",
}) => (
  <motion.div
    className="px-6 py-2 flex items-center justify-between"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <div
      className={`h-7 w-7 flex items-center justify-center cursor-pointer rounded-lg border border-white/10 bg-zinc-900 ${checked ? "" : "hover:border-[#6D28D9]"}`}
      style={{ backgroundColor: checked ? color : "" }}
      onClick={() => onToggle(category, !checked)}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 text-black"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
    <div className="flex-1 flex items-center gap-3 ml-6">
      <span
        className={`${color} ${textColor} px-3 py-1 rounded text-sm font-medium`}
      >
        {categoryName}
      </span>
      <span className="text-gray-400 text-sm">{description}</span>
    </div>
  </motion.div>
);
