import { Loader2Icon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useProblemsStore } from "@/store/problems-store";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useShortcut } from "@/hooks/use-shortcut";
import GlobalTraitsEditor from "./GlobalTraitsEditor";

export type ActionsAreaProps = {
  startScan: () => Promise<void>;
  clearAll: () => void;
  itemsLength: number;
  layout?: "default" | "mobile";
};

export default function ActionsArea({
  startScan,
  itemsLength,
  clearAll,
  layout = "default",
}: ActionsAreaProps) {
  const { t } = useTranslation("commons", { keyPrefix: "actions" });
  const isMobileLayout = layout === "mobile";

  const isWorking = useProblemsStore((s) => s.isWorking);
  const handleSkidBtnClicked = useCallback(() => {
    if (isWorking) return;
    startScan();
  }, [isWorking, startScan]);

  const clearAllBtnRef = useRef<HTMLButtonElement | null>(null);
  const skidBtnRef = useRef<HTMLButtonElement | null>(null);

  const [confirmedClear, setConfirmedClear] = useState(false);

  const handleClearAll = useCallback(() => {
    if (confirmedClear) {
      clearAll();
      setConfirmedClear(false);
    } else {
      setConfirmedClear(true);
    }
  }, [clearAll, confirmedClear]);

  useEffect(() => {
    if (!confirmedClear) return; // do not modify the variable if it is already false
    const timeoutId = setTimeout(() => {
      setConfirmedClear(false);
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [confirmedClear, setConfirmedClear]);

  useShortcut(
    "startScan",
    () => skidBtnRef.current?.click(),
    [],
  );

  useShortcut(
    "clearAll",
    () => clearAllBtnRef.current?.click(),
    [confirmedClear],
  );

  return (
    <div className={cn("flex gap-2 flex-col", isMobileLayout && "gap-3")}>
      <GlobalTraitsEditor
        className={cn(
          "w-full items-center justify-center",
          isMobileLayout && "min-h-11",
        )}
      />

      <div className="flex flex-col gap-1">
        <Button
          ref={skidBtnRef}
          className={cn("w-full", isMobileLayout && "min-h-11")}
          size={isMobileLayout ? "lg" : "default"}
          disabled={itemsLength === 0 || isWorking}
          onClick={handleSkidBtnClicked}
        >
          {isWorking ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" /> {t("processing")}
            </>
          ) : (
            t("scan")
          )}
        </Button>
        <Button
          ref={clearAllBtnRef}
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground",
            confirmedClear && "text-destructive hover:text-destructive",
            itemsLength === 0 && "invisible",
          )}
          disabled={itemsLength === 0 || isWorking}
          onClick={handleClearAll}
        >
          <Trash2 className="h-4 w-4" />
          {!confirmedClear ? t("clear-all") : t("clear-confirmation")}
        </Button>
      </div>
    </div>
  );
}
