// ui.js - Quantum Alpha PRO v22 | Ultimate Edition

/**
 * Actualiza la pista visual de triángulos (A/B)
 */
function updateSymbols() {
    const symbolsTrack = document.getElementById('symbols-track');
    if (!symbolsTrack) return;

    if (sequence.length === 0) {
        symbolsTrack.innerHTML = '<span style="color: var(--text-dim); font-size: 11px;">ESPERANDO DATOS DEL SENSOR...</span>';
        return;
    }

    symbolsTrack.innerHTML = sequence.slice(-14).map(s => 
        `<span style="color:${s.val === 'A' ? 'var(--up-neon)' : 'var(--down-neon)'}; 
        font-size:16px; font-weight:bold; margin: 0 2px;">${s.val === 'A' ? '▲' : '▼'}</span>`
    ).join('');
}

/**
 * UI ANALYTICS + IA ADVISOR SYSTEM
 */

/**
 * UI ANALYTICS + IA ADVISOR SYSTEM - Quantum Alpha PRO v22
 * Integración Quirúrgica: Niveles de Riesgo + Modo FLEX + SMC/Neural
 */
let lastTelemetryCache = { noise: 0, power: 0, ms: 0, recent: [], trend: "NEUTRAL" };

function updateAnalyticUI(noise, power, ms, recent, majorTrend) {
    const term = document.getElementById('main-terminal');
    const iaLogic = document.getElementById('ia-logic');
    const iaStake = document.getElementById('ia-stake');
    const statusMsg = document.getElementById('op-status'); 
    
    // 1. Actualizar Marcadores de Telemetría (Header)
    const noiseEl = document.getElementById('noise-index');
    const powerEl = document.getElementById('power-index');
    const speedEl = document.getElementById('speed-meter');

    if(noiseEl) noiseEl.innerText = `NOISE: ${Math.round(noise)}%`;
    if(powerEl) powerEl.innerText = `POWER: ${power.toFixed(1)}`;
    if(speedEl) speedEl.innerText = `MS: ${ms === 0 ? '--' : ms}`;

    // --- [MANTENIDO] INTEGRACIÓN QUIRÚRGICA: DETECCIÓN SMC/ICT 2026 ---
    const activeSetup = (typeof QuantumSMC !== 'undefined') ? QuantumSMC.detectSetups() : null;
    const ipda = (typeof QuantumSMC !== 'undefined') ? QuantumSMC.getIPDAStatus() : { phase: "STANDBY", power: 1 };
    const pdZone = (typeof QuantumSMC !== 'undefined') ? QuantumSMC.isPremiumDiscount() : "NEUTRAL";

    // --- [MANTENIDO] LÓGICA DEL ASESOR DE IA ORIGINAL ---
    let advice = "ESCANEANDO FLUJO...";
    let adviceColor = "var(--text-dim)";
    perfectFlow = false;

    if (noise > 50) {
        advice = "⚠️ RUIDO CRÍTICO: NO OPERAR";
        adviceColor = "#ff2e63"; 
    } 
    else if (activeSetup) {
        advice = `🔥 ${activeSetup.name}: ${activeSetup.signal}`;
        adviceColor = "gold";
        perfectFlow = true;
    }
    else if (noise < 20 && Math.abs(power) < 4 && ms > 700) {
        advice = "🐢 MERCADO LENTO: MODALIDAD FLEX";
        adviceColor = "#8957e5"; 
    }
    else if (majorTrend !== "NEUTRAL" && Math.abs(power) > 5) {
        advice = `📈 FUERZA ${majorTrend}: USAR TREND`;
        adviceColor = "#4a90e2";
    }
    else if (noise < 15 && (typeof sequence !== 'undefined' && sequence.length > 5)) {
        advice = "💎 FLUJO PERFECTO: ALTA PRECISIÓN";
        adviceColor = "var(--up-neon)";
        perfectFlow = true;
    }

    if(statusMsg && !isSignalActive) { 
        const zoneIcon = pdZone === "PREMIUM" ? "🔴" : (pdZone === "DISCOUNT" ? "🟢" : "⚪");
        statusMsg.innerHTML = `<small style="font-size:9px; opacity:0.8;">${zoneIcon} ${pdZone} | ${ipda.phase}</small><br>${advice}`;
        statusMsg.style.color = adviceColor;
    }

    if (typeof trendFilterMode !== 'undefined' && trendFilterMode && majorTrend && majorTrend !== "NEUTRAL" && statusMsg && !isSignalActive) {
        const trendIcon = majorTrend === "BULLISH" ? "↗️" : "↘️";
        const trendColor = majorTrend === "BULLISH" ? "var(--up-neon)" : "var(--down-neon)";
        statusMsg.innerHTML += ` <span style="color:${trendColor}; font-size:10px;">[${trendIcon} ${majorTrend}]</span>`;
    }

    // 3. Reporte de IA Neural (Footer info)
    const totalOps = tradeHistory.length;

    if (iaLogic && iaStake) {
        const baseNeural = (typeof lastNeuralPrediction !== 'undefined' ? lastNeuralPrediction : 0.5);
        const probPct = Math.round(baseNeural * 100);
        const superScore = (typeof SuperIA !== 'undefined') ? SuperIA.calculateSuperScore(baseNeural * 10, ms, power) : 0;

        if (totalOps < 10) {
            iaLogic.innerHTML = `<span style="color:var(--text-dim)">IA APRENDIENDO... (${10 - totalOps} ops)</span>`;
            iaStake.innerText = "ESPERANDO ENTRENAMIENTO";
        } else {
            // --- [NUEVO] ASESOR DE NIVEL + DETECCIÓN FLEX ---
            let levelAdvice = "ESTABLE: USAR N2 MODERADO ⚖️";
            let levelColor = "#4a90e2";

            if (noise < 18 && Math.abs(power) > 6) {
                levelAdvice = "OPTIMO: USAR N3 SNIPER 🎯";
                levelColor = "#ff9f43";
            } else if (noise > 40) {
                levelAdvice = "RIESGO: USAR N1 CONSERVADOR 🛡️";
                levelColor = "#00ff88";
            }

            // Inyectar "+ FLEX" dinámicamente si el modo está activo
            const flexTag = (typeof flexMode !== 'undefined' && flexMode) ? 
                `<span style="color: #ff2e63; font-weight: bold; text-shadow: 0 0 5px rgba(255,46,99,0.5);"> + FLEX</span>` : "";

            let colorIA = "#8957e5"; 
            if (probPct > 80) colorIA = "var(--up-neon)";
            if (probPct < 20) colorIA = "var(--down-neon)";

            // Se arma el HTML unificado: Nivel Sugerido + Flex | Neural | SMC
            iaLogic.innerHTML = `
                <div style="font-size:10px; font-weight:bold; margin-bottom:2px; letter-spacing:0.5px;">
                    <span style="color:${levelColor}">${levelAdvice}</span>${flexTag}
                </div>
                NEURAL: <span style="color:${colorIA}">${probPct}%</span> | SMC: <span style="color:gold;">${superScore.toFixed(1)}</span>
            `;
            
            iaStake.innerText = (superScore > 12 || superScore < -5) ? "SUGERENCIA: STAKE ALTO 🔥" : "SUGERENCIA: ESPERAR ⏳";
            iaStake.style.color = (superScore > 12) ? "gold" : "var(--text-dim)";
        }
    }

    // --- BLOQUE DE SEGURIDAD: CONTROL DEL BOTÓN AUTÓNOMO ---
    const autoBtn = document.getElementById('autoPilotBtn');
    if (autoBtn) {
        if (totalOps < 10) {
            autoBtn.disabled = true;
            autoBtn.style.opacity = "0.5";
            autoBtn.innerText = `BLOQUEADO (${10 - totalOps})`;
        } else {
            autoBtn.disabled = false;
            autoBtn.style.opacity = "1";
            if (typeof autoPilotMode !== 'undefined' && !autoPilotMode) {
                autoBtn.innerText = "MODO AUTÓNOMO (READY)";
            }
        }
    }

    // 4. Efectos Visuales de Feedback (Heartbeat)
    if (term && recent && recent.length > 0) {
        const lastVal = recent[recent.length-1]?.val;
        term.classList.remove('high-noise-heart-red', 'high-noise-heart-green');
        if (noise > 30) {
            term.classList.add(lastVal === 'A' ? 'high-noise-heart-green' : 'high-noise-heart-red');
        }
    }
}

/**
 * Control visual del selector de tiempo
 */
function handleTimeSelection(val) {
    const manualInput = document.getElementById('manualTime');
    
    if (val === "MANUAL") {
        manualInput.style.display = "inline-block";
        manualInput.focus();
    } else {
        manualInput.style.display = "none";
        // IMPORTANTE: Asegúrate de que esta línea asigne el valor a la variable global
        window.selectedTime = parseInt(val); 
        
        // Si usas la función de controls.js, llámala explícitamente:
        if (typeof syncSelectedTime === 'function') {
            syncSelectedTime(parseInt(val));
        }
    }
}