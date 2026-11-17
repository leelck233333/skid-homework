import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
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
      <ImageIcon className="mb-2 h-6 w-6" />
      <p className="text-sm text-foreground">{t("no-files")}</p>
      <p className="mt-1 max-w-xs text-sm">
        {isMobileLayout
          ? t("drag-tip-mobile", { defaultValue: t("drag-tip") })
          : t("drag-tip")}
      </p>
      {!isMobileLayout && (
        <p className="mt-3 text-xs">{t("supported-types")}</p>
      )}
    </div>
  );
}
