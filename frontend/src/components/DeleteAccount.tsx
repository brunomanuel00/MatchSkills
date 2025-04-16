import { TFunction } from "i18next"
import { Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import { useCallback, useState } from "react";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";
import { useUsers } from "./context/UserContext";
interface DeleteAccount {
    t: TFunction<"translation", undefined>;
    id: string
    showText: boolean
}

export default function DeleteAccount({ t, id, showText }: DeleteAccount) {
    const { refreshUsers } = useUsers()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate()

    const handleDeleteAccount = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await userService.deleteUser(id)
            refreshUsers()
            navigate(0)
        } catch (error) {
            console.error("Failed to delete account", error);
        }
    }, [])

    return (
        <div>
            <button type="button" title={t('edit-profile.delete-account')} onClick={() => setIsDeleteModalOpen(true)}
                className="flex justify-center items-center gap-2 text-white bg-red-600 hover:bg-red-500 px-6 py-2 rounded-md"
            >
                <Trash2 className="h-4 w-4" />

                {showText && <span className="ml-2 ">{t('edit-profile.delete-account')}</span>}

            </button>
            <div>
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)
                    }
                    title={t("modal.delete-account.title")}
                >
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                        {t("modal.delete-account.description")}
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                        >
                            {t("modal.delete-account.cancel")}
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                            {t("modal.delete-account.accept")}
                        </button>
                    </div>
                </Modal >
            </div>
        </div>
    )


}

