import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { MatchedUser } from "../../types/matchTypes";
import matchService from "../../services/matchService";
import { useNotifications } from "../hooks/useNotifications";

interface MatchContextType {
    matches: MatchedUser[] | undefined;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    bestMatches: MatchedUser[] | undefined;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const useMatch = () => {
    const context = useContext(MatchContext);
    if (!context) throw new Error("useMatch must be used within a MatchProvider");
    return context;
};

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
    const [matches, setMatches] = useState<MatchedUser[] | undefined>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bestMatches, setBestMatches] = useState<MatchedUser[] | undefined>(undefined);
    const { refresh } = useNotifications()

    // Referencias para control de estado
    const lastServerUpdateRef = useRef<string | null>(null);
    const lastMatchCountRef = useRef<number>(0);
    const isInitialLoadRef = useRef(true);
    const isCalculatingRef = useRef(false); // Prevenir múltiples cálculos simultáneos

    const fetchMatches = useCallback(async (force: boolean = false) => {
        // Prevenir múltiples ejecuciones simultáneas
        if (isCalculatingRef.current && !force) {
            return;
        }

        try {
            setError(null);

            // 1. Verificar si necesitamos actualizar
            const updateInfo = await matchService.getLastUpdate();
            const serverLastUpdate = updateInfo.lastUpdated;
            const serverMatchCount = updateInfo.matchCount || 0;

            // Condiciones para actualizar
            const needsUpdate = force ||
                isInitialLoadRef.current ||
                !updateInfo.hasMatches ||
                !serverLastUpdate ||
                serverLastUpdate !== lastServerUpdateRef.current ||
                serverMatchCount !== lastMatchCountRef.current;

            if (needsUpdate) {

                isCalculatingRef.current = true;

                // 2. Calcular matches
                const calculateResult = await matchService.createMatches();

                // 3. Obtener matches actualizados
                const data = await matchService.getMatches();
                const matchesArray = Array.isArray(data) ? data : [];

                setMatches(matchesArray);
                setBestMatches(matchesArray.slice(0, 5));

                // 4. Actualizar referencias
                lastServerUpdateRef.current = calculateResult.lastUpdated || new Date().toISOString();
                lastMatchCountRef.current = matchesArray.length;
                isInitialLoadRef.current = false;

                // 5. Mostrar notificación si hay nuevos matches
                if (calculateResult.hasNewNotifications) {
                    refresh()
                }

            } else {

                // Solo obtener matches si no los tenemos
                if (!matches || matches.length === 0) {
                    const data = await matchService.getMatches();
                    const matchesArray = Array.isArray(data) ? data : [];
                    setMatches(matchesArray);
                    setBestMatches(matchesArray.slice(0, 5));
                }
            }

        } catch (err: any) {
            setError(err.response?.data?.error || "Error al cargar los matches");
        } finally {
            setLoading(false);
            isCalculatingRef.current = false;
        }
    }, []); // Sin dependencias para evitar loops

    // Función manual de refetch
    const manualRefetch = useCallback(() => {
        setLoading(true);
        fetchMatches(true); // Forzar actualización
    }, [fetchMatches]);

    useEffect(() => {
        // Carga inicial
        fetchMatches();

        // Polling cada 2 minutos (menos frecuente para evitar spam)
        const interval = setInterval(() => {
            if (!isCalculatingRef.current) {
                fetchMatches();
            }
        }, 120000); // 2 minutos

        return () => clearInterval(interval);
    }, [fetchMatches]);

    return (
        <MatchContext.Provider value={{
            matches,
            loading,
            error,
            refetch: manualRefetch,
            bestMatches
        }}>
            {children}
        </MatchContext.Provider>
    );
};