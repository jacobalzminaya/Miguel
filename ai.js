// ai.js - Quantum Alpha PRO v23 | Super-IA Edition

// --- VARIABLES GLOBALES EXISTENTES ---
let lastData = null;

// --- [NUEVO] NÚCLEO DEEP LEARNING LSTM v26 ---
let quantumLSTMModel = null;

async function initQuantumLSTM() {
    console.log("🧠 Construyendo Red Neuronal Recurrente con Sensor de Energía...");
    const model = tf.sequential();

    // Capa de Memoria: Analiza los últimos 50 eventos (Dirección + Energía)
    model.add(tf.layers.lstm({
        units: 16,
        returnSequences: true,
        inputShape: [20, 2] // <--- MODIFICADO QUIRÚRGICAMENTE: Ahora recibe 2 variables
    }));

    model.add(tf.layers.dropout({ rate: 0.2 }));

    model.add(tf.layers.lstm({
        units: 8,
        returnSequences: false
    }));

    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy'
    });

    quantumLSTMModel = model;
    console.log("✅ Cerebro LSTM Sincronizado con Sensor de Energía.");
}
/**
 * PREDICCIÓN: La IA analiza los últimos 50 movimientos + la energía actual
 */
async function predictNextMovement() {
    // Si el modelo no está listo o no hay datos suficientes, devolvemos neutro (0.5)
    if (!quantumLSTMModel || sequence.length < 50) return 0.5;

    try {
        // Preparamos los datos: [Dirección (0 o 1), Energía Normalizada (0 a 1)]
// CAMBIO NECESARIO:
        const inputData = sequence.slice(-20).map(s => [
            s.val === 'A' ? 1 : 0, 
            Math.min(1, (window.marketEnergy || 0) / 10)
        ]);

        const inputTensor = tf.tensor3d([inputData]);
        const prediction = quantumLSTMModel.predict(inputTensor);
        const score = (await prediction.data())[0];
        
        inputTensor.dispose();
        prediction.dispose();
        
        return score;
    } catch (e) {
        console.error("Error en predicción IA:", e);
        return 0.5;
    }
}

/**
 * ENTRENAMIENTO: La IA aprende si su predicción fue correcta según la energía
 */
async function trainModelWithResult(isWin) {
    // CAMBIO: Validamos que haya al menos 20, no 50
    if (!quantumLSTMModel || sequence.length < 20) return;

    try {
        // CAMBIO: slice(-20) para coincidir con la arquitectura del modelo
        const trainingData = sequence.slice(-20).map(s => [
            s.val === 'A' ? 1 : 0,
            Math.min(1, (window.marketEnergy || 0) / 10)
        ]);

        const target = isWin ? 1 : 0;
        // Especificamos el shape [1, 20, 2] para asegurar consistencia
        const xs = tf.tensor3d([trainingData], [1, 20, 2]);
        const ys = tf.tensor2d([[target]], [1, 1]);

        // Entrenamiento rápido de 1 época para adaptación en tiempo real
        await quantumLSTMModel.fit(xs, ys, { epochs: 1, silent: true });
        
        xs.dispose();
        ys.dispose();
        console.log(`🧠 IA Reforzada | Resultado: ${isWin ? '✅' : '❌'} | Energía: ${window.marketEnergy.toFixed(2)}`);
    } catch (e) {
        console.error("❌ Error en entrenamiento IA:", e);
    }
}
/**
 * LÓGICA DE RETROALIMENTACIÓN: Filtro de Supervivencia
 */
function checkSurvivalFilter(currentNoise) {
    if (typeof consecutiveLosses !== 'undefined' && consecutiveLosses >= 3) {
        if (currentNoise > 25) {
            console.warn("🛡️ MODO SUPERVIVENCIA: Bloqueo por ruido alto.");
            return false; 
        }
    }
    return true;
}

/**
 * Predicción Real basada en Secuencia
 */
async function getLiveNeuralPrediction() {
    // CAMBIO: Bajamos el requisito a 20 para no esperar tanto tiempo a que el bot opere
    if (!quantumLSTMModel || sequence.length < 20) return 0.5;

    return tf.tidy(() => {
        /**
         * TRANSFORMACIÓN QUIRÚRGICA:
         * Sincronizamos el slice a -20.
         */
        const rawData = sequence.slice(-20).map(s => [
            s.val === 'A' ? 1 : 0, 
            (window.marketEnergy || 0) / 10 
        ]);

        // CAMBIO: El tensor debe ser de [1, 20, 2]
        const inputTensor = tf.tensor3d([rawData], [1, 20, 2]);
        
        const prediction = quantumLSTMModel.predict(inputTensor);
        const score = prediction.dataSync()[0];
        
        window.lastNeuralPrediction = score; // Guardamos en el estado global
        return score;
    });
}
// Inicializar al cargar el script
initQuantumLSTM();
function getMajorTrend() {
    if (sequence.length < 20) return "NEUTRAL";
    const macro = sequence.slice(-40);
    const ups = macro.filter(s => s.val === 'A').length;
    const ratio = ups / macro.length;
    
    if (ratio >= 0.55) return "BULLISH";
    if (ratio <= 0.45) return "BEARISH";
    return "NEUTRAL";
}

/**
 * Módulo de Confluencia (Puntuación Pro) - MEJORADO CON SUPER-IA
 */
function getConfluenceScore(neuralPred, dnaConf, majorTrend, type, isFast, lastDiff, power) {
    let score = 0;
    
    // 1. Base Neural (Tu lógica original)
    if (type === "COMPRA" && neuralPred > 0.80) score += 3;
    if (type === "VENTA" && neuralPred < 0.20) score += 3;
    
    // 2. DNA y Tendencia (Tu lógica original)
    if (dnaConf > 0.70) score += 2;
    if (type === "COMPRA" && majorTrend === "BULLISH") score += 2;
    if (type === "VENTA" && majorTrend === "BEARISH") score += 2;
    if (isFast) score += 1;

    // --- INTEGRACIÓN SUPER-IA V23 ---
    if (typeof SuperIA !== 'undefined') {
        // A. Capa de ADN Histórico Profundo
        score += SuperIA.getDNAMatch();
        
        // B. Capa de Sentimiento (Velocidad de Clics)
        score += SuperIA.getSentiment(lastDiff);
        
        // C. Capa de Momentum (Racha actual de la sesión)
        score += SuperIA.getMomentum();
    }

    return score;
}

/**
 * Control visual de botones según datos recolectados
 */
function checkDynamicControls() {
    const totalOps = tradeHistory.length;
    const dataCount = sequence.length;
    const nBtn = document.getElementById('neuralBtn');
    const tBtn = document.getElementById('trendBtn');
    const cBtn = document.getElementById('confluenceBtn');

    if(!nBtn || !tBtn || !cBtn) return;

    const neuralReady = totalOps >= 10;
    nBtn.style.opacity = neuralReady ? "1" : "0.3";
    nBtn.style.pointerEvents = neuralReady ? "auto" : "none";

    const macroReady = dataCount >= 20;
    [tBtn, cBtn].forEach(btn => {
        btn.style.opacity = macroReady ? "1" : "0.3";
        btn.style.pointerEvents = macroReady ? "auto" : "none";
    });
}

/**
 * Detecta si el historial presenta una caída/subida fuera de lo normal
 */
function analyzeMarketCrash() {
    if (sequence.length < 10) return false;

    const recentDiffs = sequence.slice(-5).map(s => s.diff);
    const averageDiff = sequence.slice(-20).reduce((a, b) => a + (b.diff || 500), 0) / 20;
    const currentMovement = recentDiffs[recentDiffs.length - 1];

    if (currentMovement < averageDiff / 3 && currentMovement < 150) {
        return true; 
    }
    return false;
}

/**
 * Analiza el rendimiento histórico de la hora actual
 */
function getHourlyAdvice() {
    const hour = new Date().getHours();
    const stats = (typeof hourlyStats !== 'undefined') ? hourlyStats[hour] : null;
    
    if (!stats || stats.total < 3) return "SIN DATOS HORARIOS";
    
    const winRate = (stats.wins / stats.total) * 100;
    
    if (winRate >= 70) return `HORA EXCELENTE (${winRate.toFixed(0)}% WR)`;
    if (winRate <= 45) return `HORA RIESGOSA (${winRate.toFixed(0)}% WR)`;
    return `HORA ESTABLE (${winRate.toFixed(0)}% WR)`;
}

/**
 * MOTOR DE ANÁLISIS PRINCIPAL - Quantum Alpha PRO v23 | Super-IA
 */
/**
 * MOTOR DE ANÁLISIS PRINCIPAL - Quantum Alpha PRO v23 | Super-IA
 * Integración Quirúrgica: Filtro de Supervivencia + LSTM Deep Learning
 */
async function analyze() {
    const statusMsg = document.getElementById('op-status');
    const logEl = document.getElementById('ia-log'); 

    if (selectedTime === null) {
        if (statusMsg) statusMsg.innerHTML = "<span style='color:var(--down-neon)'>⚠️ SELECCIONE TIEMPO</span>";
        return;
    }

    if (isSignalActive || sequence.length < 3 || signalCooldown) return;
    
    const recent = sequence.slice(-10); 
    const lastPoint = recent[recent.length - 1];
    const lastDiff = lastPoint.diff;
    const seqStr = recent.map(s => s.val).join('');
    const lastVal = lastPoint.val;
    const currentSide = lastVal === 'A' ? "COMPRA" : "VENTA";
    
    const isCrash = analyzeMarketCrash(); 
    const oscillations = (seqStr.match(/AB|BA/g) || []).length;
    const noiseIndex = Math.round((oscillations / (seqStr.length - 1)) * 100);

    // --- [INSERCIÓN QUIRÚRGICA 1: FILTRO DE SUPERVIVENCIA] ---
    if (typeof checkSurvivalFilter === 'function') {
        if (!checkSurvivalFilter(noiseIndex)) {
            if (statusMsg) statusMsg.innerHTML = "<span style='color:orange; font-weight:bold;'>🛡️ MODO SUPERVIVENCIA ACTIVO</span>";
            return; // Bloquea el análisis si la IA detecta riesgo por racha de pérdidas
        }
    }
    // -------------------------------------------------------
    
    const powerSample = sequence.slice(-20);
    let rawPower = powerSample.reduce((acc, s) => {
        let weight = 800 / Math.max(s.diff, 50); 
        return s.val === 'A' ? acc + weight : acc - weight;
    }, 0);
    
    const power = Math.max(-10, Math.min(10, rawPower));
    const majorTrend = getMajorTrend();

    const hourlyAdvice = (typeof getHourlyAdvice === 'function') ? getHourlyAdvice() : "ANALIZANDO HORA...";
    const bestHour = (typeof getBestHour === 'function') ? getBestHour() : "--:--";

    let streakCount = 0;
    for (let i = recent.length - 1; i >= 0; i--) {
        if (recent[i].val === lastVal) streakCount++; else break;
    }

    // --- PANEL DE DIAGNÓSTICO VISUAL ACTUALIZADO ---
    if(logEl) {
        let crashWarning = isCrash ? "<b style='color:yellow'>[!] CAÍDA</b> " : "";
        logEl.innerHTML = `
            <div style="font-size:10px; color:#aaa; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 5px; border-left: 2px solid var(--accent);">
                <div style="margin-bottom:3px">
                    <b style="color:var(--accent)">SUPER-IA V23:</b> ${crashWarning}
                    TRD: <span style="color:white">${majorTrend}</span> | 
                    <span style="color:var(--up-neon)">${hourlyAdvice}</span>
                </div>
                <div style="display:flex; justify-content:space-between; opacity:0.8">
                    <span>RACHA: ${streakCount}</span>
                    <span>PWR: ${power.toFixed(1)}</span>
                    <span>NOISE: ${noiseIndex}%</span>
                    <span style="color:var(--f-gold)">TOP: ${bestHour}</span>
                </div>
            </div>
        `;
    }

    // 3. Piloto Autónomo (Mantenemos tu lógica de auto-ajuste)
    if (typeof autoPilotMode !== 'undefined' && autoPilotMode) {
        if (typeof volatilityShield !== 'undefined' && noiseIndex > volatilityShield.panicStop) {
            if(logEl) logEl.innerHTML += `<div style="color:var(--down-neon); font-size:9px">⚠️ PÁNICO: RUIDO CRÍTICO</div>`;
            if(statusMsg) statusMsg.innerText = "MERCADO ERRÁTICO";
            return;
        }

        if (isCrash) {
            riskLevel = 3; flexMode = false;
        } else if (noiseIndex < 35 && Math.abs(power) > 4.5) {
            riskLevel = 1; flexMode = true;
        } else if (noiseIndex > 45) {
            riskLevel = 3; flexMode = false;
        }
        if(typeof refreshVisualButtons === 'function') refreshVisualButtons();
    }

    // --- [INSERCIÓN QUIRÚRGICA 2: PREDICCIÓN NEURAL LSTM] ---
    let neuralPrediction = 0.5;
    try {
        // Prioridad al nuevo modelo LSTM si está disponible
        if (typeof getLiveNeuralPrediction === 'function' && neuralMode) {
            neuralPrediction = await getLiveNeuralPrediction();
            lastData = neuralPrediction;
        } 
        // Si no, recurre al NeuralCore viejo (retrocompatibilidad)
        else if (typeof NeuralCore !== 'undefined' && NeuralCore.model && neuralMode) {
            const currentData = [Math.min(lastDiff/2000, 1), lastPoint.val === 'A' ? 1 : 0, noiseIndex/100, Math.abs(power)/10];
            neuralPrediction = await NeuralCore.getPrediction(currentData);
            lastData = currentData; 
        }
    } catch (e) { console.error("Neural Error", e); }
    // -------------------------------------------------------

    if (typeof checkDynamicControls === 'function') checkDynamicControls(); 
    if(typeof updateAnalyticUI === 'function') updateAnalyticUI(noiseIndex, power, lastDiff, recent, majorTrend);

    const currentDNA = sequence.slice(-4).map(s => s.val).join('');
    const dnaConfidence = (typeof AICore !== 'undefined') ? (AICore.getConfidence ? AICore.getConfidence(currentDNA) : 0) : 0;
    const isAccelerated = recent.slice(-3).every(s => s.val === lastVal && s.diff < 400);

    // 5. LÓGICA DE DISPARO CON FILTROS VISUALES (Sincronizada con Super-IA)
    if (confluenceMode && sequence.length >= 20) {
        
        // --- [INSERCIÓN QUIRÚRGICA 3: LLAMADA A SUPER-IA v23] ---
        let score = 0;
        if (typeof SuperIA !== 'undefined' && typeof SuperIA.calculateSuperScore === 'function') {
            // El SuperScore ahora mezcla la base neural (0-10) con SMC, Momentum y DNA Match
            score = SuperIA.calculateSuperScore(neuralPrediction * 10, lastDiff, power);
        } else {
            // Si SuperIA no carga, usa el cálculo de confluencia estándar anterior
            score = getConfluenceScore(neuralPrediction, dnaConfidence, majorTrend, currentSide, isAccelerated, lastDiff, power);
        }
        // -------------------------------------------------------
        
        // Ajustamos los requerimientos para la nueva escala de puntuación
        let scoreRequerido = riskLevel === 1 ? 5 : (riskLevel === 2 ? 7 : 8.5);

        if (isCrash) scoreRequerido++;

        if (score >= scoreRequerido) {
            triggerSignal(currentSide, score);
            return;
        } else {
            if(statusMsg) statusMsg.innerHTML = `<span style="color:#555">CONFLUENCIA: ${score.toFixed(1)}/${scoreRequerido}</span>`;
        }
    } else {
        // Lógica estándar por racha si no hay confluencia activa
        let rachaReq = (typeof config !== 'undefined' && config.racha) ? config.racha[riskLevel] : 3;
        if (riskLevel === 1) rachaReq = flexMode ? 2 : 3;
        if (isCrash) rachaReq++;

        let maxNoise = (typeof config !== 'undefined' && config.ruido) ? (config.ruido[riskLevel] || 60) : 60;
        if (flexMode) maxNoise += 15;

        if (streakCount >= rachaReq && noiseIndex <= maxNoise) {
            let trendSafe = true;
            if (trendFilterMode && sequence.length >= 20) {
                if (lastVal === 'A' && majorTrend === "BEARISH") trendSafe = false;
                if (lastVal === 'B' && majorTrend === "BULLISH") trendSafe = false;
            }

            if (trendSafe) {
                let pwrLimit = isCrash ? 3.0 : 1.5;
                if (Math.abs(power) > pwrLimit) {
                    triggerSignal(currentSide, power);
                } else {
                    if(statusMsg) statusMsg.innerHTML = `<span style='color:#777'>DÉBIL PARA REBOTE</span>`;
                }
            } else {
                if(statusMsg) statusMsg.innerHTML = `<span style='color:var(--down-neon)'>BLOQUEO TENDENCIA</span>`;
            }
        }
    }
}

// ... (Resto de tus funciones getAdvancedDiagnostics, triggerSignal, etc., se mantienen igual)
function triggerSignal(side, strength) {
    if (typeof window.triggerSignal === 'function') {
        window.triggerSignal(side, strength);
    }
}

function finishSignal() {
    isSignalActive = false;
    signalCooldown = true;
    document.body.classList.remove('signal-active');
    if(typeof resetUI === 'function') resetUI(false);
    setTimeout(() => { signalCooldown = false; }, 3000);
}

function getAdvancedDiagnostics() {
    const logs = JSON.parse(localStorage.getItem('quantum_detailed_logs')) || [];
    if (logs.length < 5) return "Necesito al menos 5 operaciones para darte un diagnóstico real.";

    const hourlySuccess = {};
    const trendPerformance = { BULLISH: { w:0, t:0 }, BEARISH: { w:0, t:0 }, NEUTRAL: { w:0, t:0 } };
    let avgNoiseWin = 0; let winCount = 0;

    logs.forEach(log => {
        if (!hourlySuccess[log.hour]) hourlySuccess[log.hour] = { w: 0, t: 0 };
        hourlySuccess[log.hour].t++;
        if (log.win) hourlySuccess[log.hour].w++;

        if (trendPerformance[log.trend]) {
            trendPerformance[log.trend].t++;
            if (log.win) trendPerformance[log.trend].w++;
        }
        if (log.win) { avgNoiseWin += log.noise; winCount++; }
    });

    let bestHour = -1; let maxRate = -1;
    for (let h in hourlySuccess) {
        let rate = hourlySuccess[h].w / hourlySuccess[h].t;
        if (rate > maxRate) { maxRate = rate; bestHour = h; }
    }

    let bestTrend = Object.keys(trendPerformance).reduce((a, b) => 
        (trendPerformance[a].w / (trendPerformance[a].t || 1)) > (trendPerformance[b].w / (trendPerformance[b].t || 1)) ? a : b
    );

    const diagnostic = `
📊 DIAGNÓSTICO MAESTRO V23 SUPER-IA:
---------------------------
✅ MEJOR HORA: ${bestHour}:00h (Winrate: ${Math.round(maxRate*100)}%)
📈 MEJOR TENDENCIA: ${bestTrend}
📉 RUIDO IDEAL: Menor a ${winCount > 0 ? Math.round(avgNoiseWin/winCount) : 0}%
🔍 ESTADO GLOBAL: Sistema Adaptativo Activo
    `;
    
    console.log(diagnostic);
    return diagnostic;

}
