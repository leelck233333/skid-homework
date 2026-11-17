"use client";

import type { FileItem } from "@/store/problems-store";
import ActionsArea from "./ActionsArea";
import UploadFilesInfo from "./UploadFilesInfo";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import UploadArea from "./UploadArea";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings-store";
import OnlineSearchToggle from "@/components/actions/OnlineSearchToggle.tsx";
import ModelSelectorPopover from "./ModelSelectorPopover";

export type ActionsCardProps = {
  items: FileItem[];
  appendFilesAction: (
    files: File[] | FileList,
    source: FileItem["source"]
  ) => void;
  totalBytes: number;
  clearAllAction: () => void;
  startScanAction: () => Promise<void>;
  allowPdfUploads: boolean;
  layout?: "default" | "mobile";
  className?: string;
};

export default function ActionsCard({
  items,
  appendFilesAction,
  totalBytes,
  clearAllAction,
  startScanAction,
  allowPdfUploads,
  layout = "default",
  className,
}: ActionsCardProps) {
  const { t } = useTranslation("commons", { keyPrefix: "actions" });
  const { t: tCommon } = useTranslation("commons");

  const {
    showModelSelectorInScanner,
    showOnlineSearchInScanner,
    onlineSearchEnabled,
    setOnlineSearchEnabled,
  } = useSettingsStore((s) => s);

  return (
    <Card className={cn("md:col-span-1", className)}>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn("space-y-4", layout === "mobile" && "px-5 pb-5 pt-1")}
      >
        <UploadArea
          appendFiles={appendFilesAction}
          allowPdf={allowPdfUploads}
        />

        <Separator className="my-2" />

        <UploadFilesInfo itemsLength={items.length} totalBytes={totalBytes} />

        {showModelSelectorInScanner && <ModelSelectorPopover />}

        <ActionsArea
          itemsLength={items.length}
          clearAll={clearAllAction}
          startScan={startScanAction}
          layout={layout}
        />

        {showOnlineSearchInScanner && (
          <div className="flex w-full">
            <OnlineSearchToggle
              checked={onlineSearchEnabled}
              onCheckedChange={setOnlineSearchEnabled}
              label={
                onlineSearchEnabled
                  ? tCommon(
                    "settings-page.thinking.online-search.toggle.enabled"
                  )
                  : tCommon(
                    "settings-page.thinking.online-search.toggle.disabled"
                  )
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
