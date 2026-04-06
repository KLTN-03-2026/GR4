const axios = require('axios');
require('dotenv').config();

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SERVICE: AI PROVIDER - Kết nối với Cloud AI & Local Ollama
 * ═══════════════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────────────────────
// CONFIGURATION FROM ENV
// ──────────────────────────────────────────────────────────────
const CLOUD_CONFIG = {
    apiKey: process.env.OLLAMA_API_KEY,
    apiUrl: process.env.OLLAMA_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
    model: process.env.OLLAMA_MODEL || 'llama-3.1-8b-instant',
    timeout: parseInt(process.env.AI_TIMEOUT_CLOUD) || 30000,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 1024,
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7
};

const LOCAL_CONFIG = {
    url: process.env.LOCAL_OLLAMA_URL || 'http://localhost:11434/api/chat',
    model: process.env.LOCAL_MODEL || 'llama3',
    timeout: parseInt(process.env.AI_TIMEOUT_LOCAL) || 60000,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 1024,
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7
};

// Validate config at startup
if (!CLOUD_CONFIG.apiKey) {
    console.warn("⚠️  WARNING: OLLAMA_API_KEY not set. Cloud AI will be skipped.");
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MAIN FUNCTION: Get Chat Stream với Fallback
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.getChatStream = async (messages) => {

    // ──────────────────────────────────────────────────────────────
    // STEP 1: TRY CLOUD AI FIRST (Groq)
    // ──────────────────────────────────────────────────────────────
    if (CLOUD_CONFIG.apiKey && CLOUD_CONFIG.apiUrl) {
        try {
            console.log(`☁️  Attempting Cloud AI (${CLOUD_CONFIG.model})...`);

            const response = await axios({
                method: 'POST',
                url: CLOUD_CONFIG.apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CLOUD_CONFIG.apiKey}`
                },
                data: {
                    model: CLOUD_CONFIG.model,
                    messages: messages,
                    stream: true,
                    max_tokens: CLOUD_CONFIG.maxTokens,
                    temperature: CLOUD_CONFIG.temperature
                },
                responseType: 'stream',
                timeout: CLOUD_CONFIG.timeout
            });

            console.log("✅ Cloud AI Connected Successfully!");
            return { stream: response.data, isOllama: false };

        } catch (cloudError) {
            let errorMsg = cloudError.message || 'Unknown error';

            if (cloudError.response) {
                errorMsg = `Status ${cloudError.response.status}: ${cloudError.response.statusText}`;

                if (cloudError.response.data) {
                    try {
                        if (typeof cloudError.response.data === 'string') {
                            errorMsg += ` - ${cloudError.response.data}`;
                        } else if (cloudError.response.data.error) {
                            errorMsg += ` - ${cloudError.response.data.error.message || cloudError.response.data.error}`;
                        }
                    } catch (e) {
                        // Ignore
                    }
                }
            } else if (cloudError.code) {
                errorMsg = `${cloudError.code}: ${cloudError.message}`;
            }

            console.error(`⚠️  Cloud AI Failed: ${errorMsg}`);
            console.log("🔄 Falling back to Local Ollama...");
        }
    } else {
        console.log("⚠️  Cloud AI not configured. Using Local Ollama...");
    }

    // ──────────────────────────────────────────────────────────────
    // STEP 2: FALLBACK TO LOCAL OLLAMA
    // ──────────────────────────────────────────────────────────────
    try {
        console.log(`🏠 Connecting to Local Ollama (${LOCAL_CONFIG.model})...`);

        const response = await axios({
            method: 'POST',
            url: LOCAL_CONFIG.url,
            headers: { 'Content-Type': 'application/json' },
            data: {
                model: LOCAL_CONFIG.model,
                messages: messages,
                stream: true,
                options: {
                    temperature: LOCAL_CONFIG.temperature,
                    num_predict: LOCAL_CONFIG.maxTokens
                }
            },
            responseType: 'stream',
            timeout: LOCAL_CONFIG.timeout
        });

        console.log("✅ Local Ollama Connected Successfully!");
        return { stream: response.data, isOllama: true };

    } catch (localError) {
        let errorMsg = localError.message || 'Unknown error';

        if (localError.code === 'ECONNREFUSED') {
            errorMsg = 'Ollama không chạy. Hãy chạy "ollama serve" trước.';
        } else if (localError.code === 'ETIMEDOUT') {
            errorMsg = 'Timeout khi kết nối Ollama.';
        }

        console.error(`❌ Local Ollama Failed: ${errorMsg}`);

        throw new Error(
            "Cả Cloud AI và Local Ollama đều không khả dụng.\n" +
            "Vui lòng kiểm tra:\n" +
            "1. Groq API Key có đúng không? (https://console.groq.com/keys)\n" +
            "2. Ollama có đang chạy không? (ollama serve)\n" +
            "3. Model đã được pull chưa? (ollama pull llama3)"
        );
    }
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * HEALTH CHECK FUNCTION (ĐÃ FIX)
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.checkHealth = async () => {
    const status = {
        cloud: {
            available: false,
            error: null,
            model: CLOUD_CONFIG.model,
            provider: 'Groq',
            apiUrl: CLOUD_CONFIG.apiUrl
        },
        local: {
            available: false,
            error: null,
            model: LOCAL_CONFIG.model,
            provider: 'Ollama',
            url: LOCAL_CONFIG.url
        }
    };

    // ──────────────────────────────────────────────────────────────
    // Check Cloud (Groq) - FIX REQUEST FORMAT
    // ──────────────────────────────────────────────────────────────
    if (CLOUD_CONFIG.apiKey && CLOUD_CONFIG.apiUrl) {
        try {
            console.log(`🔍 Testing Groq API with model: ${CLOUD_CONFIG.model}`);

            const testResponse = await axios({
                method: 'POST',
                url: CLOUD_CONFIG.apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CLOUD_CONFIG.apiKey}`
                },
                data: {
                    model: CLOUD_CONFIG.model,
                    messages: [
                        {
                            role: 'user',
                            content: 'hi'
                        }
                    ],
                    max_tokens: 10,
                    temperature: 0.7,
                    stream: false  // ← Không dùng stream cho health check
                },
                timeout: 10000
            });

            status.cloud.available = true;
            console.log(`✅ Groq API OK - Model: ${CLOUD_CONFIG.model}`);

        } catch (err) {
            // Chi tiết hóa error
            if (err.response) {
                status.cloud.error = `${err.response.status}: ${err.response.statusText}`;

                // Log response data để debug
                if (err.response.data) {
                    console.error('❌ Groq API Error Response:', err.response.data);

                    // Nếu có error message từ Groq
                    if (err.response.data.error) {
                        status.cloud.error += ` - ${err.response.data.error.message || err.response.data.error}`;
                    }
                }
            } else if (err.code === 'ECONNREFUSED') {
                status.cloud.error = 'Cannot connect to Groq API';
            } else if (err.code === 'ETIMEDOUT') {
                status.cloud.error = 'Timeout connecting to Groq';
            } else {
                status.cloud.error = err.message;
            }

            console.error(`❌ Groq Health Check Failed: ${status.cloud.error}`);
        }
    } else {
        status.cloud.error = 'Not configured (missing API_KEY or API_URL)';
    }

    // ──────────────────────────────────────────────────────────────
    // Check Local (Ollama)
    // ──────────────────────────────────────────────────────────────
    try {
        await axios.get(LOCAL_CONFIG.url.replace('/api/chat', '/api/tags'), {
            timeout: 3000
        });
        status.local.available = true;
        console.log(`✅ Local Ollama OK - Model: ${LOCAL_CONFIG.model}`);
    } catch (err) {
        status.local.error = err.code === 'ECONNREFUSED'
            ? 'Ollama không chạy (run: ollama serve)'
            : err.message;
        console.error(`❌ Ollama Health Check Failed: ${status.local.error}`);
    }

    return status;
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * GET CONFIG INFO (for debugging)
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.getConfig = () => {
    return {
        cloud: {
            provider: 'Groq',
            model: CLOUD_CONFIG.model,
            configured: !!CLOUD_CONFIG.apiKey,
            timeout: CLOUD_CONFIG.timeout,
            maxTokens: CLOUD_CONFIG.maxTokens
        },
        local: {
            provider: 'Ollama',
            model: LOCAL_CONFIG.model,
            url: LOCAL_CONFIG.url,
            timeout: LOCAL_CONFIG.timeout,
            maxTokens: LOCAL_CONFIG.maxTokens
        }
    };
};