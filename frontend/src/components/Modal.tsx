// components/ui/modal.tsx
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-300  hover:text-gray-700 hover:dark:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="w-full h-px bg-slate-600 dark:bg-slate-50"></div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};