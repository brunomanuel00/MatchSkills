import { X } from "lucide-react";
import { ModalProps } from "../types/utils";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

const SIZE_CLASSES = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
};

export const Modal = ({ isOpen, onClose, children, title, size = "md", large = false }: ModalProps) => {
    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={`bg-white dark:bg-gray-800 p-2 ${SIZE_CLASSES[size]} ${large && "h-full"} rounded-lg w-full max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex justify-between items-center p-4">
                            <h3 className="font-bold text-lg">{title}</h3>
                            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="w-full h-px bg-slate-600 dark:bg-slate-50"></div>
                        <div className="">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};