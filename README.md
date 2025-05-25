# Match de Habilidades

Un sistema que conecta personas con habilidades complementarias para proyectos y colaboraciones.

## Capturas de Pantalla
![Vista Principal](./screenshots/principal.png)
![Login](./screenshots/login.png)
![Registro](./screenshots/register.png)

## Tecnologías Utilizadas
- **Frontend:** React, Vite,TypeScript, Axios, React Router, Tailwind CSS, Shadcn/ui,i18next,Framer Motion, Lucide
- **Backend:** Express, MongoDB, Mongoose, JWT, Bcrypt , Cors, Dotenv, Morgan. Lodash, express-async-errors, Nodemon, Supertest

## 🔒 HTTPS local con certificados autofirmados

Este proyecto usa HTTPS local para que cookies `secure` funcionen (Safari lo requiere).

### 🧪 Crear certificados

Usa el script:
   ```bash
   ./generate-cert.sh




## Instalación
1. Clona el repositorio:
   ```sh
   git clone https://github.com/brunomanuel00/MatchSkills.git
   cd MatchSkills
   rm -rf .git

2. Instalar dependencias
   ```sh
   cd frontend && pnpm install
   cd ../backend && npm install

3. Configurar env

   backend/.env
   ```sh
   MONGODB_URI=mongodb+srv://TUCUENTAMONGODB@cluster0.54z7f.mongodb.net/NombreRegistro?retryWrites=true&w=majority&appName=Cluster0
   PORT=3001

   TEST_MONGODB_URI=mongodb+srv://TUCUENTAMONGODB@cluster0.54z7f.mongodb.net/TestNombreRegistro?retryWrites=true&w=majority

   SECRET = para el jwt;

4. Inicia el servidor
   ```sh
   cd backend && npm dev

5. Inicia el frontend
   ```sh
   cd ../frontend && pnpm dev

## Estructura del Proyecto
    ```sh
    ## Estructura del Proyecto
   ├── README.md
   ├── backend/
   │   ├── app.js
   │   ├── cert/
   │   │   ├── key.pem
   │   ├── client.js
   │   ├── controllers/
   │   │   ├── auth.js
   │   │   ├── cloudinary.js
   │   │   ├── groupMessages.js
   │   │   ├── groups.js
   │   │   ├── match.js
   │   │   ├── message.js
   │   │   ├── user.js
   │   ├── eslint.config.mjs
   │   ├── index.js
   │   ├── models/
   │   │   ├── Group.js
   │   │   ├── GroupMessage.js
   │   │   ├── Match.js
   │   │   ├── Message.js
   │   │   ├── Notification.js
   │   │   ├── User.js
   │   ├── package-lock.json
   │   ├── package.json
   │   ├── request/
   │   │   ├── Test_patch.rest
   │   │   ├── create_new_user.rest
   │   │   ├── login.rest
   │   │   ├── logout.rest
   │   ├── service/
   │   │   ├── geminiAI.js
   │   ├── temp_uploads/
   │   ├── test-bcrypt.js
   │   ├── utils/
   │   │   ├── cloudinary.js
   │   │   ├── config.js
   │   │   ├── logger.js
   │   │   ├── middleware.js
   ├── frontend/
   │   ├── components.json
   │   ├── eslint.config.js
   │   ├── index.html
   │   ├── package.json
   │   ├── pnpm-lock.yaml
   │   ├── postcss.config.js
   │   ├── public/
   │   ├── src/
   │   │   ├── assets/
   │   │   ├── components/
   │   │   │   ├── ui/
   │   │   ├── lib/
   │   │   ├── locales/
   │   │   │   ├── en/
   │   │   │   ├── es/
   │   │   ├── pages/
   │   │   │   ├── auth/
   │   │   ├── routes/
   │   │   ├── services/
   │   │   ├── styles/
   │   │   ├── types/
   │   ├── tailwind.config.js
   │   ├── tsconfig.app.json
   │   ├── tsconfig.json
   │   ├── tsconfig.node.json
    │   ├── vite.config.ts


## Funcionalidades
✅ Registro y autenticación con JWT  
✅ Búsqueda de habilidades  
✅ Sistema de match basado en compatibilidad  
✅ Chat en tiempo real (próximamente)

## Contribuir
¡Las contribuciones son bienvenidas!  
1. Haz un fork del proyecto  
2. Crea una rama: `git checkout -b mi-nueva-funcionalidad`  
3. Haz tus cambios y crea un PR  

## Licencia
Este proyecto está bajo la licencia MIT.