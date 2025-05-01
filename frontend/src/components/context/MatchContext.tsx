import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
    const [matches, setMatches] = useState<MatchedUser[] | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [bestMatches, setBestMatches] = useState<MatchedUser[] | undefined>(undefined)

    const fetchMatches = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const calculate = await matchService.createMatches();
            if (calculate.hasChanged || !hasFetched) {
                const data = await matchService.getMatches();
                setMatches(data);
                setHasFetched(true);
            }
            setBestMatches(matches?.slice(0, 5))
        } catch (err: any) {
            setError(err.response?.data?.error || "Error al cargar los matches");
        } finally {
            setLoading(false);
        }
    }, [hasFetched]);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    return (
        <MatchContext.Provider value={{ matches, loading, error, refetch: fetchMatches, bestMatches }}>
            {children}
        </MatchContext.Provider>
    );
};

export const useMatch = () => {
    const context = useContext(MatchContext);
    if (!context) throw new Error("useMatch be used within an MatchProvider");
    return context;
};
