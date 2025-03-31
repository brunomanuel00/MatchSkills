import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TAB_VALUES } from "../../types/profileTypes";

interface ProfileTabsProps {
    activeTab: string;
    onTabChange: (value: string) => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
    return (
        <TabsList className="flex bg-tea_green-100 dark:bg-lapis_lazuli-300 px-6 py-2">
            <TabsTrigger
                value={TAB_VALUES.PROFILE}
                className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                onClick={() => onTabChange(TAB_VALUES.PROFILE)}
            >
                Profile Information
            </TabsTrigger>
            <TabsTrigger
                value={TAB_VALUES.SKILLS}
                className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                onClick={() => onTabChange(TAB_VALUES.SKILLS)}
            >
                Skills & Interests
            </TabsTrigger>
        </TabsList>
    );
};