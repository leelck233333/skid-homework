"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useShortcut } from "@/hooks/use-shortcut";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { t } = useTranslation("commons");

  useShortcut(
    "openChat",
    (event) => {
      event.preventDefault();
      router.push("/chat");
    },
    [router],
  );

  useShortcut(
    "openSettings",
    (event) => {
      event.preventDefault();
      if (pathname.startsWith("/chat")) {
        router.push("/settings?from=/chat");
        return;
      }
      router.push("/settings");
    },
    [pathname, router],
  );

  const items = [
    {
      key: "workspace" as const,
      href: "/",
      active: pathname === "/",
    },
    {
      key: "chat" as const,
      href: "/chat",
      active: pathname.startsWith("/chat"),
    },
    {
      key: "settings" as const,
      href: pathname.startsWith("/chat")
        ? "/settings?from=/chat"
        : "/settings",
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 rounded-sm text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("nav.brand")}
          </Link>
          <nav
            aria-label={t("nav.brand")}
            className="flex min-w-0 items-center gap-1 overflow-x-auto"
          >
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center rounded-md px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  item.active
                    ? "bg-accent font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
