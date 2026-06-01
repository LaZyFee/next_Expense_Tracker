import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function extractValidationMessages(data) {
    const messages = [];

    const addMessage = (value) => {
        if (typeof value !== 'string') return;
        const trimmed = value.trim();
        if (trimmed) messages.push(trimmed);
    };

    const collectFromItem = (item) => {
        if (!item) return;
        if (typeof item === 'string') {
            addMessage(item);
            return;
        }

        if (Array.isArray(item)) {
            item.forEach(collectFromItem);
            return;
        }

        addMessage(item.message || item.msg || item.error);

        if (Array.isArray(item.errors)) {
            item.errors.forEach(collectFromItem);
        }
    };

    collectFromItem(data?.details?.validation);
    collectFromItem(data?.errors);

    return [...new Set(messages)];
}

async function getServerToken() {
    try {
        const cookieStore = await cookies();
        return cookieStore.get('token')?.value || null;
    } catch (error) {
        console.error("Error getting server token:", error);
        return null;
    }
}

function objectToFormData(value) {
    const formData = new FormData();

    Object.entries(value || {}).forEach(([key, fieldValue]) => {
        if (fieldValue === undefined || fieldValue === null) return;
        if (Array.isArray(fieldValue)) {
            fieldValue.forEach((item) => {
                formData.append(key, item instanceof Blob ? item : String(item));
            });
            return;
        }
        if (fieldValue instanceof Blob) {
            formData.append(key, fieldValue);
            return;
        }
        if (typeof fieldValue === 'object') {
            formData.append(key, JSON.stringify(fieldValue));
            return;
        }
        formData.append(key, String(fieldValue));
    });

    return formData;
}

async function serverRequest(endpoint, options = {}) {
    const { method = 'GET', body = null, headers = {}, isFormData = false, token } = options;

    const authToken = token || await getServerToken();

    // For FormData, don't set Content-Type header (browser will set it with boundary)
    // For JSON, set Content-Type to application/json
    const requestHeaders = {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData && !headers['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    const config = {
        method,
        headers: requestHeaders,
        cache: 'no-store', // Ensure we always get fresh data
        ...(options.next ? { next: options.next } : {}),
    };

    if (body) {
        // Handle FormData differently
        if (isFormData && body instanceof FormData) {
            config.body = body;
        } else if (isFormData && typeof body === 'object') {
            config.body = objectToFormData(body);
        } else if (!isFormData && typeof body === 'object') {
            config.body = JSON.stringify(body);
        } else {
            config.body = body;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    let data = {};
    const contentType = response.headers.get('content-type');

    // Parse response safely
    if (contentType && contentType.includes('application/json')) {
        try {
            data = await response.json();
        } catch (err) {
            console.error('JSON parse error:', err);
            data = { message: 'Invalid JSON response' };
        }
    } else {
        try {
            const text = await response.text();
            data = { message: text };
        } catch {
            data = {};
        }
    }

    // Handle errors properly
    if (!response.ok) {
        let errorMessage = 'Request failed';
        const detailedValidationMessages = extractValidationMessages(data);

        if (detailedValidationMessages.length > 0) {
            const hasGenericValidationMessage =
                typeof data?.message === 'string' &&
                data.message.trim().toLowerCase() === 'validation error';

            if (!data?.message || hasGenericValidationMessage) {
                errorMessage = detailedValidationMessages.join(', ');
            }
        }

        // PRIORITY: backend message
        if (data?.message && typeof data.message === 'string' && errorMessage === 'Request failed') {
            errorMessage = data.message;
        }
        else if (data?.error && errorMessage === 'Request failed') {
            errorMessage =
                typeof data.error === 'string'
                    ? data.error
                    : JSON.stringify(data.error);
        }
        else if (Array.isArray(data?.errors) && errorMessage === 'Request failed') {
            errorMessage = data.errors
                .map((e) => e.message || e)
                .join(', ');
        }

        // Only fallback if NO backend message
        if (!data?.message) {
            if (response.status === 429) {
                errorMessage = 'Too many requests. Please try again later.';
            } else if (response.status === 401) {
                errorMessage = 'Unauthorized. Please log in again.';
            } else if (response.status === 403) {
                errorMessage = 'Forbidden request.';
            } else if (response.status === 404) {
                errorMessage = 'Resource not found.';
            } else if (response.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
        }

        // Clean HTML error (like "Cannot POST ...")
        if (typeof errorMessage === 'string' && errorMessage.includes('<!DOCTYPE')) {
            errorMessage = '" ". Please try again.';
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = data;
        error.validationMessages = detailedValidationMessages;
        error.validationDetails = data?.details?.validation ?? data?.errors ?? null;
        error.endpoint = endpoint;
        error.method = method;

        throw error;
    }

    return data;
}

const serverApiClient = {
    get: (endpoint, options = {}) =>
        serverRequest(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, body, options = {}) =>
        serverRequest(endpoint, { ...options, method: 'POST', body }),

    put: (endpoint, body, options = {}) =>
        serverRequest(endpoint, { ...options, method: 'PUT', body }),

    patch: (endpoint, body, options = {}) =>
        serverRequest(endpoint, { ...options, method: 'PATCH', body }),

    delete: (endpoint, options = {}) =>
        serverRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default serverApiClient;
