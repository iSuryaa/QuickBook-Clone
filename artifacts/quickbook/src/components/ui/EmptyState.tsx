import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
      <p className="font-bold text-base text-slate-700 mb-1">{title}</p>
      <p className="text-sm text-slate-400 max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-6 py-2.5 bg-indigo-500 text-white rounded-full text-sm font-semibold shadow-sm shadow-indigo-200 active:scale-95 transition-transform"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
