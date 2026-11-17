import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type EmptyPreviewListProps = {
  layout: "default" | "mobile";
  isDragging: boolean;
};

export default function EmptyPreviewList({
  layout,
  isDragging,
}: EmptyPreviewListProps) {
  const { t } = useTranslation("commons", { keyPrefix: "preview" });
  const isMobileLayout = layout === "mobile";

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground",
        isMobileLayout ? "h-48 bg-secondary/40 px-6" : "min-h-64",
        isDragging && !isMobileLayout
          ? "border-foreground/40 bg-secondary"
          : "border-border",
      )}
    >
      <p className="text-sm text-foreground">{t("no-files")}</p>
    </div>
  );
}
