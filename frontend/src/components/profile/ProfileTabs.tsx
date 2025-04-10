import { TabsList, TabsTrigger } from "../ui/tabs";
import { TAB_VALUES } from "../../types/profileTypes";
import { ProfileTabsProps } from '../../types/profileTypes'


export const ProfileTabs = ({ onTabChange, t }: ProfileTabsProps) => {
    return (
        <TabsList className=" w-full flex min-h-fit flex-wrap sm:flex-row bg-tea_green-500 dark:bg-lapis_lazuli-500  py-2">
            <TabsTrigger
                value={TAB_VALUES.PROFILE}
                className="flex-1  w-full data-[state=active]:bg-emerald-500 data-[state=active]:dark:bg-verdigris-600 data-[state=active]:text-black data-[state=active]:dark:text-white"
                onClick={() => onTabChange(TAB_VALUES.PROFILE)}
            >
                {t('edit-profile.pI')}
                <span className="sr-only">{t('edit-profile.pI')}</span>
            </TabsTrigger>
            <TabsTrigger
                value={TAB_VALUES.SKILLS}
                className="flex-1 w-full data-[state=active]:bg-emerald-500  data-[state=active]:dark:bg-verdigris-600  data-[state=active]:text-black data-[state=active]:dark:text-white"
                onClick={() => onTabChange(TAB_VALUES.SKILLS)}
            >
                {t('edit-profile.s&I')}
                <span className="sr-only">{t('edit-profile.s&I')}</span>
            </TabsTrigger>
        </TabsList>
    );
};