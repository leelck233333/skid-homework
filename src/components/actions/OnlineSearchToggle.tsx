import { cn } from "@/lib/utils.ts";
import { Globe } from "lucide-react";

export type OnlineSearchToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

export default function OnlineSearchToggle({
  checked,
  onCheckedChange,
  label,
}: OnlineSearchToggleProps) {
  return (
    <label className="relative flex-1 cursor-pointer">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />

      <div
        className={cn(
          "flex h-9 w-full items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium",
          "border-input bg-background text-foreground",
          "peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
        )}
      >
        <Globe className="h-4 w-4 shrink-0" />
        <span className="truncate select-none">{label}</span>
      </div>
    </label>
  );
}
