import { useState, useEffect } from 'react';
import { Skill, SelectedSkills, SkillCategory } from '../types/skillTypes';
import { SKILL_CATEGORIES, ALL_SKILLS, getSkillsByCategory, searchSkills } from '../data/skillsData';
import { useTranslation } from 'react-i18next';

interface SkillsSelectorProps {
    initialSkills?: SelectedSkills;
    onSkillsChange: (skills: SelectedSkills) => void;
    maxSkills?: number;
}

export const SkillsSelector = ({
    initialSkills = { mySkills: [], desiredSkills: [] },
    onSkillsChange,
    maxSkills = 15,
}: SkillsSelectorProps) => {
    const { t } = useTranslation();
    const [selectedSkills, setSelectedSkills] = useState<SelectedSkills>(initialSkills);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // Obtener habilidades no seleccionadas
    const unselectedSkills = ALL_SKILLS.filter(skill =>
        !selectedSkills.mySkills.some(s => s.id === skill.id) &&
        !selectedSkills.desiredSkills.some(s => s.id === skill.id)
    );

    // Aplicar filtros
    const categoryFilteredSkills = getSkillsByCategory(activeCategory, unselectedSkills);
    const filteredSkills = searchTerm
        ? searchSkills(categoryFilteredSkills, searchTerm, t)
        : categoryFilteredSkills;

    // Función para obtener el nombre traducido de una habilidad
    const getTranslatedSkillName = (skill: Skill) => {
        try {
            return t(`skills.${skill.category}.${skill.id}`);
        } catch (error) {
            console.error(`Translation not found for skill: ${skill.category}.${skill.id}`);
            return skill.id;
        }
    };

    // Función para obtener el nombre traducido de una categoría
    const getTranslatedCategoryName = (category: SkillCategory | 'all') => {
        return category === 'all'
            ? t('skills.ui.allCategories')
            : t(`skills.categories.${category}`);
    };

    // Manejar agregar habilidad
    const handleAddSkill = (skill: Skill, type: 'my' | 'desired') => {
        if (selectedSkills[`${type}Skills`].length >= maxSkills) return;

        const oppositeType = type === 'my' ? 'desired' : 'my';
        const newOppositeSkills = selectedSkills[`${oppositeType}Skills`]
            .filter(s => s.id !== skill.id);

        setSelectedSkills({
            ...selectedSkills,
            [`${type}Skills`]: [...selectedSkills[`${type}Skills`], skill],
            [`${oppositeType}Skills`]: newOppositeSkills
        });
    };

    // Manejar remover habilidad
    const handleRemoveSkill = (skillId: string, type: 'my' | 'desired') => {
        setSelectedSkills(prev => ({
            ...prev,
            [`${type}Skills`]: prev[`${type}Skills`].filter(s => s.id !== skillId)
        }));
    };

    // Limpiar todas las habilidades de un tipo
    const handleClearAll = (type: 'my' | 'desired') => {
        setSelectedSkills(prev => ({
            ...prev,
            [`${type}Skills`]: []
        }));
    };

    // Notificar cambios al componente padre
    useEffect(() => {
        onSkillsChange(selectedSkills);
    }, [selectedSkills]);

    return (
        <div className="space-y-6">
            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder={t('skills.ui.searchPlaceholder')}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="relative">
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="w-full px-4 py-2 border rounded-lg text-left flex justify-between items-center"
                    >
                        <span>{getTranslatedCategoryName(activeCategory)}</span>
                        <svg
                            className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isCategoryOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setIsCategoryOpen(false);
                                }}
                            >
                                {t('skills.ui.allCategories')}
                            </div>
                            {SKILL_CATEGORIES.map(category => (
                                <div
                                    key={category}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setIsCategoryOpen(false);
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
                <div className="p-4 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">{t('skills.ui.mySkills')}</h3>
                        <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-500">
                                {selectedSkills.mySkills.length}/{maxSkills} {t('skills.ui.skillsSelected')}
                            </span>
                            {selectedSkills.mySkills.length > 0 && (
                                <button
                                    onClick={() => handleClearAll('my')}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                >
                                    {t('skills.ui.clearAll')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-20">
                        {selectedSkills.mySkills.length > 0 ? (
                            selectedSkills.mySkills.map(skill => (
                                <div
                                    key={`my-${skill.id}`}
                                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    {getTranslatedSkillName(skill)}
                                    <button
                                        onClick={() => handleRemoveSkill(skill.id, 'my')}
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
                <div className="p-4 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">{t('skills.ui.desiredSkills')}</h3>
                        <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-500">
                                {selectedSkills.desiredSkills.length}/{maxSkills} {t('skills.ui.skillsSelected')}
                            </span>
                            {selectedSkills.desiredSkills.length > 0 && (
                                <button
                                    onClick={() => handleClearAll('desired')}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                >
                                    {t('skills.ui.clearAll')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-20">
                        {selectedSkills.desiredSkills.length > 0 ? (
                            selectedSkills.desiredSkills.map(skill => (
                                <div
                                    key={`desired-${skill.id}`}
                                    className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                                >
                                    {getTranslatedSkillName(skill)}
                                    <button
                                        onClick={() => handleRemoveSkill(skill.id, 'desired')}
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
                                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col"
                            >
                                <span className="text-sm font-medium mb-2">
                                    {getTranslatedSkillName(skill)}
                                </span>
                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => handleAddSkill(skill, 'my')}
                                        className={`text-xs px-3 py-1 rounded flex-1 ${selectedSkills.mySkills.length >= maxSkills
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                            }`}
                                        disabled={selectedSkills.mySkills.length >= maxSkills}
                                    >
                                        + {t('skills.ui.addToMySkills')}
                                    </button>
                                    <button
                                        onClick={() => handleAddSkill(skill, 'desired')}
                                        className={`text-xs px-3 py-1 rounded flex-1 ${selectedSkills.desiredSkills.length >= maxSkills
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                        disabled={selectedSkills.desiredSkills.length >= maxSkills}
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