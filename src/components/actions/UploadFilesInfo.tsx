import { useTranslation } from "react-i18next";

function bytesToReadable(size: number) {
  const units = ["B", "KB", "MB", "GB"];
  let u = 0;
  while (size >= 1024 && u < units.length - 1) {
    size /= 1024;
    u++;
  }
  return `${size.toFixed(u === 0 ? 0 : 1)} ${units[u]}`;
}

export type InfoAreaProps = {
  itemsLength: number;
  totalBytes: number;
};

export default function UploadFilesInfo({
  itemsLength,
  totalBytes,
}: InfoAreaProps) {
  const { t } = useTranslation("commons", { keyPrefix: "uploads-info" });
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{t("selected")}</span>
      <span className="tabular-nums text-foreground">
        {itemsLength}
        <span className="ml-2 text-muted-foreground">
          {bytesToReadable(totalBytes)}
        </span>
      </span>
    </div>
  );
}
