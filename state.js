// state.js - Quantum Alpha PRO v23 | Ultimate Edition - OPTIMIZADO (V-FAST)

// --- 1. ESTADO GLOBAL UNIFICADO (Sincronizado con Network, AI y UI) ---
window.marketEnergy = 1;          
window.lastDataTimestamp = Date.now();
window.lastSignalSide = "COMPRA"; 
window.currentSession = "ASIA";
window.sequence = [];             
window.lastNeuralPrediction = 0.5; 

// --- 2. SENSORES DE CONTEXTO Y ALERTAS ---
let volatilitySpike = false;      
let crashRecoveryMode = false;    
let lastCrashImpact = 0;          

// --- 3. NÚCLEO DE MEMORIA EXPANDIDO CON LIMITADOR DE PESO (NUEVO) ---
// Leemos el historial completo para mantenimiento, pero solo usamos lo reciente para la sesión
let rawLogs = JSON.parse(localStorage.getItem('quantum_detailed_logs')) || [];

// LA SOLUCIÓN: Cargamos solo los últimos 150 registros para que el arranque sea inmediato
let detailedLogs = rawLogs.slice(-150); 

// AUTO-LIMPIEZA: Si el historial en disco supera los 500, borramos lo muy antiguo para evitar lag futuro
if (rawLogs.length > 500) {
    localStorage.setItem('quantum_detailed_logs', JSON.stringify(rawLogs.slice(-300)));
    console.log("🧹 Mantenimiento: Se han depurado logs antiguos para optimizar velocidad.");
}

let hourlyStats = {}; 

// Almacén de patrones de alto rendimiento
let patternVault = JSON.parse(localStorage.getItem('quantum_pattern_vault')) || {
    exhaustionSuccess: { top: 0, bottom: 0, total: 0 },
    microTrendWins: 0,
    recordedSequences: {} 
};

// --- 4. CONFIGURACIÓN OPERATIVA Y CONTROL ---
let maxLossLimit = 1; 
let consecutiveLosses = 0; 
let lastTrendAtLoss = "NEUTRAL"; 
let mouseEnabled = false;
let flexMode = false;
let neuralMode = true; 
let trendFilterMode = true; 

// Aplicamos el mismo limitador al historial de trades visual
let rawTradeHistory = JSON.parse(localStorage.getItem('tradeHistory')) || [];
let tradeHistory = rawTradeHistory.slice(-50); 

let lastClickTime = 0;

// Valores por defecto operativos
let riskLevel = 3;        
let selectedTime = 30;    
let isSignalActive = false;
let signalCooldown = false;
let countdownInterval = null;
let perfectFlow = false;
let chartData = Array(40).fill(40);

// --- 5. NUEVAS VARIABLES DE ESTADO PROFESIONAL ---
let confluenceMode = true;       
let adaptiveVolatility = true;   
let momentumPressure = 0;        
let zScorePower = 0;             

const config = {
    racha: { 1: 3, 2: 4, 3: 5 },
    ruido: { 1: 65, 2: 55, 3: 45 }
};

// --- 6. FUNCIONES QUIRÚRGICAS DE LA IA ---

function recordPatternSuccess(dna, type, isWin, context) {
    if (!patternVault.recordedSequences[dna]) {
        patternVault.recordedSequences[dna] = { wins: 0, attempts: 0 };
    }
    
    patternVault.recordedSequences[dna].attempts++;
    if (isWin) {
        patternVault.recordedSequences[dna].wins++;
        if (context === "TOP_EXHAUSTION") patternVault.exhaustionSuccess.top++;
        if (context === "BOTTOM_EXHAUSTION") patternVault.exhaustionSuccess.bottom++;
        if (context?.includes("MICRO")) patternVault.microTrendWins++;
    }
    patternVault.exhaustionSuccess.total++;
    
    localStorage.setItem('quantum_pattern_vault', JSON.stringify(patternVault));
    console.log(`🧠 MEMORIA IA: Patrón ${dna} [${context}] grabado como ${isWin ? 'EXITOSO' : 'FALLIDO'}`);
}

const AICore = {
    patterns: JSON.parse(localStorage.getItem('ia_patterns')) || {},
    weights: { noiseStrictness: 0 },

    getConfidence(dna) {
        if (!this.patterns[dna]) return 0;
        const p = this.patterns[dna];
        return p.total > 0 ? (p.wins / p.total) : 0;
    },

    calibrate(win) {
        this.weights.noiseStrictness = win ? 
            Math.max(-10, this.weights.noiseStrictness - 2) : 
            Math.min(15, this.weights.noiseStrictness + 4);
            
        if(!win && window.sequence.length >= 4) {
            const dna = window.sequence.slice(-4).map(s => s.val).join('');
            if(this.patterns[dna]) {
                this.patterns[dna].total += 1; 
                this.save();
            }
        }
    },

    learn() {
        if (window.sequence.length < 4) return;
        const dna = window.sequence.slice(-4).map(s => s.val).join('');
        if (!this.patterns[dna]) {
            this.patterns[dna] = { wins: 0, total: 0 };
        }
        this.patterns[dna].wins += 1;
        this.patterns[dna].total += 1;
        this.save();
    },

    save() {
        localStorage.setItem('ia_patterns', JSON.stringify(this.patterns));
    }
};

const NeuralCore = {
    model: null,
    async init() {
        if (this.model) return;
        try {
            this.model = tf.sequential();
            this.model.add(tf.layers.dense({units: 12, inputShape: [4], activation: 'relu'}));
            this.model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
            this.model.compile({optimizer: tf.train.adam(0.01), loss: 'binaryCrossentropy'});
            console.log("Neural Core Initialized");
        } catch(e) { console.error("TF Init Error", e); }
    },
    async getPrediction(data) {
        if(!this.model) await this.init();
        try {
            const input = tf.tensor2d([data]);
            const pred = this.model.predict(input);
            const result = (await pred.data())[0];
            window.lastNeuralPrediction = result; 
            return result;
        } catch(e) { return 0.5; }
    },
    async train(data, win) {
        if(!this.model) await this.init();
        try {
            const input = tf.tensor2d([data]);
            const label = tf.tensor2d([[win ? 1 : 0]]);
            await this.model.fit(input, label, {epochs: 2});
        } catch(e) { console.error("Training Error", e); }
    }
};

// --- 7. PERSISTENCIA Y SINCRONIZACIÓN ---

function saveConfig() {
    localStorage.setItem('quantum_config', JSON.stringify({
        time: selectedTime, 
        risk: riskLevel, 
        flex: flexMode,
        neural: neuralMode,
        trend: trendFilterMode,
        confluence: confluenceMode,      
        adaptive: adaptiveVolatility     
    }));
}

function loadConfig() {
    const saved = JSON.parse(localStorage.getItem('quantum_config'));
    if(saved) {
        selectedTime = parseInt(saved.time) || 30;
        riskLevel = parseInt(saved.risk) || 3;
        flexMode = !!saved.flex; 
        neuralMode = saved.neural !== undefined ? saved.neural : true; 
        trendFilterMode = saved.trend !== undefined ? saved.trend : true;
        confluenceMode = saved.confluence !== undefined ? saved.confluence : true;
        adaptiveVolatility = saved.adaptive !== undefined ? saved.adaptive : true;
    }
    if (typeof refreshVisualButtons === 'function') refreshVisualButtons();
}

function getCurrentHour() {
    return new Date().getHours();
}

function refreshVisualButtons() {
    document.getElementById('trendBtn')?.classList.toggle('active', !!trendFilterMode);
    document.getElementById('flexBtn')?.classList.toggle('active', !!flexMode);
    document.getElementById('adaptiveBtn')?.classList.toggle('active', !!adaptiveVolatility);
    document.getElementById('confluenceBtn')?.classList.toggle('active', !!confluenceMode);
    document.getElementById('neuralBtn')?.classList.toggle('active', !!neuralMode);

    const riskBtn = document.getElementById('risk-cycle-btn');
    const opDetails = document.getElementById('op-details');
    
    const configLevels = {
        1: { label: "N1: CONSERVADOR", color: "#00ff88", detail: "FILTRO DE RIESGO MÁXIMO", boost: 5 },
        2: { label: "N2: MODERADO", color: "#4a90e2", detail: "EQUILIBRIO INSTITUCIONAL", boost: 10 },
        3: { label: "N3: SNIPER", color: "#ff9f43", detail: "ALTA PRECISIÓN V23", boost: 15 }
    };

    const current = configLevels[riskLevel] || configLevels[3];

    if (riskBtn) {
        riskBtn.innerText = `R: N${riskLevel}`;
        riskBtn.style.setProperty('border-color', current.color, 'important');
        riskBtn.style.setProperty('color', current.color, 'important');
    }

    if (opDetails) {
        if (flexMode) {
            opDetails.innerHTML = `
                <span style="color: ${current.color}; font-weight: 800;">${current.detail}</span> 
                <span style="color: #fff; opacity: 0.7;">+ FLEX</span> 
                <span style="color: #ff2e63; font-weight: bold; margin-left: 5px;">[+${current.boost}% RIESGO]</span>
            `;
            opDetails.style.animation = "pulse-risk 2s infinite";
        } else {
            opDetails.innerText = current.detail;
            opDetails.style.setProperty('color', current.color, 'important');
            opDetails.style.animation = "none";
        }
    }
}