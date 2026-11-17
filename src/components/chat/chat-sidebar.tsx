"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Plus,
  Trash2,
  GitFork,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiSource } from "@/store/ai-store";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Kbd } from "../ui/kbd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChatThreadRecord } from "@/db/chat-db";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export type ChatSidebarProps = {
  threads: ChatThreadRecord[];
  activeChatId?: string;
  sourceMap: Map<string, AiSource>;
  searchQuery: string;

  onSearchChange: (query: string) => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onForkChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onCloseMobile?: () => void;
}

export default function ChatSidebar({
  threads,
  activeChatId,
  sourceMap,
  searchQuery,

  onSearchChange,
  onNewChat,
  onSelectChat,
  onForkChat,
  onDeleteChat,
  onCloseMobile,
}: ChatSidebarProps) {
  const { t } = useTranslation("commons", { keyPrefix: "chat-page" });
  const searchBoxRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    "/",
    () => {
      searchBoxRef.current?.focus();
    },
    { preventDefault: true, useKey: true },
  );

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          {t("actions.new-chat")}
        </Button>
      </div>

      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchBoxRef}
            placeholder={t("actions.search")}
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Kbd className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground">
            /
          </Kbd>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-3">
          {threads.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              <p>{t("history.empty")}</p>
            </div>
          ) : (
            <div className="space-y-1 pb-4">
              {threads.map((thread) => {
                const isActive = thread.id === activeChatId;
                return (
                  <div
                    key={thread.id}
                    className="group relative flex items-center"
                  >
                    <button
                      onClick={() => {
                        onSelectChat(thread.id);
                        onCloseMobile?.();
                      }}
                      className={cn(
                        "flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-background font-medium text-foreground"
                          : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                      )}
                    >
                      <span className="truncate w-45 text-left">
                        {thread.title}
                      </span>
                      <span className="max-w-full truncate text-xs text-muted-foreground">
                        {sourceMap.get(thread.sourceId)?.name ??
                          t("history.unknown-source")}
                      </span>
                    </button>
                    {isActive && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onForkChat(thread.id)}
                            >
                              <GitFork className="mr-2 h-4 w-4" /> Fork
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteChat(thread.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-3">
        <Link href="/" passHref>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            size="sm"
          >
            {t("actions.back")}
            <Kbd>ESC</Kbd>
          </Button>
        </Link>
      </div>
    </div>
  );
}
