import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function getSkillMatches(userRequesting, otherUsers) {

  const prompt = `
Eres un sistema que encuentra coincidencias de habilidades entre un usuario (Usuario A) y otros usuarios (Usuarios B).
Tu objetivo es analizar las habilidades que el Usuario A está buscando y devolver un resultado estructurado que indique exactamente qué usuarios tienen habilidades coincidentes.

**Instrucciones Claras y Obligatorias:**

1. El objeto "lookingFor" contiene las habilidades que busca el Usuario A. Cada habilidad es un objeto con "id" y "category".

2. El array "users" contiene múltiples objetos, cada uno representando a un Usuario B. Cada uno tiene:
   - "userId": un string con el ID del usuario
   - "skills": array de habilidades (objetos con "id" y "category")

3. Por cada Usuario B, compara sus "skills" con "lookingFor". Si alguna coincide exactamente (mismo "id" y "category"), inclúyelo en la respuesta.

4. **Formato de salida obligatorio**:
   - Un array de objetos
   - Cada objeto debe tener:
     - "userId": el ID del Usuario B
     - "matchingSkills": un array con las habilidades que coinciden
   - Si un usuario no tiene coincidencias, no lo incluyas en el resultado

5. **No incluyas texto adicional, explicaciones ni formato Markdown. Solo devuelve el array JSON.**

Ejemplo de salida correcta:
[
  {
    "userId": "abc123",
    "matchingSkills": [
      { "id": "ts", "category": "technology" },
      { "id": "react", "category": "technology" }
    ]
  },
  {
    "userId": "xyz456",
    "matchingSkills": [
      { "id": "meditation", "category": "others" }
    ]
  }
]

Ejemplo de salida si no hay coincidencias: []

Estas son las habilidades buscadas ("lookingFor"):
${JSON.stringify(userRequesting.lookingFor)}

Y estos son los usuarios con sus habilidades ("users"):
${JSON.stringify(
    otherUsers.map((u) => ({
      userId: u._id.toString(),
      skills: u.skills.map(({ id, category }) => ({ id, category }))
    }))
  )}
  )}

`;

  try {
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const responseText = await result.response.text();

    let cleanResponse = responseText.trim();

    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```(?:json)?/g, '').trim();
    }

    // Intentamos parsear la respuesta como JSON

    const matches = JSON.parse(cleanResponse);

    return matches;
  } catch (error) {
    console.error('Error en getSkillMatches:', error);
    return [];
  }
};