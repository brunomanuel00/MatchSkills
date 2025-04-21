import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DeleteAccount from "../DeleteAccount";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modal";
import { ProfileEditor } from "../profile/ProfileEditor";
import { useUsers } from "../context/UserContext";

export function AdminTable() {
    const { t } = useTranslation();
    const [deploy, setDeploy] = useState(false);
    const {
        users,
        currentPage,
        pageSize,
        totalPages,
        totalUsers,
        loading,
        selectedUsers,
        isEditModalOpen,
        isDeleteModalOpen,
        userToEdit,
        loadingUser,
        setPageSize,
        setCurrentPage,
        handleSelectionToggle,
        handleSelectAll,
        handleDeleteSelected,
        editUser,
        closeEditModal,
        closeDeleteModal,
        openDeleteModal
    } = useUsers();

    return (
        <div className="flex flex-col bg-white dark:bg-lapis_lazuli-300/70 p-4 rounded-md gap-3 w-full max-w-[calc(100vw-32px)] md:max-w-full overflow-x-auto md:overflow-visible md:mx-10 mt-16">
            {/* Controles superiores */}
            <div className="flex flex-col sm:flex-row items-start pl-2 md:pl-0 sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 ">
                    <DropdownMenu onOpenChange={(open) => setDeploy(open)}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full px-4 py-2 border rounded-lg flex justify-between items-center dark:bg-lapis_lazuli-300/70 dark:border-verdigris-400"
                            >
                                <span>{t('table.show')} {pageSize}</span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${deploy ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                            {[10, 20, 30, 40, 50].map(size => (
                                <DropdownMenuItem
                                    key={size}
                                    onClick={() => {
                                        setPageSize(size);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {size} {t("table.paginate")}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {selectedUsers.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={openDeleteModal}
                            className="whitespace-nowrap"
                        >
                            {t('table.delete')} ({selectedUsers.length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto pb-2 mx-2 md:mx-0 border border-cyan-700 rounded-lg">
                <Table className="min-w-[800px] md:min-w-full">
                    <TableHeader >
                        <TableRow className="border-b-cyan-700 bg-slate-200 hover:bg-slate-200 dark:bg-cyan-950">
                            <TableHead className="max-w-7xl px-3 py-3 text-black dark:text-white text-center align-middle rounded-tl-lg">
                                <div className="flex items-center gap-x-2 ">
                                    <Checkbox
                                        checked={
                                            users.length > 0 &&
                                            selectedUsers.length === users.length
                                        }
                                        onCheckedChange={handleSelectAll}
                                    />
                                    <span className="hidden md:inline">{t('table.selectAll')}</span>
                                </div>
                            </TableHead>
                            <TableHead className="px-2 py-3 text-black dark:text-white whitespace-nowrap text-center align-middle w-[100px]">{t('table.photo')}</TableHead>
                            <TableHead className="px-2 py-3 text-black dark:text-white whitespace-nowrap text-center align-middle">{t('table.user')}</TableHead>
                            <TableHead className="px-2 py-3 text-black dark:text-white whitespace-nowrap text-center align-middle">{t('table.email')}</TableHead>
                            <TableHead className="px-2 py-3 text-black dark:text-white whitespace-nowrap text-center align-middle">{t('table.role')}</TableHead>
                            <TableHead className="px-2 py-3 text-black dark:text-white whitespace-nowrap text-center align-middle">{t('table.action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="border-cyan-700">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center align-middle">
                                    <Spinner />
                                </TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map(user => (
                                <TableRow key={user.id} className="border-cyan-700">
                                    <TableCell className="px-2 py-2 text-center align-middle">
                                        <div className="flex mx-1 items-center justify-start h-full">
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={() => handleSelectionToggle(user.id)}
                                                className="translate-y-[2px]"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-1 pr-0 py-2 text-center align-middle">
                                        <div className="flex items-center justify-center">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar?.url} />
                                            </Avatar>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-0 pl-1 py-2 whitespace-nowrap text-center align-middle">
                                        <span className="font-medium">{user.name}</span>
                                    </TableCell>
                                    <TableCell className="px-2 py-2 whitespace-nowrap text-center align-middle">{user.email}</TableCell>
                                    <TableCell className="px-2 py-2 text-center align-middle">
                                        <Badge
                                            variant={user.rol === "admin" ? "destructive" : "secondary"}
                                            className="whitespace-nowrap mx-auto"
                                        >
                                            {user.rol}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-2 py-2 text-center align-middle">
                                        <div className="flex items-center justify-center gap-2">
                                            <DeleteAccount t={t} id={user.id} showText={false} />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-gray-400 hover:bg-green-300 dark:hover:bg-cyan-800 whitespace-nowrap"
                                                onClick={() => editUser(user.id)}
                                            >
                                                {t('table.edit')}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center align-middle">
                                    {t('table.not-found')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
                <div className="text-sm text-gray-600 dark:text-white text-muted-foreground whitespace-nowrap">
                    {t('table.showing')} {(currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, totalUsers)} {t('table.of')} {totalUsers} {t('table.users')}
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="sm:hidden">
                        <Button variant="default" size="sm" className="h-8 w-8 p-0">
                            {currentPage}
                        </Button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="h-8 w-8 p-0 min-w-[32px]"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title={t('edit-user.title')}
                size="xl"
                large={true}
            >
                {loadingUser ? <Spinner isModal={true} /> :
                    <ProfileEditor user={userToEdit} onClose={closeEditModal} isModal={true} />
                }
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title={t('table.delete-users')}
            >
                {loadingUser ? <Spinner isModal={true} />
                    :
                    <div>
                        <p>{t("table.description-delete-users")}</p>
                        <div className="flex justify-end m-4">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 m-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                            >
                                {t("modal.delete-account.cancel")}
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                className="px-4 py-2 m-2 bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                                {t("modal.delete-account.accept")}
                            </button>
                        </div>
                    </div>
                }
            </Modal>
        </div>
    );
}