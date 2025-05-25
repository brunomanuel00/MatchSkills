const { OpenAI } = require('openai')

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.AIMLAPI_KEY;

const api = new OpenAI({
    apiKey,
    baseURL
})

async function getSkillMatches(userRequesting, otherUsers) {

    //datos para la ia
    const lookingFor = userRequesting.lookingFor
    const usersData = otherUsers.map(user => ({
        userId: user.id,
        skills: user.skills.map(({ id, category }) => ({ id, category }))
    }))

    // Prompt del sistema
    const systemPrompt = `
       Eres un sistema especializado en encontrar coincidencias exactas entre habilidades de usuarios.
       Tu trabajo es analizar las habilidades que busca un usuario y determinar qué otros usuarios tienen esas habilidades específicas.
       SIEMPRE devuelves únicamente un objeto JSON válido sin texto adicional.`;

    // Prompt del usuario con instrucciones específicas
    const userPrompt = `
       TAREA: Encontrar coincidencias exactas entre habilidades.
       
       INSTRUCCIONES CRÍTICAS:
       1. Compara cada habilidad en "lookingFor" con las habilidades de cada usuario en "users"
       2. Una coincidencia existe SOLO cuando "id" y "category" son EXACTAMENTE iguales
       3. Para cada usuario que tenga al menos una coincidencia, inclúyelo en el resultado
       4. DEBES revisar TODOS los usuarios sin excepción
       5. NO omitas ninguna coincidencia posible
       
       DATOS:
       lookingFor: ${JSON.stringify(lookingFor)}
       users: ${JSON.stringify(usersData)}
       
       FORMATO DE RESPUESTA OBLIGATORIO (solo JSON, sin texto adicional):
       {
         "matches": [
           {
             "userId": "id-del-usuario",
             "matchingSkills": [
               {"id": "skill-id", "category": "skill-category"}
             ]
           }
         ]
       }
       
       Si no hay coincidencias, responde: {"matches": []}`;

    try {
        const completion = await api.chat.completions.create({
            model: "openai/o4-mini-2025-04-16",
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }

            ],
            temperature: 0, // Sin aleatoriedad para máxima precisión
            max_tokens: 4000, // Suficiente para respuestas grandes
            response_format: { type: "json_object" }, // Forzar respuesta JSON
        });

        const response = completion.choices[0].message.content

        try {

            const result = JSON.parse(response)
            if (!result.matches || !Array.isArray(result.matches)) {
                console.error('IA response is not in expected format:', result);
                return [];
            }

            return result.matches


        } catch (parseError) {
            console.error('Error al parsear respuesta JSON de IA:', parseError);
            console.error('Respuesta recibida:', response);
            return [];

        }

    } catch (error) {
        console.error('Error al comunicarse con la IA:', error);
        return [];
    }
}

module.exports = { getSkillMatches }