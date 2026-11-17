"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Check,
  ChevronsUpDown,
  Menu,
  PanelLeftOpen,
  Settings2,
} from "lucide-react";

import type { AiSource } from "@/store/ai-store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { ChatThreadRecord } from "@/db/chat-db";

export type ChatHeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  renderSidebar: (mobile?: boolean) => React.ReactNode;
  availableSources: AiSource[];
  resolvedSource: AiSource | null;
  resolvedSourceId: string | null;
  activeThread?: ChatThreadRecord;
  modelInput: string;
  setModelInput: (val: string) => void;
  onSelectSource: (id: string) => void;
  onUpdateModel: (id: string, model: string) => void;
}

export default function ChatHeader({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  renderSidebar,
  availableSources,
  resolvedSource,
  resolvedSourceId,
  activeThread,
  modelInput,
  setModelInput,
  onSelectSource,
  onUpdateModel,
}: ChatHeaderProps) {
  const { t } = useTranslation("commons", { keyPrefix: "chat-page" });

  return (
    <header className="z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
      <div className="flex items-center gap-2">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-75 p-0">
            <SheetHeader className="border-b px-4 py-3 text-left">
              <SheetTitle>{t("history.title")}</SheetTitle>
            </SheetHeader>
            {renderSidebar(true)}
          </SheetContent>
        </Sheet>

        {sidebarCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setSidebarCollapsed(false)}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("actions.open-sidebar")}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2 font-normal text-muted-foreground hover:text-foreground"
          >
            <span className="font-medium text-foreground">
              {resolvedSource?.name || t("source.select.placeholder")}
            </span>
            {activeThread?.model && (
              <span className="max-w-40 truncate text-muted-foreground">
                {activeThread.model}
              </span>
            )}
            <ChevronsUpDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-75 p-0" align="start">
          <Command>
            <CommandInput placeholder={t("source.search")} />
            <CommandList>
              <CommandEmpty>{t("source.empty")}</CommandEmpty>
              <CommandGroup heading={t("source.section")}>
                {availableSources.map((source) => (
                  <CommandItem
                    key={source.id}
                    onSelect={() => onSelectSource(source.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{source.name}</span>
                    </div>
                    {source.id === resolvedSourceId && (
                      <Check className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="border-t bg-background p-3">
              <label
                htmlFor="chat-model-name"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                {t("source.model")}
              </label>
              <Input
                id="chat-model-name"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                className="h-9 text-sm"
                placeholder={t("source.model-placeholder")}
                onBlur={() => {
                  if (activeThread && modelInput !== activeThread.model) {
                    onUpdateModel(activeThread.id, modelInput);
                  }
                }}
              />
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings?from=/chat">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            {t("actions.open-settings", { defaultValue: "Settings" })}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
