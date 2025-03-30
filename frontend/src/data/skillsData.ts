import { Skill, SkillCategory } from '../types/skillTypes';


export const SKILL_CATEGORIES: SkillCategory[] = [
    'technology',
    'design',
    'business',
    'languages',
    'arts',
    'crafts',
    'sciences',
    'others'
];

export const ALL_SKILLS: Skill[] = [
    // ========== technology ==========
    { id: 'js', category: 'technology' },
    { id: 'ts', category: 'technology' },
    { id: 'py', category: 'technology' },
    { id: 'java', category: 'technology' },
    { id: 'csharp', category: 'technology' },
    { id: 'php', category: 'technology' },
    { id: 'ruby', category: 'technology' },
    { id: 'go', category: 'technology' },
    { id: 'swift', category: 'technology' },
    { id: 'kotlin', category: 'technology' },
    { id: 'rust', category: 'technology' },
    { id: 'react', category: 'technology' },
    { id: 'angular', category: 'technology' },
    { id: 'vue', category: 'technology' },
    { id: 'svelte', category: 'technology' },
    { id: 'next', category: 'technology' },
    { id: 'nuxt', category: 'technology' },
    { id: 'node', category: 'technology' },
    { id: 'express', category: 'technology' },
    { id: 'nestjs', category: 'technology' },
    { id: 'django', category: 'technology' },
    { id: 'flask', category: 'technology' },
    { id: 'laravel', category: 'technology' },
    { id: 'spring', category: 'technology' },
    { id: 'sql', category: 'technology' },
    { id: 'mysql', category: 'technology' },
    { id: 'postgres', category: 'technology' },
    { id: 'mongo', category: 'technology' },
    { id: 'firebase', category: 'technology' },
    { id: 'aws', category: 'technology' },
    { id: 'azure', category: 'technology' },
    { id: 'gcp', category: 'technology' },
    { id: 'docker', category: 'technology' },
    { id: 'kubernetes', category: 'technology' },
    { id: 'terraform', category: 'technology' },
    { id: 'git', category: 'technology' },
    { id: 'linux', category: 'technology' },
    { id: 'ml', category: 'technology' },
    { id: 'dl', category: 'technology' },
    { id: 'ds', category: 'technology' },
    { id: 'ai', category: 'technology' },
    { id: 'cyber', category: 'technology' },
    { id: 'blockchain', category: 'technology' },
    { id: 'solidity', category: 'technology' },
    { id: 'arduino', category: 'technology' },
    { id: 'raspberry', category: 'technology' },
    { id: 'iot', category: 'technology' },

    // ========== design ==========
    { id: 'uiux', category: 'design' },
    { id: 'figma', category: 'design' },
    { id: 'xd', category: 'design' },
    { id: 'sketch', category: 'design' },
    { id: 'photoshop', category: 'design' },
    { id: 'illustrator', category: 'design' },
    { id: 'indesign', category: 'design' },
    { id: 'ae', category: 'design' },
    { id: 'premiere', category: 'design' },
    { id: 'blender', category: 'design' },
    { id: '3dmax', category: 'design' },
    { id: 'maya', category: 'design' },
    { id: 'cinema4d', category: 'design' },
    { id: 'zbrush', category: 'design' },
    { id: 'substance', category: 'design' },
    { id: 'motion', category: 'design' },
    { id: 'prototyping', category: 'design' },
    { id: 'wireframing', category: 'design' },
    { id: 'typography', category: 'design' },
    { id: 'branding', category: 'design' },

    // ========== business ==========
    { id: 'marketing', category: 'business' },
    { id: 'seo', category: 'business' },
    { id: 'sem', category: 'business' },
    { id: 'content', category: 'business' },
    { id: 'social', category: 'business' },
    { id: 'email', category: 'business' },
    { id: 'growth', category: 'business' },
    { id: 'analytics', category: 'business' },
    { id: 'pm', category: 'business' },
    { id: 'scrum', category: 'business' },
    { id: 'agile', category: 'business' },
    { id: 'kanban', category: 'business' },
    { id: 'strategy', category: 'business' },
    { id: 'finance', category: 'business' },
    { id: 'sales', category: 'business' },
    { id: 'negotiation', category: 'business' },
    { id: 'startup', category: 'business' },
    { id: 'ecommerce', category: 'business' },
    { id: 'dropshipping', category: 'business' },
    { id: 'copywriting', category: 'business' },

    // ========== languages ==========
    { id: 'en', category: 'languages' },
    { id: 'es', category: 'languages' },
    { id: 'fr', category: 'languages' },
    { id: 'de', category: 'languages' },
    { id: 'pt', category: 'languages' },
    { id: 'it', category: 'languages' },
    { id: 'zh', category: 'languages' },
    { id: 'ja', category: 'languages' },
    { id: 'ru', category: 'languages' },
    { id: 'ar', category: 'languages' },
    { id: 'ko', category: 'languages' },
    { id: 'hi', category: 'languages' },

    // ========== arts ==========
    { id: 'photo', category: 'arts' },
    { id: 'writing', category: 'arts' },
    { id: 'video', category: 'arts' },
    { id: 'music', category: 'arts' },
    { id: 'production', category: 'arts' },
    { id: 'drawing', category: 'arts' },
    { id: 'painting', category: 'arts' },
    { id: 'sculpture', category: 'arts' },
    { id: 'acting', category: 'arts' },
    { id: 'dance', category: 'arts' },
    { id: 'theater', category: 'arts' },
    { id: 'poetry', category: 'arts' },

    // ========== crafts ==========
    { id: 'carpentry', category: 'crafts' },
    { id: 'electricity', category: 'crafts' },
    { id: 'plumbing', category: 'crafts' },
    { id: 'welding', category: 'crafts' },
    { id: 'masonry', category: 'crafts' },
    { id: 'mechanic', category: 'crafts' },
    { id: 'gardening', category: 'crafts' },
    { id: 'tailoring', category: 'crafts' },
    { id: 'cooking', category: 'crafts' },
    { id: 'baking', category: 'crafts' },

    // ========== sciences ==========
    { id: 'math', category: 'sciences' },
    { id: 'physics', category: 'sciences' },
    { id: 'chemistry', category: 'sciences' },
    { id: 'biology', category: 'sciences' },
    { id: 'medicine', category: 'sciences' },
    { id: 'psychology', category: 'sciences' },
    { id: 'neuroscience', category: 'sciences' },
    { id: 'research', category: 'sciences' },
    { id: 'bioinformatics', category: 'sciences' },
    { id: 'astronomy', category: 'sciences' },

    // ========== others ==========
    { id: 'teaching', category: 'others' },
    { id: 'coaching', category: 'others' },
    { id: 'mentoring', category: 'others' },
    { id: 'translation', category: 'others' },
    { id: 'events', category: 'others' },
    { id: 'sports', category: 'others' },
    { id: 'yoga', category: 'others' },
    { id: 'meditation', category: 'others' },
    { id: 'firstaid', category: 'others' },
    { id: 'parenting', category: 'others' }
];

/**
 * Obtiene habilidades filtradas por categoría
 * @param category Categoría a filtrar o 'all' para todas
 * @returns Array de habilidades filtradas
 */
export const getSkillsByCategory = (category: SkillCategory | 'all', skills: Skill[]) => {
    if (category === 'all') return skills;
    return skills.filter(skill => skill.category === category);
};

/**
 * Busca habilidades que coincidan con el término de búsqueda
 * @param skills Array de habilidades a buscar
 * @param query Término de búsqueda
 * @param t Función de traducción (useTranslation)
 * @returns Array de habilidades filtradas
 */
export const searchSkills = (skills: Skill[], query: string, t: (key: string) => string) => {
    if (!query.trim()) return skills;

    const searchTerm = query.toLowerCase().trim();

    return skills.filter(skill => {

        // Buscar en el ID de la habilidad
        const skillIdMatch = skill.id.toLowerCase().includes(searchTerm);

        // Obtener el nombre traducido usando la estructura correcta
        const translatedName = t(`skills.${skill.category}.${skill.id}`).toLowerCase();
        const translatedNameMatch = translatedName.includes(searchTerm);

        // También buscar en el nombre de la categoría por si acaso
        const categoryName = t(`skills.categories.${skill.category}`).toLowerCase();
        const categoryMatch = categoryName.includes(searchTerm);

        return skillIdMatch || translatedNameMatch || categoryMatch;
    });
};