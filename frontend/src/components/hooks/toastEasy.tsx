import { toast } from "./use-toast";
import i18next from "i18next";

type ToastType = "success" | "error";

export const toastEasy = (type: ToastType, customMessage?: string) => {
    const templates = {
        success: {
            title: i18next.t('toaster.success.title'),
            description: customMessage || i18next.t('toaster.success.description'),
            variant: "success" as const
        },
        error: {
            title: i18next.t('toaster.error.title'),
            description: customMessage || i18next.t('toaster.error.description'),
            variant: "destructive" as const
        }
    };

    toast(templates[type]);
};