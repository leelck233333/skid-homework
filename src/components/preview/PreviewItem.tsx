import { FileItem, FileStatus, useProblemsStore } from "@/store/problems-store";
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { X, Pen, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import FileContent from "./FileContent";
import { Label } from "../ui/label";

export type PreviewItemProps = {
  item: FileItem;
  layout: "default" | "mobile";
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
};

function getColorClassByStatus(status: FileStatus) {
  if (status === "failed") return "border-destructive";
  if (status === "processing") return "border-foreground";
  return "border-border";
}

export default function PreviewItem({
  item,
  layout,
  onRemove,
  onRename,
}: PreviewItemProps) {
  const { t } = useTranslation("commons", { keyPrefix: "preview" });
  const { t: tCommon } = useTranslation("commons");

  const { setSelectedImageId, selectedImageId } = useProblemsStore((s) => s);

  const isMobile = layout === "mobile";
  const isSelected = selectedImageId === item.id;

  const switchActiveItem = () => {
    setSelectedImageId(item.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {/* The main component */}
        <figure
          onDoubleClick={switchActiveItem}
          className={twMerge(
            "group relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card shadow-xs transition select-none",
            isMobile ? "h-64 min-w-[72vw]" : "",
            isSelected ? "bg-secondary" : "",
            getColorClassByStatus(item.status),
          )}
        >
          <div className={isMobile ? "h-48" : "h-40"}>
            <FileContent it={item} />
          </div>

          <figcaption className="flex flex-col gap-0.5 px-3 py-2 text-xs">
            <span className="truncate font-medium text-foreground" title={item.displayName}>
              {item.displayName}
            </span>
            <span className="text-muted-foreground">
              {t(`status.${item.status}`)}
              {" · "}
              {tCommon(`sources.${item.source}`)}
            </span>
          </figcaption>

          <button
            className={twMerge(
              "absolute right-2 top-2 cursor-pointer rounded-md bg-foreground/85 p-1.5 text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !isMobile && "hidden group-hover:block group-focus-within:block",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            aria-label={t("remove.aria")}
          >
            <X className="h-4 w-4" />
          </button>
        </figure>
      </ContextMenuTrigger>

      <ContextMenuContent>
        {isMobile ? (
          <Label className="px-2 py-1.5">{item.displayName}</Label>
        ) : (
          <ContextMenuItem disabled>{item.displayName}</ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onRename(item.id, item.displayName)}>
          <Pen className="mr-2 h-4 w-4" />
          {t("rename.menu-item")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onRemove(item.id)}
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("remove.menu-item")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
