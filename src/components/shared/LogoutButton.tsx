"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/services/auth.service";

type LogoutButtonProps = {
  redirectTo?: string;
  className?: string;
};

export default function LogoutButton({
  redirectTo = "/login",
  className,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const defaultColorClasses =
    "text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-950/20";

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={loading}
      className={cn(
        "w-full justify-start transition-colors duration-200 rounded-xl",
        className ?? defaultColorClasses,
      )}
      onClick={async () => {
        try {
          setLoading(true);
          await logoutAction();
          // Dispatch custom event for navbar to listen
          window.dispatchEvent(new Event("auth-state-changed"));
          router.replace(redirectTo);
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
