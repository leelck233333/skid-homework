"use client";
import { SubmitEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DEFAULT_DEEPSEEK_BASE_URL,
  DEFAULT_GEMINI_BASE_URL,
  DEFAULT_OPENAI_BASE_URL,
  useAiStore,
} from "@/store/ai-store";
import { Label } from "../ui/label";
import { Trans, useTranslation } from "react-i18next";

export default function InitPage() {
  const sources = useAiStore((s) => s.sources);
  const activeSourceId = useAiStore((s) => s.activeSourceId);
  const setActiveSource = useAiStore((s) => s.setActiveSource);
  const updateSource = useAiStore((s) => s.updateSource);

  const activeSource = useMemo(
    () => sources.find((source) => source.id === activeSourceId) ?? sources[0],
    [sources, activeSourceId],
  );

  const [key, setKey] = useState(activeSource?.apiKey ?? "");
  const [baseUrl, setBaseUrl] = useState<string | undefined>(
    activeSource?.baseUrl,
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation("commons", { keyPrefix: "init-page" });
  const { t: tNav } = useTranslation("commons");

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!activeSource) return;
    const trimmedKey = key.trim();
    if (!trimmedKey) return;

    const trimmedBase = (baseUrl ?? "").trim();
    const defaultBaseUrl =
      activeSource.provider === "gemini"
        ? DEFAULT_GEMINI_BASE_URL
        : DEFAULT_OPENAI_BASE_URL;

    updateSource(activeSource.id, {
      apiKey: trimmedKey || null,
      baseUrl: trimmedBase || defaultBaseUrl,
      enabled: true,
    });
    const from = searchParams.get("from");
    const to = from && from !== "/init" ? from : "/";
    router.replace(to);
  };

  const applyPreset = (url: string, name?: string) => {
    setBaseUrl(url);
    if (activeSource) {
      updateSource(activeSource.id, {
        baseUrl: url,
        ...(name ? { name } : {}),
      });
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-14 w-full max-w-lg items-center px-4">
        <span className="text-sm font-semibold tracking-tight">
          {tNav("nav.brand")}
        </span>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 pb-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("headline.highlight")}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="provider">{t("form.provider.label")}</Label>
            <select
              id="provider"
              className="ui-select"
              value={activeSource?.id}
              onChange={(event) => setActiveSource(event.target.value)}
            >
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">
              {t("form.key-placeholder", {
                provider: activeSource?.name ?? "",
              })}
            </Label>
            <Input
              id="api-key"
              type="password"
              autoComplete="off"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base-url">{t("form.advanced.base-url-label")}</Label>
            <Input
              id="base-url"
              type="url"
              placeholder={t("form.advanced.base-url-placeholder", {
                provider: activeSource?.name ?? "",
              })}
              value={baseUrl ?? ""}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="h-10"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  applyPreset(DEFAULT_DEEPSEEK_BASE_URL, "DeepSeek")
                }
              >
                DeepSeek
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => applyPreset(DEFAULT_OPENAI_BASE_URL)}
              >
                OpenAI
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => applyPreset("https://openrouter.ai/api/v1")}
              >
                OpenRouter
              </Button>
            </div>
          </div>

          <Button type="submit" className="h-10 w-full" disabled={!key.trim()}>
            {t("form.submit")}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          {activeSource?.provider === "gemini" ? (
            <Trans
              t={t}
              i18nKey="form.api-hint"
              components={{
                link: (
                  <a
                    href="https://aistudio.google.com/api-keys"
                    className="text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ),
              }}
            />
          ) : (
            <Trans
              t={t}
              i18nKey="form.api-hint-openai"
              components={{
                link: (
                  <a
                    href="https://platform.openai.com/settings/organization/api-keys"
                    className="text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ),
              }}
            />
          )}
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("form.storage-note")}
        </p>

        <footer className="mt-12 text-xs text-muted-foreground">
          {t("footer.notice")}{" "}
          <a
            href="https://github.com/cubewhy/skid-homework"
            className="text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            https://github.com/cubewhy/skid-homework
          </a>
        </footer>
      </main>
    </div>
  );
}
