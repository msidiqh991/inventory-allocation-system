"use client";

import { useCallback, useEffect, useState } from "react";

export function useSimpleFetch<T>(fn: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn();
            setData(result);
        } catch (error) {
            setError((error as Error).message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [fn]);

    useEffect(() => {
        let mounted = true;
        
        const initialFetch = async () => {
            try {
                const result = await fn();
                if (mounted) setData(result);
            } catch (error) {
                if (mounted) setError((error as Error).message || "Failed");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initialFetch();

        return () => {
            mounted = false;
        };
    }, [fn]);

    const refetch = useCallback(() => {
        return fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
}