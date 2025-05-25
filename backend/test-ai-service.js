// test-ai-service.js
require('dotenv').config();
const { getSkillMatches } = require('./service/aiMatchtes');

// Datos de prueba
const mockUserRequesting = {
    id: "67ef57d15c81926e025f9e26",
    lookingFor: [
        { id: "js", category: "technology" },
        { id: "react", category: "technology" },
        { id: "docker", category: "technology" }
    ]
};

const mockOtherUsers = [
    {
        userId: "67e6291c35a267617ca3d514",
        skills: [
            { id: "js", category: "technology" },
            { id: "java", category: "technology" },
            { id: "csharp", category: "technology" },
            { id: "illustrator", category: "design" },
            { id: "indesign", category: "design" },
            { id: "ae", category: "design" },
            { id: "premiere", category: "design" },
            { id: "blender", category: "design" },
            { id: "3dmax", category: "design" },
            { id: "cinema4d", category: "design" },
            { id: "email", category: "business" },
            { id: "mentoring", category: "others" }
        ]
    },
    {
        userId: "67ef4918db1cab7b663e4513",
        skills: [
            { id: "swift", category: "technology" },
            { id: "kotlin", category: "technology" },
            { id: "rust", category: "technology" },
            { id: "react", category: "technology" },
            { id: "angular", category: "technology" },
            { id: "vue", category: "technology" },
            { id: "svelte", category: "technology" }
        ]
    },
    {
        userId: "680120283e6f0d4cb7ef56ba",
        skills: [
            { id: "leadership", category: "others" },
            { id: "teamwork", category: "others" },
            { id: "css", category: "technology" },
            { id: "js", category: "technology" },
            { id: "branding", category: "design" },
            { id: "figma", category: "design" }
        ]
    },
    {
        userId: "680120283e6f0d4cb7ef56ce",
        skills: [
            { id: "docker", category: "technology" },
            { id: "communication", category: "others" },
            { id: "teamwork", category: "others" },
            { id: "sql", category: "technology" },
            { id: "illustrator", category: "design" },
            { id: "mongo", category: "technology" },
            { id: "vue", category: "technology" },
            { id: "css", category: "technology" },
            { id: "photoshop", category: "design" },
            { id: "creativity", category: "others" },
            { id: "xd", category: "design" },
            { id: "branding", category: "design" },
            { id: "leadership", category: "others" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef56e9",
        skills: [
            { id: "xd", category: "design" },
            { id: "figma", category: "design" },
            { id: "photoshop", category: "design" },
            { id: "communication", category: "others" },
            { id: "react", category: "technology" },
            { id: "html", category: "technology" },
            { id: "docker", category: "technology" },
            { id: "mongo", category: "technology" },
            { id: "illustrator", category: "design" },
            { id: "creativity", category: "others" },
            { id: "sql", category: "technology" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef5734",
        skills: [
            { id: "figma", category: "design" },
            { id: "leadership", category: "others" },
            { id: "vue", category: "technology" },
            { id: "docker", category: "technology" },
            { id: "communication", category: "others" },
            { id: "css", category: "technology" },
            { id: "branding", category: "design" },
            { id: "coaching", category: "others" },
            { id: "js", category: "technology" },
            { id: "photoshop", category: "design" },
            { id: "teamwork", category: "others" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef5747",
        skills: [
            { id: "css", category: "technology" },
            { id: "sql", category: "technology" },
            { id: "communication", category: "others" },
            { id: "node", category: "technology" },
            { id: "xd", category: "design" },
            { id: "react", category: "technology" },
            { id: "express", category: "technology" },
            { id: "coaching", category: "others" },
            { id: "creativity", category: "others" },
            { id: "docker", category: "technology" },
            { id: "teamwork", category: "others" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef5761",
        skills: [
            { id: "illustrator", category: "design" },
            { id: "node", category: "technology" },
            { id: "teamwork", category: "others" },
            { id: "figma", category: "design" },
            { id: "express", category: "technology" },
            { id: "xd", category: "design" },
            { id: "branding", category: "design" },
            { id: "sql", category: "technology" },
            { id: "coaching", category: "others" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef577b",
        skills: [
            { id: "photoshop", category: "design" },
            { id: "teamwork", category: "others" },
            { id: "branding", category: "design" },
            { id: "docker", category: "technology" },
            { id: "js", category: "technology" },
            { id: "illustrator", category: "design" },
            { id: "leadership", category: "others" },
            { id: "xd", category: "design" },
            { id: "express", category: "technology" },
            { id: "vue", category: "technology" },
            { id: "figma", category: "design" },
            { id: "css", category: "technology" },
            { id: "mongo", category: "technology" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef5795",
        skills: [
            { id: "css", category: "technology" },
            { id: "node", category: "technology" },
            { id: "mongo", category: "technology" },
            { id: "leadership", category: "others" },
            { id: "express", category: "technology" },
            { id: "react", category: "technology" },
            { id: "docker", category: "technology" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef57a5",
        skills: [
            { id: "js", category: "technology" },
            { id: "illustrator", category: "design" },
            { id: "leadership", category: "others" },
            { id: "coaching", category: "others" },
            { id: "sql", category: "technology" },
            { id: "branding", category: "design" },
            { id: "mongo", category: "technology" },
            { id: "figma", category: "design" },
            { id: "docker", category: "technology" },
            { id: "express", category: "technology" },
            { id: "html", category: "technology" },
            { id: "vue", category: "technology" },
            { id: "node", category: "technology" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef57c0",
        skills: [
            { id: "figma", category: "design" },
            { id: "express", category: "technology" },
            { id: "branding", category: "design" },
            { id: "js", category: "technology" },
            { id: "xd", category: "design" },
            { id: "creativity", category: "others" },
            { id: "html", category: "technology" },
            { id: "mongo", category: "technology" },
            { id: "teamwork", category: "others" },
            { id: "node", category: "technology" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef57d2",
        skills: [
            { id: "creativity", category: "others" },
            { id: "vue", category: "technology" },
            { id: "react", category: "technology" },
            { id: "html", category: "technology" },
            { id: "photoshop", category: "design" },
            { id: "illustrator", category: "design" },
            { id: "communication", category: "others" },
            { id: "node", category: "technology" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef57e8",
        skills: [
            { id: "coaching", category: "others" },
            { id: "leadership", category: "others" },
            { id: "teamwork", category: "others" },
            { id: "figma", category: "design" },
            { id: "xd", category: "design" },
            { id: "vue", category: "technology" },
            { id: "creativity", category: "others" },
            { id: "branding", category: "design" },
            { id: "mongo", category: "technology" },
            { id: "illustrator", category: "design" },
            { id: "communication", category: "others" }
        ]
    },
    {
        userId: "680120293e6f0d4cb7ef5803",
        skills: [
            { id: "teamwork", category: "others" },
            { id: "css", category: "technology" },
            { id: "coaching", category: "others" },
            { id: "photoshop", category: "design" },
            { id: "creativity", category: "others" },
            { id: "communication", category: "others" },
            { id: "leadership", category: "others" },
            { id: "docker", category: "technology" },
            { id: "react", category: "technology" },
            { id: "xd", category: "design" },
            { id: "sql", category: "technology" },
            { id: "node", category: "technology" }
        ]
    }
];

(async () => {
    console.log('🧪 Iniciando prueba del servicio de IA...');
    console.log('📋 Usuario buscando:', mockUserRequesting.lookingFor);
    console.log('👥 Evaluando', mockOtherUsers.length, 'usuarios');

    try {
        const matches = await getSkillMatches(mockUserRequesting, mockOtherUsers);

        console.log('\n✅ Resultado de IA:');
        console.log('📊 Total de coincidencias encontradas:', matches.length);

        matches.forEach((match, index) => {
            console.log(`\n${index + 1}. Usuario: ${match.userId}`);
            console.log('   Habilidades coincidentes:', match.matchingSkills);
        });

        // Verificación manual esperada
        console.log('\n🔍 Verificación manual:');
        console.log('- Usuario 67e6291c35a267617ca3d514 debería tener: js');
        console.log('- Usuario 67ef4918db1cab7b663e4513 debería tener: react');
        console.log('- Usuario 680120283e6f0d4cb7ef56ba NO debería aparecer');

    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    }
})()



