const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface fetchOptions extends RequestInit {
    token?: string;
}

const fetchAPI = async (endpoint: string, options: fetchOptions = {}) => {
    const { token, ...restOptions } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...restOptions.headers,
    };

    if (token) {
        headers["Authorization" as keyof HeadersInit] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...restOptions,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export default fetchAPI;