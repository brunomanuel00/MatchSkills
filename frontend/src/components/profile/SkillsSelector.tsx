import { useState, useEffect, useCallback } from 'react';
import { Skill, SelectedSkills, SkillCategory } from '../../types/skillTypes';
import { SKILL_CATEGORIES, ALL_SKILLS, getSkillsByCategory, searchSkills } from '../../data/skillsData';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { SkillsSelectorProps } from '../../types/skillTypes'

export const SkillsSelector = ({
    currentSkills,
    onSkillsChange,
    maxSkills = 15,
}: SkillsSelectorProps) => {
    const { t } = useTranslation();
    const [localSkills, setLocalSkills] = useState<SelectedSkills>(currentSkills);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);


    // Sincronizar con las props actuales cuando cambien
    useEffect(() => {
        if (!isEqual(currentSkills, localSkills)) {
            setLocalSkills(currentSkills);
        }
    }, [currentSkills]);

    // Notificar cambios al padre cuando se modifiquen las habilidades locales
    useEffect(() => {
        if (!isEqual(localSkills, currentSkills)) {
            onSkillsChange(localSkills);
        }
    }, [localSkills]);

    // Obtener habilidades no seleccionadas
    const unselectedSkills = ALL_SKILLS.filter(skill =>
        !localSkills.mySkills.some(s => s.id === skill.id) &&
        !localSkills.desiredSkills.some(s => s.id === skill.id)
    );

    // Aplicar filtros
    const categoryFilteredSkills = getSkillsByCategory(activeCategory, unselectedSkills);
    const filteredSkills = searchTerm
        ? searchSkills(categoryFilteredSkills, searchTerm, t)
        : categoryFilteredSkills;

    // Traducción de nombre de habilidad
    const getTranslatedSkillName = useCallback((skill: Skill) => {
        try {
            return t(`skills.${skill.category}.${skill.id}`);
        } catch (error) {
            console.error(`Translation not found for skill: ${skill.category}.${skill.id}`);
            return skill.id;
        }
    }, [t]);

    // Traducción de categoría
    const getTranslatedCategoryName = useCallback((category: SkillCategory | 'all') => {
        return category === 'all'
            ? t('skills.ui.allCategories')
            : t(`skills.categories.${category}`);
    }, [t]);

    // Agregar habilidad
    const handleAddSkill = useCallback((skill: Skill, type: 'my' | 'desired') => {
        if (localSkills[`${type}Skills`].length >= maxSkills) return;

        const oppositeType = type === 'my' ? 'desired' : 'my';
        const newOppositeSkills = localSkills[`${oppositeType}Skills`].filter(s => s.id !== skill.id);

        const newSkills = {
            ...localSkills,
            [`${type}Skills`]: [...localSkills[`${type}Skills`], skill],
            [`${oppositeType}Skills`]: newOppositeSkills,
        };

        setLocalSkills(newSkills);
    }, [localSkills, maxSkills]);

    // Remover habilidad
    const handleRemoveSkill = useCallback((skillId: string, type: 'my' | 'desired') => {
        const newSkills = {
            ...localSkills,
            [`${type}Skills`]: localSkills[`${type}Skills`].filter(s => s.id !== skillId),
        };

        setLocalSkills(newSkills);
    }, [localSkills]);

    // Limpiar todas las habilidades de un tipo
    const handleClearAll = useCallback((type: 'my' | 'desired') => {
        const newSkills = {
            ...localSkills,
            [`${type}Skills`]: [],
        };

        setLocalSkills(newSkills);
    }, [localSkills]);

    return (
        <div className="space-y-6">
            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-2 px-0.5">
                <input
                    type="text"
                    placeholder={t('skills.ui.searchPlaceholder')}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder:text-white/80 dark:bg-lapis_lazuli-300/70  dark:border-verdigris-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="relative md:w-72">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsCategoryOpen(!isCategoryOpen);
                        }}
                        className="w-full px-4 py-2 border rounded-lg text-left flex justify-between items-center dark:bg-lapis_lazuli-300/70 dark:border-verdigris-400"
                    >
                        <span>{getTranslatedCategoryName(activeCategory)}</span>
                        <svg
                            className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''} `}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isCategoryOpen && (
                        <div
                            className="absolute z-10 w-full mt-1 bg-white dark:bg-lapis_lazuli-300 dark:border-verdigris-400 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            role="menu"
                            aria-orientation="vertical"
                        >
                            <div
                                role="menuitem"
                                tabIndex={0}
                                className="p-3 hover:bg-gray-100 dark:hover:bg-verdigris-600 cursor-pointer border-b dark:border-b-verdigris-400 focus:bg-gray-100 dark:focus:bg-verdigris-600 focus:outline-none focus:ring-2 focus:ring-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveCategory('all');
                                    setIsCategoryOpen(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveCategory('all');
                                        setIsCategoryOpen(false);
                                    }
                                }}
                            >
                                {t('skills.ui.allCategories')}
                            </div>
                            {SKILL_CATEGORIES.map((category) => (
                                <div
                                    key={category}
                                    role="menuitem"
                                    tabIndex={0}
                                    className="p-3 hover:bg-gray-100 dark:hover:bg-verdigris-600 cursor-pointer focus:m-0.5 border-b dark:border-b-verdigris-400"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveCategory(category);
                                        setIsCategoryOpen(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setActiveCategory(category);
                                            setIsCategoryOpen(false);
                                        }
                                    }}
                                >
                                    {getTranslatedCategoryName(category)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Secciones de habilidades seleccionadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mis habilidades */}
                <div className="p-4 border rounded-lg shadow-sm dark:border-verdigris-400">
                    <div className="flex justify-between items-center mb-3 ">
                        <h3 className="text-lg font-semibold">{t('skills.ui.mySkills')}</h3>
                        <div className="flex gap-2 items-center">
                            <span className=" hidden md:inline text-sm text-gray-500">
                                {localSkills.mySkills.length}/{maxSkills} {t('skills.ui.skillsSelected')}
                            </span>
                            <span className=" md:hidden text-sm text-gray-500">
                                {localSkills.mySkills.length}/{maxSkills}
                            </span>
                            {localSkills.mySkills.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClearAll('my');
                                    }}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                >
                                    {t('skills.ui.clearAll')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-20">
                        {localSkills.mySkills.length > 0 ? (
                            localSkills.mySkills.map(skill => (
                                <div
                                    key={`my-${skill.id}`}
                                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    {getTranslatedSkillName(skill)}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveSkill(skill.id, 'my');
                                        }}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                        aria-label={t('skills.ui.removeSkill')}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">{t('skills.ui.noSkillsAdded')}</p>
                        )}
                    </div>
                </div>

                {/* Habilidades deseadas */}
                <div className="p-4 border rounded-lg shadow-sm dark:border-verdigris-400">
                    <div className="flex justify-between items-center mb-3 ">
                        <h3 className="text-lg font-semibold">{t('skills.ui.desiredSkills')}</h3>
                        <div className="flex gap-2 items-center">
                            <span className="hidden md:inline text-sm text-gray-500">
                                {localSkills.desiredSkills.length}/{maxSkills} {t('skills.ui.skillsSelected')}
                            </span>
                            <span className="md:hidden text-sm text-gray-500">
                                {localSkills.desiredSkills.length}/{maxSkills}
                            </span>
                            {localSkills.desiredSkills.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClearAll('desired');
                                    }}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                >
                                    {t('skills.ui.clearAll')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-20 ">
                        {localSkills.desiredSkills.length > 0 ? (
                            localSkills.desiredSkills.map(skill => (
                                <div
                                    key={`desired-${skill.id}`}
                                    className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors "
                                >
                                    {getTranslatedSkillName(skill)}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveSkill(skill.id, 'desired');
                                        }}
                                        className="ml-2 text-green-500 hover:text-green-700"
                                        aria-label={t('skills.ui.removeSkill')}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">{t('skills.ui.noSkillsAdded')}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Habilidades disponibles */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">{t('skills.ui.availableSkills')}</h3>
                {filteredSkills.length === 0 ? (
                    <p className="text-gray-500">{t('skills.ui.noSkillsFound')}</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredSkills.map(skill => (
                            <div
                                key={skill.id}
                                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-verdigris-500 transition-colors flex flex-col dark:border-verdigris-400 "
                            >
                                <span className="text-sm font-medium mb-2">
                                    {getTranslatedSkillName(skill)}
                                </span>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAddSkill(skill, 'my');
                                        }}
                                        className={`text-xs px-3 py-1 rounded flex-1 ${localSkills.mySkills.length >= maxSkills
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                            }`}
                                        disabled={localSkills.mySkills.length >= maxSkills}
                                    >
                                        + {t('skills.ui.addToMySkills')}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAddSkill(skill, 'desired');
                                        }}
                                        className={`text-xs px-3 py-1 rounded flex-1 ${localSkills.desiredSkills.length >= maxSkills
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                        disabled={localSkills.desiredSkills.length >= maxSkills}
                                    >
                                        + {t('skills.ui.addToDesired')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};