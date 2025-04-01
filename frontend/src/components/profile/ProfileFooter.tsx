import { Button } from "../ui/button";
import { Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileFooterProps {
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSaveDisabled?: boolean;
}

export const ProfileFooter = ({ isSubmitting, onSubmit, onCancel }: ProfileFooterProps) => {
    return (
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200">
            <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center w-full sm:w-auto bg-tea_green-100 hover:bg-tea_green-200 text-lapis_lazuli-600 border-verdigris-300 dark:bg-lapis_lazuli-300 dark:text-tea_green-100 dark:hover:bg-lapis_lazuli-200"
                onClick={onCancel}
            >
                <X className="mr-2 h-4 w-4" />
                Cancel
            </Button>
            <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={onSubmit}
            >
                {isSubmitting ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </>
                )}
            </Button>
        </div>
    );
};