import { useEffect, useState } from "react"
import { useNotifications } from "../components/hooks/useNotifications"
import { Spinner } from "../components/ui/spinner"
import { Checkbox } from "../components/ui/checkbox"
import { Bell, CheckSquare, Square, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function NotificationsPage() {
    const {
        notifications,
        loading,
        selectedNotifications,
        markNotificationsAsRead,
        deleteAllNotifications,
        handleSelectedToggle,
        handleSelectAllNot
    } = useNotifications()
    const { t } = useTranslation()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteType, setDeleteType] = useState<'all' | 'selected'>('all')

    const confirmDelete = (type: 'all' | 'selected') => {
        setDeleteType(type)
        setShowDeleteConfirm(true)
    }


    if (loading) {
        return (
            <Spinner></Spinner>
        )
    }

    if (notifications.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <Bell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t('notifications.empty.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('notifications.empty.description')}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen flex items-start justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <div className="w-full max-w-4xl mt-20">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-t-lg p-6 shadow-lg">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('notifications.title')} ({notifications.length})
                        </h1>

                        <div className="flex flex-wrap gap-3 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSelectAllNot}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                >
                                    {selectedNotifications.length === notifications.length ? (
                                        <>
                                            <CheckSquare className="h-4 w-4" />
                                            {t('notifications.actions.deselectAll')}
                                        </>
                                    ) : (
                                        <>
                                            <Square className="h-4 w-4" />
                                            {t('notifications.actions.selectAll')}
                                        </>
                                    )}
                                </button>

                                {selectedNotifications.length > 0 && (
                                    <>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {t('notifications.selected', { count: selectedNotifications.length })}
                                        </span>
                                        <button
                                            onClick={markNotificationsAsRead}
                                            className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                                        >
                                            {t('notifications.actions.markSelectedAsRead')}
                                        </button>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => confirmDelete('all')}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                {t('notifications.actions.deleteAll')}
                            </button>
                        </div>
                        <div>

                        </div>

                    </div>
                    <div className=" bg-white dark:bg-gray-800 rounded-b-lg shadow-lg">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700" >
                            {notifications.map(not => (
                                <li key={not.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!not.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}>
                                    <div className="flex mx-1 items-center justify-start h-full">
                                        <Checkbox
                                            checked={selectedNotifications.includes(not.id)}
                                            onCheckedChange={() => handleSelectedToggle(not.id)}
                                            className="mx-4"
                                        />
                                        <span className="text-lg">{not.data.message}</span>
                                    </div>
                                    <div className=" ml-4 mt-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${not.type === 'new_match'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                            }`}>
                                            {t(`notifications.types.${not.type}`)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('notifications.delete.confirm.title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    {deleteType === 'all'
                                        ? t('notifications.delete.confirm.messageAll')
                                        : t('notifications.delete.confirm.messageSelected', {
                                            count: selectedNotifications.length
                                        })
                                    }
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        // onClick={executeDelete}
                                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}