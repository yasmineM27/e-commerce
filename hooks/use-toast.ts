// Adapted from: https://ui.shadcn.com/docs/components/toast
"use client"

import { toast as sonnerToast, type Toast } from "sonner"

type ToastProps = Toast & {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ title, description, variant, ...props }: ToastProps) => {
    return sonnerToast[variant === "destructive" ? "error" : "success"](title, {
      description,
      ...props,
    })
  }

  toast.error = (title: string, options?: Omit<ToastProps, "title" | "variant">) => {
    return sonnerToast.error(title, options)
  }

  toast.success = (title: string, options?: Omit<ToastProps, "title" | "variant">) => {
    return sonnerToast.success(title, options)
  }

  toast.info = (title: string, options?: Omit<ToastProps, "title" | "variant">) => {
    return sonnerToast.info(title, options)
  }

  toast.warning = (title: string, options?: Omit<ToastProps, "title" | "variant">) => {
    return sonnerToast.warning(title, options)
  }

  toast.dismiss = sonnerToast.dismiss
  toast.message = sonnerToast

  return { toast }
}
