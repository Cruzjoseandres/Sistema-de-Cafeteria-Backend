import axios from 'axios';
import { getAccessToken, removeAccessToken } from '../utils/TokenUtilities';
import { API_URL } from './config';

const apiClient = axios.create({
    baseURL: API_URL
});

// Helper para generar una clave de idempotencia determinista y limpia (sin saltos de línea) para solicitudes concurrentes
const generateIdempotencyKey = (method, url, data) => {
    let serializedData = '';
    if (data instanceof FormData) {
        const entries = [];
        data.forEach((val, key) => {
            if (val instanceof File) {
                entries.push(`${key}:${val.name}:${val.size}`);
            } else {
                entries.push(`${key}:${val}`);
            }
        });
        serializedData = entries.join('&');
    } else if (data && typeof data === 'object') {
        serializedData = JSON.stringify(data);
    } else {
        serializedData = String(data || '');
    }
    const rawString = `${method.toUpperCase()}:${url}:${serializedData}`;
    
    // Generamos un hash alfanumérico determinista para que el header X-Idempotency-Key sea corto, seguro y sin saltos de línea (\n)
    let hash1 = 5381;
    let hash2 = 2166136261;
    for (let i = 0; i < rawString.length; i++) {
        const char = rawString.charCodeAt(i);
        hash1 = ((hash1 << 5) + hash1) ^ char;
        hash2 = (hash2 ^ char) * 16777619;
    }
    const cleanUrl = (url || '').replace(/[^a-zA-Z0-9/_-]/g, '_').slice(0, 30);
    const hashHex = `${Math.abs(hash1).toString(36)}_${Math.abs(hash2).toString(36)}`;
    return `${method.toUpperCase()}_${cleanUrl}_${hashHex}`;
};

// Request interceptor to attach the token and Idempotency header
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
            if (!config.headers['X-Idempotency-Key'] && !config.headers['x-idempotency-key']) {
                const autoKey = generateIdempotencyKey(config.method, config.url || '', config.data);
                config.headers['X-Idempotency-Key'] = autoKey;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to catch 401s globally and normalize error messages
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            console.error("Session expired or unauthorized. Logging out...");
            removeAccessToken();
            // Force a reload to route the user to /login
            window.location.href = '/login';
        }

        // Normalizar y enriquecer el mensaje de error para que SIEMPRE sea claro, descriptivo y en español
        if (error.response && error.response.data) {
            const data = error.response.data;
            if (Array.isArray(data.message)) {
                error.userMessage = `Por favor corrige lo siguiente:\n• ${data.message.join('\n• ')}`;
            } else if (typeof data.message === 'string' && data.message.trim() !== '') {
                error.userMessage = data.message;
            } else if (typeof data.error === 'string' && data.error.trim() !== '') {
                error.userMessage = data.error;
            } else {
                error.userMessage = `Error (${error.response.status}): No se pudo completar la operación en el servidor.`;
            }
        } else if (error.request || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            error.userMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet o que el backend esté en ejecución.';
        } else {
            error.userMessage = error.message || 'Ha ocurrido un error inesperado al procesar la solicitud.';
        }

        return Promise.reject(error);
    }
);

// Deduplicación en vuelo de peticiones concurrentes (e.g. doble clic rápido en botones de guardar)
const inFlightRequests = new Map();

const wrapWithInFlightDeduplication = (methodName, originalMethod) => {
    return async (url, dataOrConfig, maybeConfig) => {
        const isPostPutPatch = ['post', 'put', 'patch'].includes(methodName);
        const data = isPostPutPatch ? dataOrConfig : undefined;
        const fingerprint = generateIdempotencyKey(methodName, url, data);

        if (inFlightRequests.has(fingerprint)) {
            return inFlightRequests.get(fingerprint);
        }

        const promise = (async () => {
            try {
                return await originalMethod.call(apiClient, url, dataOrConfig, maybeConfig);
            } finally {
                inFlightRequests.delete(fingerprint);
            }
        })();

        inFlightRequests.set(fingerprint, promise);
        return promise;
    };
};

apiClient.post = wrapWithInFlightDeduplication('post', apiClient.post);
apiClient.put = wrapWithInFlightDeduplication('put', apiClient.put);
apiClient.patch = wrapWithInFlightDeduplication('patch', apiClient.patch);
apiClient.delete = wrapWithInFlightDeduplication('delete', apiClient.delete);

export default apiClient;

