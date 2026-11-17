"use client";

import { useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export type ChatComposerProps = {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isSending: boolean;
  disabled: boolean;
}

export default function ChatComposer({
  input,
  setInput,
  onSend,
  isSending,
  disabled,
}: ChatComposerProps) {
  const { t } = useTranslation("commons", { keyPrefix: "chat-page.composer" });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(
        Math.max(scrollHeight, 24),
        200,
      )}px`;
    }
  }, [input]);

  return (
    <div className="shrink-0 border-t bg-background px-4 py-3">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={t("placeholder")}
          disabled={disabled || isSending}
          aria-label={t("placeholder")}
          className="max-h-50 min-h-11 w-full resize-none text-base"
        />
        <Button
          size="icon"
          onClick={onSend}
          disabled={!input.trim() || isSending || disabled}
          aria-label={t("send")}
          className="mb-0.5 shrink-0"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-xs text-muted-foreground">
        {t("aigc-disclaimer")}
      </p>
    </div>
  );
}
