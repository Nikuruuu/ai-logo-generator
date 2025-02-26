"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-md group-[.toaster]:font-medium",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:!text-gray-700 dark:group-[.toast]:!text-gray-200",
          // "group-[.toast]:!text-gray-700 dark:group-[.toast]:!text-gray-200 text-base font-normal",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/90",
          error:
            "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/10 group-[.toaster]:text-red-900 dark:group-[.toaster]:text-red-200",
          warning:
            "group-[.toaster]:border-yellow-500/30 group-[.toaster]:bg-yellow-500/10 group-[.toaster]:text-black dark:group-[.toaster]:text-white",
          success:
            "group-[.toaster]:border-green-500/30 group-[.toaster]:bg-green-500/10 group-[.toaster]:text-green-900 dark:group-[.toaster]:text-green-200",
          info: "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-500/10 group-[.toaster]:text-black dark:group-[.toaster]:text-white",
          icon: "group-[.toast]:text-current",
          title: "group-[.toast]:font-semibold group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
