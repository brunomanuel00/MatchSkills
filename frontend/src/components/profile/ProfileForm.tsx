import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { ProfileFormProps } from '../../types/profileTypes'
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const ProfileForm = ({
    userEdit,
    setUserEdit,
    t,
    passwords,
    onPasswordChange,
    passwordError
}: ProfileFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="name">
                        {t('register.name')}
                    </Label>
                    <Input
                        id="name"
                        value={userEdit?.name}
                        onChange={(e) => setUserEdit({ ...userEdit!, name: e.target.value })}
                        required
                        className="bg-white/70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="email" >
                        {t('register.email')}
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={userEdit?.email}
                        required
                        onChange={(e) => setUserEdit({ ...userEdit!, email: e.target.value })}
                        className="bg-white/70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="new-password">{t("register.password")}</Label>
                    <div className="relative">
                        <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={passwords.newPassword}
                            minLength={8}
                            onChange={(e) => onPasswordChange('newPassword', e.target.value)}
                            required
                            className=" bg-white /70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="confirm-password">{t("register.confirmPassword")}</Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={passwords.confirmPassword}
                                minLength={8}
                                onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
                                required
                                className={`"bg-white/70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400 ${passwordError ? "border-destructive" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    {passwordError && (
                        <p className="text-sm text-red-500">{passwordError}</p>
                    )}
                </div>
            </div>
        </div>
    )
};