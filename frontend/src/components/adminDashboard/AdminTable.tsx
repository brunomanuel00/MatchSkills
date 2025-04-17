import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
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
import { User } from "../../types/authTypes";
import { useUsers } from "../context/UserContext";

export function AdminTable() {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const { users, refreshUsers, loading } = useUsers()

    const [currentPage, setCurrentPage] = useState(1);
    const { t } = useTranslation()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
    const [deploy, setDeploy] = useState(false)

    const totalPages = Math.ceil(users.length / pageSize);
    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectionToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === paginatedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(paginatedUsers.map(user => user.id));
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        handleDeleteSelected()
    };

    const handleDeleteSelected = () => {
        setSelectedUsers([]);
    };

    const editUser = (user: User) => {
        setIsEditModalOpen(true)
        setUserToEdit(user)
        refreshUsers()
    }

    return (
        <div className="flex flex-col bg-white dark:bg-lapis_lazuli-300/70 p-4 rounded-md gap-3 md:w-full md:mx-10 overflow-auto mt-16">
            {/* Controles superiores */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <DropdownMenu onOpenChange={(open) => setDeploy(open)}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"

                                className="w-full px-4 py-2 border rounded-lg text-left flex justify-between items-center dark:bg-lapis_lazuli-300/70 dark:border-verdigris-400"
                            >
                                <span>{t('table.show')} {pageSize}</span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${deploy ? 'rotate-180' : ''} `}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
                        <Button variant="destructive" onClick={handleDeleteSelected}>
                            {t('table.delete')} ({selectedUsers.length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className="rounded-md border border-cyan-700">
                <Table className=" border-cyan-700">
                    <TableHeader className=" border-cyan-700">
                        <TableRow className=" border-cyan-700" >
                            <TableHead className="flex items-center gap-x-2 text-black dark:text-white">
                                <Checkbox
                                    checked={
                                        paginatedUsers.length > 0 &&
                                        selectedUsers.length === paginatedUsers.length
                                    }
                                    onCheckedChange={handleSelectAll}
                                />
                                {t('table.selectAll')}
                            </TableHead>
                            <TableHead className="text-black dark:text-white md:-translate-x-10">{t('table.photo')}</TableHead>
                            <TableHead className="text-black dark:text-white md:-translate-x-10">{t('table.user')}</TableHead>
                            <TableHead className="text-black dark:text-white md:-translate-x-10">{t('table.email')}</TableHead>
                            <TableHead className="text-black dark:text-white md:-translate-x-10">{t('table.role')}</TableHead>
                            <TableHead className="text-black dark:text-white md:translate-x-14">{t('table.action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="border-cyan-700">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Spinner />
                                </TableCell>
                            </TableRow>
                        ) : paginatedUsers.length > 0 ? (
                            paginatedUsers.map(user => (
                                <TableRow key={user.id} className=" border-cyan-700">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => handleSelectionToggle(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="md:-translate-x-10">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar?.url || ""} />
                                                <AvatarFallback>
                                                    {user.name?.charAt(0).toUpperCase() || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </TableCell>
                                    <TableCell className="md:-translate-x-10">
                                        <div className="flex items-center gap-3">
                                            <span>{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="md:-translate-x-10">{user.email}</TableCell>
                                    <TableCell className="md:-translate-x-11">
                                        <Badge
                                            variant={
                                                user.rol === "admin" ? "destructive" : "secondary"
                                            }
                                        >
                                            {user.rol}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex gap-x-2 md:translate-x-10">
                                        <DeleteAccount t={t} id={user.id} showText={false} />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="bg-gray-400 hover:bg-green-300 dark:hover:hover:bg-cyan-800"
                                            onClick={() => editUser(user)}
                                        >
                                            {t('table.edit')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    {t('table.not-found')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-600 dark:text-white text-muted-foreground">
                    {t('table.showing')} {(currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, users.length)} {t('table.of')} {users.length} {t('table.users')}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={t('edit-user.title')}
                size="xl"
            >
                <ProfileEditor user={userToEdit} onClose={() => setIsEditModalOpen(false)} isModal={true} />
            </Modal>

        </div>
    );
}
