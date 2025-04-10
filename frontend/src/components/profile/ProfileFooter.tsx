import { Button } from "../ui/button";
import { Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { TFunction } from "i18next";
interface ProfileFooterProps {
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSaveDisabled?: boolean;
    t: TFunction
}

export const ProfileFooter = ({ isSubmitting, onSubmit, onCancel, isSaveDisabled, t }: ProfileFooterProps) => {
    return (
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-0 pt-3 border-t ">
            <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white hover:text-white  dark:border-none"
                onClick={onCancel}
                disabled={isSaveDisabled}
            >
                <X className="mr-2 h-4 w-4" />
                {t("edit-profile.cancel")}
            </Button>
            <Button
                type="submit"
                disabled={isSubmitting || isSaveDisabled}
                className="flex items-center justify-center w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white"
                onClick={onSubmit}
            >
                {isSubmitting ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        {t("edit-profile.saving")}
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("edit-profile.save")}
                    </>
                )}
            </Button>
        </div>
    );
};