"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Edit2, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { MemoizedMarkdown } from "../markdown/MarkdownRenderer";
import type { AiChatMessage } from "@/ai/chat-types";
import type { AiSource } from "@/store/ai-store";
import { useChatStore } from "@/store/chat-store";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export type ChatMessagesProps = {
  messages: (AiChatMessage & { id?: string; chatId?: string })[];
  resolvedSource: AiSource | null;
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const { t } = useTranslation("commons", { keyPrefix: "chat-page" });
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const updateMessage = useChatStore((state) => state.updateMessage);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const scrollToBottom = (smooth = true) => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: smooth ? "smooth" : "instant",
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => scrollToBottom(true), 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(t("actions.copied", { defaultValue: "Copied" }));
    } catch {
      toast.error(t("errors.copy-failed", { defaultValue: "Copy failed" }));
    }
  };

  const handleEditStart = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleEditSave = async (
    chatId: string | undefined,
    messageId: string,
  ) => {
    if (!chatId || !editContent.trim()) return;
    try {
      await updateMessage(chatId, messageId, { content: editContent.trim() });
      setEditingId(null);
      toast.success(t("actions.updated", { defaultValue: "Message updated" }));
    } catch (e) {
      console.error(e);
      toast.error(t("errors.update-failed", { defaultValue: "Update failed" }));
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-hidden relative">
      <ScrollArea ref={scrollAreaRef} className="h-full">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 md:px-6">
          {messages.length === 0 ? (
            <p className="px-1 py-2 text-sm text-muted-foreground">
              {t("conversation.empty-title")}
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "group flex text-sm md:text-base",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "flex min-w-0 max-w-[85%] flex-col gap-1 md:max-w-[75%]",
                    msg.role === "user"
                      ? "rounded-lg bg-secondary px-3 py-2 text-foreground"
                      : "w-full max-w-3xl px-0 py-1",
                  )}
                >
                  {editingId === msg.id ? (
                    <div className="flex flex-col gap-2 p-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-25 bg-background"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleEditCancel}
                        >
                          <X className="mr-1 h-3 w-3" />
                          {t("actions.cancel")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditSave(msg.chatId, msg.id!)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          {t("actions.save")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3">
                      <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-word leading-normal">
                        <MemoizedMarkdown source={msg.content || "..."} />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!editingId && msg.id && (
                    <div
                      className={cn(
                        "flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100",
                        msg.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(msg.content)}
                        title={t("actions.copy")}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEditStart(msg.id!, msg.content)}
                        title={t("actions.edit")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      {/* Optional: Add Regenerate button for assistant only */}
                      {/* {msg.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          title="Regenerate (Not implemented)"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      )} */}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
