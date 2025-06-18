import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import translationEN from "./locales/en/translation.json"
import translationES from "./locales/es/translation.json"

const resources = {
    en: {
        translation: translationEN,
    },
    es: {
        translation: translationES,
    },
}

const savedLanguage = localStorage.getItem("language")

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage || "en",
        fallbackLng: "en",
        load: "languageOnly",          // ← importante
        supportedLngs: ["en", "es"],   // ← limita sólo a estos
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },                 // ← activa mensajes en consola
    });


export default i18n

