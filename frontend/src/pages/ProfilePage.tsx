import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import { SkillsSelector } from "../components/SkillsSelector";
import { SelectedSkills } from "../types/skillTypes";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Save, Trash2, Upload, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { TAB_VALUES, DEFAULT_AVATAR } from '../types/profileTypes'

export default function ProfilePage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [userEdit, setUserEdit] = useState(user);
    const [activeTab, setActiveTab] = useState(TAB_VALUES.PROFILE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const skills: SelectedSkills = {
        mySkills: user?.skills ?? [],
        desiredSkills: user?.lookingFor ?? []
    };

    const handleSkillsChange = (skills: SelectedSkills) => {
        console.log('Skills updated:', skills);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Saving user profile:", userEdit);
            console.log("New avatar file:", avatarFile);
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setUserEdit(prev => ({
            ...prev!,
            avatar: DEFAULT_AVATAR
        }));
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
            <div className=" min-w-full px-4 p-6 mt-20 md:px- md:py-8">

                <div className="bg-white dark:bg-lapis_lazuli-300 rounded-lg shadow-lg overflow-hidden">

                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
                            {t('edit-profile.title')}
                        </h1>
                        <h2 className="text-sm md:text-lg text-gray-600 dark:text-gray-300">
                            {t('edit-profile.subtitle')}
                        </h2>
                    </div>

                    {/* Formulario con pestañas */}
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            {/* Barra de pestañas */}
                            <TabsList className="flex bg-tea_green-100 dark:bg-lapis_lazuli-300 px-6 py-2">
                                <TabsTrigger
                                    value={TAB_VALUES.PROFILE}
                                    className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                                >
                                    Profile Information
                                </TabsTrigger>
                                <TabsTrigger
                                    value={TAB_VALUES.SKILLS}
                                    className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                                >
                                    Skills & Interests
                                </TabsTrigger>
                            </TabsList>

                            {/* Contenido de pestañas */}
                            <div className="flex-1 overflow-auto">
                                {/* Pestaña de perfil */}
                                <TabsContent value={TAB_VALUES.PROFILE} className="h-full">
                                    <CardContent className="p-6 space-y-6">
                                        {/* Sección de información básica */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor="name" className="text-lapis_lazuli-600 dark:text-tea_green-200">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={userEdit?.name}
                                                        onChange={(e) => setUserEdit({ ...userEdit!, name: e.target.value })}
                                                        className="bg-white/70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400"
                                                    />
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor="email" className="text-lapis_lazuli-600 dark:text-tea_green-200">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={userEdit?.email}
                                                        onChange={(e) => setUserEdit({ ...userEdit!, email: e.target.value })}
                                                        className="bg-white/70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400"
                                                    />
                                                </div>
                                            </div>

                                            {/* Sección de avatar */}
                                            <div className="flex flex-col space-y-2">
                                                <Label className="text-lapis_lazuli-600 dark:text-tea_green-200">Profile Picture</Label>
                                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed rounded-lg border-verdigris-200 dark:border-verdigris-400">
                                                    <Avatar className="flex-shrink-0 h-24 w-24 border-2 border-emerald-400">
                                                        <AvatarImage
                                                            src={avatarPreview || userEdit?.avatar.url?.toString()}
                                                            alt={userEdit?.name}
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback className="flex items-center justify-center bg-verdigris-300 text-white">
                                                            <User className="h-12 w-12" />
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 flex flex-col space-y-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="flex items-center bg-tea_green-100 hover:bg-tea_green-200 text-lapis_lazuli-600 border-verdigris-300 dark:bg-lapis_lazuli-300 dark:text-tea_green-100 dark:hover:bg-lapis_lazuli-200"
                                                                onClick={() => document.getElementById("avatar-upload")?.click()}
                                                            >
                                                                <Upload className="mr-2 h-4 w-4" />
                                                                Upload New Image
                                                            </Button>

                                                            {(avatarPreview || userEdit?.avatar.url !== DEFAULT_AVATAR.url) && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    className="flex items-center bg-red-100 hover:bg-red-200 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                                                                    onClick={removeAvatar}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <input
                                                            id="avatar-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleAvatarChange}
                                                        />

                                                        <p className="text-sm text-lapis_lazuli-400 dark:text-tea_green-100/70">
                                                            Recommended: Square image, at least 300x300px
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </TabsContent>

                                {/* Pestaña de habilidades */}
                                <TabsContent value={TAB_VALUES.SKILLS} className="h-full">
                                    <CardContent className="p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full"
                                        >
                                            <SkillsSelector initialSkills={skills} onSkillsChange={handleSkillsChange} />
                                        </motion.div>
                                    </CardContent>
                                </TabsContent>
                            </div>

                            {/* Footer del formulario */}
                            <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex items-center justify-center w-full sm:w-auto bg-tea_green-100 hover:bg-tea_green-200 text-lapis_lazuli-600 border-verdigris-300 dark:bg-lapis_lazuli-300 dark:text-tea_green-100 dark:hover:bg-lapis_lazuli-200"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
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
                            </CardFooter>
                        </Tabs>
                    </form>
                </div>
            </div>
        </div>
    );
}