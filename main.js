// main.js - Orquestador Único del Tiempo y Seguridad Adaptado | Super-IA v23

let lastSignalSide = null; 
let lastPowerSnapshot = 0; // Captura la fuerza exacta al momento de la señal

// --- 1. INICIALIZACIÓN DEL SISTEMA ---
window.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initCanvas(); 
    
    // ACTIVACIÓN INSTANTÁNEA: No esperamos a la calibración para liberar la UI
    if (typeof refreshVisualButtons === 'function') {
        refreshVisualButtons(); 
        console.log("⚡ Interfaz Liberada al Instante");
    }

    // El sistema de plataforma se ejecuta inmediatamente
    const savedPlatform = localStorage.getItem('selectedPlatform');
    const selector = document.getElementById('device-selector');
    const isMobileHardware = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                             || window.innerWidth <= 768;

    if (savedPlatform) {
        if (selector) selector.style.display = 'none';
        if (savedPlatform === 'mobile') {
            setTimeout(() => {
                forceMobileView();
                updateToggleButtonUI('mobile');
            }, 500);
        } else {
            updateToggleButtonUI('pc');
        }
    } else {
        if (selector) {
            selector.style.display = 'flex';
        } else if (isMobileHardware) {
            setTimeout(() => { 
                if (typeof toggleAdaptativeView === 'function') toggleAdaptativeView(); 
            }, 500);
        }
    }
    
    // CARGA DE HISTORIAL
    const hSaved = localStorage.getItem('tradeHistory');
    if(hSaved) { 
        tradeHistory = JSON.parse(hSaved); 
        updateStats();
    }
});

// Función que se dispara solo cuando TensorFlow termina de bajar
function initIAOnBackground() {
    console.log("🧠 TensorFlow cargado. Iniciando cerebro en segundo plano...");
    if (typeof initQuantumLSTM === 'function') {
        initQuantumLSTM();
    }
}

// --- 2. GESTIÓN DE RESULTADOS Y UI (QUIRÚRGICO) ---

function handleWinClick() {
    const resultStep = document.getElementById('result-step');
    const colorStep = document.getElementById('color-step');
    
    if(resultStep && colorStep) {
        if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
        resultStep.style.display = 'none';
        colorStep.style.cssText = "display: flex !important; gap: 8px; width: 100%;";

        if (window.colorTimeout) clearTimeout(window.colorTimeout);
        window.colorTimeout = setTimeout(() => {
            if(isSignalActive && colorStep.style.display !== 'none') {
                const defaultColor = (lastSignalSide === 'COMPRA') ? 'A' : 'B';
                recordResult(true, defaultColor);
            }
        }, 60000); 
    }
}

function triggerSignal(side, strength) {
    if (isSignalActive) return;
    
    // FILTRO INSTITUCIONAL SMC/ICT 2026
    const ms = lastClickTime > 0 ? Date.now() - lastClickTime : 0;
    const powerEl = document.getElementById('power-index');
    const currentPower = powerEl ? parseFloat(powerEl.innerText.replace('POWER: ', '')) : strength;
    const finalScore = SuperIA.calculateSuperScore(strength, ms, currentPower);
    
    if (finalScore < 4.5) {
        console.log(`%c 🚫 SEÑAL BLOQUEADA: Score Insuficiente (${finalScore.toFixed(2)})`, 'color: #ff2e63; font-weight: bold;');
        return; 
    }

    isSignalActive = true;
    signalCooldown = true;
    lastSignalSide = side; 
    lastPowerSnapshot = strength;
    window.currentSignalScore = finalScore; 

    // DOM REFERENCES
    const feedbackGrid = document.getElementById('f-grid'); 
    const resultStep = document.getElementById('result-step');
    const colorStep = document.getElementById('color-step');
    const statusMsg = document.getElementById('op-status');
    const timerEl = document.getElementById('op-timer');
    const bigIcon = document.getElementById('big-icon');
    const timerBar = document.getElementById('timer-bar');

    if(resultStep) resultStep.style.display = 'none'; 
    if(colorStep) colorStep.style.display = 'none';
    if(feedbackGrid) feedbackGrid.classList.add('show'); 
    document.body.classList.add('signal-active'); 

    const color = side === 'COMPRA' ? 'var(--up-neon)' : 'var(--down-neon)';

    if(statusMsg) {
        const activeSetup = (typeof QuantumSMC !== 'undefined') ? QuantumSMC.detectSetups() : null;
        const modelLabel = activeSetup ? `<br><small style="font-size:10px; color:gold;">MODELO: ${activeSetup.name}</small>` : '';
        statusMsg.innerHTML = `<span style="color:${color}; font-weight:bold; text-shadow: 0 0 10px ${color}44;">${side} DETECTADA</span>${modelLabel}`;
    }

    if(bigIcon) {
        bigIcon.innerText = side === 'COMPRA' ? "▲" : "▼";
        bigIcon.style.color = color;
        bigIcon.style.display = "flex";
    }

    if (countdownInterval) clearInterval(countdownInterval);
    let count = parseInt(window.selectedTime) || parseInt(document.getElementById('timeList')?.value) || 30; 
    const initialTime = count; 

    countdownInterval = setInterval(() => {
        count--;
        if(timerEl) {
            timerEl.innerText = count < 10 ? "0" + count : count;
            timerEl.style.color = count <= 5 ? "var(--down-neon)" : "var(--text-main)";
        }
        if(timerBar) timerBar.style.width = ((count / initialTime) * 100) + '%';
        
        if(count <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK"); 
            
            if(resultStep) {
                resultStep.style.cssText = "display: flex !important; visibility: visible !important; opacity: 1 !important; z-index: 999999 !important; width: 100% !important;";
                if(bigIcon) bigIcon.style.display = "none";
            }
        }
    }, 1000);
    
    if(typeof AudioEngine !== 'undefined') AudioEngine.play(side);
}

async function recordResult(win, manualColor = null) {
    if (window.colorTimeout) { clearTimeout(window.colorTimeout); window.colorTimeout = null; }
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }

    const signalType = lastSignalSide === 'COMPRA' ? 'A' : 'B';
    let finalColor = manualColor || (win ? signalType : (signalType === 'A' ? 'B' : 'A'));

    const currentDNA = (typeof sequence !== 'undefined') ? sequence.slice(-5).map(s => s.val).join('') : "";
    
    const tradeData = {
        win: win,
        color: finalColor,
        side: lastSignalSide,
        timestamp: Date.now(),
        power: lastPowerSnapshot,
        dna: currentDNA,
        riskAtTrade: typeof riskLevel !== 'undefined' ? riskLevel : 3, 
        trend: typeof getMajorTrend === 'function' ? getMajorTrend() : "NEUTRAL",
        scoreAtTrade: window.currentSignalScore || 0 
    };

    tradeHistory.push(tradeData);
    if(tradeHistory.length > 50) tradeHistory.shift(); 
    localStorage.setItem('tradeHistory', JSON.stringify(tradeHistory));

    // VÍNCULO LSTM v26
    if (typeof registrarResultadoTrade === 'function') registrarResultadoTrade(tradeData.win);
    if(typeof AICore !== 'undefined') AICore.learn(); 

    isSignalActive = false; 
    signalCooldown = false;
    updateStats();
    resetUI(false); 
}

// --- 3. FUNCIONES DE SOPORTE Y PLATAFORMA ---

function resetUI(fullReset = true) {
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    isSignalActive = false;
    const feedbackGrid = document.getElementById('f-grid');
    if(feedbackGrid) feedbackGrid.classList.remove('show'); 
    document.body.classList.remove('signal-active');
}

function updateStats() {
    const wins = tradeHistory.filter(x => x && x.win === true).length;
    const total = tradeHistory.length;
    if(document.getElementById('stat-total')) document.getElementById('stat-total').innerText = total;
    if(document.getElementById('stat-winrate')) document.getElementById('stat-winrate').innerText = total > 0 ? Math.round((wins/total)*100) + "%" : "0%";
}

function setPlatform(type) {
    localStorage.setItem('selectedPlatform', type);
    const selector = document.getElementById('device-selector');
    if (selector) selector.style.display = 'none';
    if (type === 'mobile') forceMobileView();
    updateToggleButtonUI(type);
    if (typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

function forceMobileView() {
    const terminal = document.getElementById('main-terminal');
    if (terminal && !terminal.classList.contains('terminal-fullscreen')) {
        if (typeof toggleAdaptativeView === 'function') toggleAdaptativeView();
    }
}

function handlePlatformToggle() {
    const current = localStorage.getItem('selectedPlatform') || 'pc';
    const next = current === 'mobile' ? 'pc' : 'mobile';
    localStorage.setItem('selectedPlatform', next);
    if (typeof toggleAdaptativeView === 'function') toggleAdaptativeView();
    updateToggleButtonUI(next);
}

function updateToggleButtonUI(platform) {
    const btn = document.getElementById('platform-toggle-btn');
    if (btn) {
        btn.innerHTML = platform === 'mobile' ? "💻 DESKTOP" : "📱 MÓVIL";
        btn.style.background = platform === 'mobile' ? "var(--down-neon)" : "var(--accent)";
    }
}

function clearFullHistory() {
    if(confirm("¿Resetear sistema?")) {
        localStorage.clear();
        window.location.reload();
    }
}