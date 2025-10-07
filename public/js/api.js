// API Client for disCard Backend
class APIClient {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.token = localStorage.getItem('authToken');
        this.requestCache = new Map();
        this.requestTimestamps = [];
        this.rateLimitWindow = 15 * 60 * 1000; // 15 minutes
        this.maxRequestsPerWindow = 80; // Leave buffer under server limit of 100
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // Get authentication headers
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Check if we're approaching rate limit
    checkRateLimit() {
        const now = Date.now();
        // Clean old timestamps outside the window
        this.requestTimestamps = this.requestTimestamps.filter(timestamp => 
            now - timestamp < this.rateLimitWindow
        );
        
        return this.requestTimestamps.length < this.maxRequestsPerWindow;
    }

    // Record a request timestamp
    recordRequest() {
        this.requestTimestamps.push(Date.now());
    }

    // Get cache key for request
    getCacheKey(endpoint, options = {}) {
        return `${options.method || 'GET'}_${endpoint}_${JSON.stringify(options.body || {})}`;
    }

    // Check cache for recent response
    getFromCache(cacheKey, maxAge = 30000) { // 30 seconds default
        const cached = this.requestCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < maxAge) {
            return cached.data;
        }
        return null;
    }

    // Store response in cache
    setCache(cacheKey, data) {
        this.requestCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        // Clean old cache entries (keep only last 50)
        if (this.requestCache.size > 50) {
            const entries = Array.from(this.requestCache.entries());
            entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
            this.requestCache.clear();
            entries.slice(0, 50).forEach(([key, value]) => {
                this.requestCache.set(key, value);
            });
        }
    }

    // Generic request handler
    async request(endpoint, options = {}) {
        // Check rate limiting
        if (!this.checkRateLimit()) {
            throw new Error('Rate limit approached - please wait a moment');
        }

        // Check cache for GET requests
        const cacheKey = this.getCacheKey(endpoint, options);
        if (!options.method || options.method === 'GET') {
            const cached = this.getFromCache(cacheKey, 30000); // 30 second cache for GET
            if (cached) {
                return cached;
            }
        }

        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            this.recordRequest(); // Record timestamp
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                
                // Handle 401 errors (token expired/invalid)
                if (response.status === 401) {
                    this.setToken(null);
                    localStorage.removeItem('authToken');
                    
                    // Instead of force reload, trigger auth screen through app
                    if (window.app && typeof window.app.showAuthScreen === 'function') {
                        window.app.showAuthScreen();
                    }
                    
                    throw new Error('Unauthorized - token expired');
                }
                
                // Handle 429 errors (Too Many Requests)
                if (response.status === 429) {
                    throw new Error('Too many requests - please wait a moment');
                }
                
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            
            // Check for refreshed token in response headers
            const newToken = response.headers.get('X-New-Token');
            if (newToken) {
                this.setToken(newToken);
            }
            
            // Cache GET responses
            if (!options.method || options.method === 'GET') {
                this.setCache(cacheKey, data);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async verifyTwoFactor(data) {
        const response = await this.request('/auth/verify-code', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async resendCode(data) {
        return this.request('/auth/resend-code', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async logout() {
        this.setToken(null);
    }

    async getProfile() {
        return this.request('/auth/me');
    }

    async updateProfile(userData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async changePassword(passwordData) {
        return this.request('/auth/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    // Cards methods
    async getCards() {
        const response = await this.getProfile();
        return response.user.cards || [];
    }

    async createCard(cardData) {
        return this.request('/cards', {
            method: 'POST',
            body: JSON.stringify(cardData)
        });
    }

    async updateCard(cardId, cardData) {
        return this.request(`/cards/${cardId}`, {
            method: 'PUT',
            body: JSON.stringify(cardData)
        });
    }

    async deleteCard(cardId) {
        return this.request(`/cards/${cardId}`, {
            method: 'DELETE'
        });
    }

    // Utility methods
    isAuthenticated() {
        return !!this.token;
    }

    // Check if online
    isOnline() {
        return navigator.onLine;
    }

    // Sync method for offline/online data
    async syncData() {
        if (!this.isOnline() || !this.isAuthenticated()) {
            return false;
        }

        try {
            // Get server data
            const serverCards = await this.getCards();
            
            // Simple sync strategy: server data wins for now
            // In a more complex app, you'd compare timestamps and merge changes
            localStorage.setItem('cards', JSON.stringify(serverCards));
            
            return true;
        } catch (error) {
            console.error('Sync failed:', error);
            return false;
        }
    }
}

// Create global API instance
window.api = new APIClient();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}