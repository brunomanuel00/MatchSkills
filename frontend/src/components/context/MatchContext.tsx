import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { MatchedUser } from "../../types/matchTypes";
import matchService from "../../services/matchService";

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

    // Referencias para control de estado
    const lastServerUpdateRef = useRef<string | null>(null);
    const lastMatchCountRef = useRef<number>(0);
    const isInitialLoadRef = useRef(true);
    const isCalculatingRef = useRef(false); // Prevenir múltiples cálculos simultáneos

    const fetchMatches = useCallback(async (force: boolean = false) => {
        // Prevenir múltiples ejecuciones simultáneas
        if (isCalculatingRef.current && !force) {
            console.log('🔄 Ya hay un cálculo en progreso, saltando...');
            return;
        }

        try {
            setError(null);

            // 1. Verificar si necesitamos actualizar
            const updateInfo = await matchService.getLastUpdate();
            const serverLastUpdate = updateInfo.lastUpdated;
            const serverMatchCount = updateInfo.matchCount || 0;

            console.log('📊 Estado actual:', {
                serverLastUpdate,
                serverMatchCount,
                lastServerUpdate: lastServerUpdateRef.current,
                lastMatchCount: lastMatchCountRef.current,
                isInitialLoad: isInitialLoadRef.current
            });

            // Condiciones para actualizar
            const needsUpdate = force ||
                isInitialLoadRef.current ||
                !updateInfo.hasMatches ||
                !serverLastUpdate ||
                serverLastUpdate !== lastServerUpdateRef.current ||
                serverMatchCount !== lastMatchCountRef.current;

            if (needsUpdate) {
                console.log('📡 Actualizando matches - Razón:', {
                    force,
                    isInitialLoad: isInitialLoadRef.current,
                    noMatches: !updateInfo.hasMatches,
                    noServerUpdate: !serverLastUpdate,
                    differentUpdate: serverLastUpdate !== lastServerUpdateRef.current,
                    differentCount: serverMatchCount !== lastMatchCountRef.current
                });

                isCalculatingRef.current = true;

                // 2. Calcular matches
                const calculateResult = await matchService.createMatches();
                console.log('🎯 Resultado del cálculo:', calculateResult);

                // 3. Obtener matches actualizados
                const data = await matchService.getMatches();
                const matchesArray = Array.isArray(data) ? data : [];

                setMatches(matchesArray);
                setBestMatches(matchesArray.slice(0, 5));

                // 4. Actualizar referencias
                lastServerUpdateRef.current = calculateResult.lastUpdated || new Date().toISOString();
                lastMatchCountRef.current = matchesArray.length;
                isInitialLoadRef.current = false;

                console.log(`✅ Matches cargados: ${matchesArray.length} (${calculateResult.newMatchesCount || 0} nuevos)`);

                // 5. Mostrar notificación si hay nuevos matches
                if (calculateResult.hasNewNotifications) {
                    console.log(`🔔 ${calculateResult.newMatchesCount} nuevos matches encontrados`);
                    // Aquí puedes agregar lógica adicional para mostrar notificaciones en UI
                }

            } else {
                console.log('✅ Datos actualizados - usando cache');

                // Solo obtener matches si no los tenemos
                if (!matches || matches.length === 0) {
                    const data = await matchService.getMatches();
                    const matchesArray = Array.isArray(data) ? data : [];
                    setMatches(matchesArray);
                    setBestMatches(matchesArray.slice(0, 5));
                }
            }

        } catch (err: any) {
            console.error('Error in fetchMatches:', err);
            setError(err.response?.data?.error || "Error al cargar los matches");
        } finally {
            setLoading(false);
            isCalculatingRef.current = false;
        }
    }, []); // Sin dependencias para evitar loops

    // Función manual de refetch
    const manualRefetch = useCallback(() => {
        console.log('🔄 Refetch manual iniciado');
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