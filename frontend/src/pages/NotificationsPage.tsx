import { useState } from "react"
import { useNotifications } from "../components/hooks/useNotifications"
import { Spinner } from "../components/ui/spinner"
import { Checkbox } from "../components/ui/checkbox"
import { Bell, CheckSquare, Clock, Square, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function NotificationsPage() {
    const {
        notifications,
        loading,
        selectedNotifications,
        markNotificationsAsRead,
        deleteAllNotifications,
        deleteNotifications,
        handleSelectedToggle,
        handleSelectAllNot,
        getRelativeTime,
        formatMessage
    } = useNotifications()
    const { t } = useTranslation()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteType, setDeleteType] = useState<'all' | 'selected'>('all')

    const confirmDelete = (type: 'all' | 'selected') => {
        setDeleteType(type)
        setShowDeleteConfirm(true)
    }

    const executeDelete = async () => {

        if (deleteType === 'all') {
            await deleteAllNotifications()
            setShowDeleteConfirm(false)
        } else {
            await deleteNotifications()
            setShowDeleteConfirm(false)
        }

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
                            <div className="flex gap-2">
                                {selectedNotifications.length > 0 && (
                                    <button
                                        onClick={() => confirmDelete('selected')}
                                        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {t('notifications.actions.deleteSelected')}
                                    </button>
                                )}

                                <button
                                    onClick={() => confirmDelete('all')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {t('notifications.actions.deleteAll')}
                                </button>

                            </div>
                        </div>


                    </div>
                    <div className="bg-white pb-2 dark:bg-gray-800 rounded-b-lg shadow-lg">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <Checkbox
                                            checked={selectedNotifications.includes(notification.id)}
                                            onCheckedChange={() => handleSelectedToggle(notification.id)}
                                            className="mt-1"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className={`text-sm ${!notification.read ? 'font-semibold' : ''} text-gray-900 dark:text-white`}>
                                                        {formatMessage(notification)}
                                                    </p>

                                                    {notification.type === 'new_match' && notification.data.newMatchesCount && (
                                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                            {t('notifications.matchDetails', {
                                                                count: notification.data.newMatchesCount
                                                            })}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-4">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{getRelativeTime(notification.createdAt)}</span>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tipo de notificación */}
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${notification.type === 'new_match'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    }`}>
                                                    {t(`notifications.types.${notification.type}`)}
                                                </span>
                                            </div>
                                        </div>
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
                                        onClick={executeDelete}
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