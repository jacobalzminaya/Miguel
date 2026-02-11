// controls.js - Quantum Alpha PRO v22 | Ultimate Edition

// --- VARIABLES DE ESTADO AUTÓNOMO ---
let autoPilotMode = false;

// --- MANEJO DE RADAR Y MOUSE (CORREGIDO) ---
function toggleMouse() {
    mouseEnabled = !mouseEnabled;
    if(typeof AudioEngine !== 'undefined') AudioEngine.init();

    const overlay = document.getElementById('mouse-overlay');
    const btn = document.getElementById('mouseBtn');
    const touchZone = document.getElementById('manual-touch-zone');

    if (mouseEnabled) {
        if(overlay) {
            overlay.classList.add('active-radar');
            
            // 1. BLOQUEAR MENÚ CONTEXTUAL (Evita que el clic derecho abra el menú del navegador)
            overlay.oncontextmenu = (e) => e.preventDefault();
            
            // 2. DETECTOR DE CLICS QUIRÚRGICO
            overlay.onmousedown = (e) => {
                if (!mouseEnabled || isSignalActive) return;
                
                // e.button === 0 (Izquierdo) -> UP
                // e.button === 2 (Derecho) -> DOWN
                if (e.button === 0) {
                    console.log("🖱️ Hardware Input: LEFT CLICK -> UP");
                    registerInput('A');
                } else if (e.button === 2) {
                    console.log("🖱️ Hardware Input: RIGHT CLICK -> DOWN");
                    registerInput('B');
                }
            };
        }
        
        if(btn) {
            btn.classList.add('radar-on');
            btn.innerText = "SENSOR ACTIVO";
            btn.style.backgroundColor = "var(--up-neon)"; 
            btn.style.color = "#000";
            btn.style.boxShadow = "0 0 15px var(--up-neon)";
        }

        if(touchZone) touchZone.style.display = "flex";

    } else {
        // Desactivar
        if(overlay) {
            overlay.classList.remove('active-radar');
            overlay.onmousedown = null;
            overlay.oncontextmenu = null;
        }
        if(btn) {
            btn.classList.remove('radar-on');
            btn.innerText = "ACTIVAR SENSOR";
            btn.style.backgroundColor = "";
            btn.style.color = "";
            btn.style.boxShadow = "none";
        }
        if(touchZone) touchZone.style.display = "none";
    }
}

// --- FUNCIÓN FLEX (CON AUTO-APAGADO DE NEURAL) ---
function toggleFlex() {
    if (isSignalActive) return; 

    flexMode = !flexMode;
    const fBtn = document.getElementById('flexBtn');
    const nBtn = document.getElementById('neuralBtn');
    
    if(flexMode) {
        neuralMode = false;
        if(nBtn) {
            nBtn.classList.remove('active');
            nBtn.style.backgroundColor = "transparent";
            nBtn.style.color = "#00f3ff";
        }
    }

    if(fBtn) {
        if(flexMode) {
            fBtn.classList.add('active');
            fBtn.style.backgroundColor = "#8957e5";
            fBtn.style.color = "#ffffff";
        } else {
            fBtn.classList.remove('active');
            fBtn.style.backgroundColor = "transparent";
            fBtn.style.color = "#8957e5";
        }
    }

    if (typeof refreshVisualButtons === 'function') refreshVisualButtons();
    
    if (typeof updateAnalyticUI === 'function') {
        updateAnalyticUI(
            lastTelemetryCache.noise,
            lastTelemetryCache.power,
            lastTelemetryCache.ms,
            lastTelemetryCache.recent,
            lastTelemetryCache.trend
        );
    }

    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

// --- REGISTRO DE ENTRADAS (CLICS/TOUCH) ---
function registerInput(val) {
    if (selectedTime === null || riskLevel === null) {
        const statusMsg = document.getElementById('op-status');
        if(statusMsg) {
            statusMsg.innerHTML = "<span style='color:var(--down-neon)'>⚠️ CONFIGURACIÓN PENDIENTE</span>";
        }
        if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK"); 
        return; 
    }

    if (!mouseEnabled || isSignalActive || (typeof signalCooldown !== 'undefined' && signalCooldown)) return;

    const now = Date.now();
    const diff = (lastClickTime === 0) ? 0 : now - lastClickTime;
    
    if (diff > 0 && diff < 60) return;

    lastClickTime = now;
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");

    sequence.push({ val, diff });
    if (sequence.length > 30) sequence.shift(); 

    const lastPoint = chartData[chartData.length - 1];
    let nextPoint = val === 'A' ? lastPoint + 5 : lastPoint - 5;
    
    if (nextPoint > 80) nextPoint = 78;
    if (nextPoint < 10) nextPoint = 12;

    chartData.push(nextPoint);
    if (chartData.length > 40) chartData.shift();

    if(typeof drawChart === 'function') drawChart();
    if(typeof updateSymbols === 'function') updateSymbols();
    
    const statusMsg = document.getElementById('op-status');
    if(statusMsg && statusMsg.innerText.includes("SELECCIONE")) {
        statusMsg.innerText = "RADAR ESCANEANDO...";
        statusMsg.style.color = "var(--up-neon)";
    }

    if(typeof analyze === 'function') {
        setTimeout(analyze, 10);
    }
}

// --- DESHACER ÚLTIMA ENTRADA ---
function undoLastInput(e) {
    if(e) e.preventDefault(); 
    if (sequence.length === 0 || isSignalActive) return;

    sequence.pop();
    chartData = Array(40).fill(40);
    sequence.forEach(s => {
        const lastPoint = chartData[chartData.length - 1];
        chartData.push(s.val === 'A' ? lastPoint + 5 : lastPoint - 5);
    });

    lastClickTime = 0; 
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
    
    if(typeof drawChart === 'function') drawChart();
    if(typeof updateSymbols === 'function') updateSymbols();
    if(typeof analyze === 'function') analyze();
}

// --- CONFIGURACIÓN DE PARÁMETROS ---
function setTime(s, btn) {
    if (isSignalActive) return;
    selectedTime = s;
    localStorage.setItem('selectedTime', s); 

    const buttons = document.querySelectorAll('#time-group .btn');
    buttons.forEach(b => b.classList.remove('active'));
    
    if(btn) {
        btn.classList.add('active');
    } else {
        document.getElementById(`t${s}`)?.classList.add('active');
    }
    
    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

function setRisk(r, btn) {
    if (isSignalActive) return;
    riskLevel = r;

    const riskIds = ['r1', 'r2', 'r3'];
    riskIds.forEach(id => {
        const b = document.getElementById(id);
        if (b) {
            b.classList.remove('active');
            b.style.boxShadow = "none";
            b.style.borderColor = "var(--border)";
        }
    });

    const activeBtn = btn || document.getElementById(`r${r}`);
    if(activeBtn) {
        activeBtn.classList.add('active');
        const levelColors = ["#00ff88", "#f1c40f", "#ff2e63"];
        const selectedColor = levelColors[r - 1];
        activeBtn.style.borderColor = selectedColor;
        activeBtn.style.boxShadow = `0 0 12px ${selectedColor}66`;
    }

    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

// --- BOTONES DE MODOS ---
function toggleFlexMode() { toggleFlex(); }

function toggleNeuralMode() { 
    if (isSignalActive) return;
    if (tradeHistory.length < 10 && !neuralMode) {
        alert("IA requiere al menos 10 operaciones de entrenamiento.");
        return;
    }
    
    neuralMode = !neuralMode;
    const nBtn = document.getElementById('neuralBtn');
    const fBtn = document.getElementById('flexBtn');

    if(neuralMode) {
        flexMode = false;
        if(fBtn) {
            fBtn.classList.remove('active');
            fBtn.style.backgroundColor = "transparent";
            fBtn.style.color = "#8957e5"; 
        }
    }

    if(nBtn) {
        if(neuralMode) {
            nBtn.classList.add('active');
            nBtn.style.backgroundColor = "#00f3ff";
            nBtn.style.color = "#000000";
        } else {
            nBtn.classList.remove('active');
            nBtn.style.backgroundColor = "transparent";
            nBtn.style.color = "#00f3ff";
        }
    }

    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

function toggleTrendMode() {
    if (isSignalActive) return;
    trendFilterMode = !trendFilterMode;
    const tBtn = document.getElementById('trendBtn');
    if(tBtn) tBtn.classList.toggle('active', trendFilterMode);
    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

function toggleConfluence() {
    if (isSignalActive) return;
    confluenceMode = !confluenceMode;
    const btn = document.getElementById('confluenceBtn');
    if(btn) btn.classList.toggle('active', confluenceMode);
    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

function toggleAdaptive() {
    if (isSignalActive) return;
    adaptiveVolatility = !adaptiveVolatility;
    const btn = document.getElementById('adaptiveBtn');
    if(btn) btn.classList.toggle('active', adaptiveVolatility);
    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

function toggleAutoPilot() {
    if (isSignalActive) return;
    autoPilotMode = !autoPilotMode;
    const btn = document.getElementById('autoPilotBtn');
    if(btn) {
        if(autoPilotMode) {
            btn.classList.add('active');
            btn.style.boxShadow = "0 0 15px #ff9f43";
            btn.innerText = "PILOTO AUTO: ON";
        } else {
            btn.classList.remove('active');
            btn.style.boxShadow = "none";
            btn.innerText = "MODO AUTÓNOMO";
        }
    }
    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

// --- ATAJOS DE TECLADO ---
window.addEventListener('keydown', (e) => {
    if (isSignalActive) return;
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') registerInput('A');
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') registerInput('B');
    if ((e.key.toLowerCase() === 'z') && e.ctrlKey) undoLastInput();
});

// --- EXPORTACIÓN Y REINICIO ---
function exportHistoryToCSV() {
    if (tradeHistory.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,Fecha,Resultado,Riesgo,Tiempo\r\n";
    tradeHistory.forEach(trade => {
        csvContent += `${new Date(trade.timestamp).toLocaleTimeString()},${trade.win ? "WIN" : "LOSS"},${trade.riskAtTrade},${trade.timeAtTrade}\r\n`;
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Quantum_Session_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function cycleRisk() {
    riskLevel = (riskLevel % 3) + 1;
    const riskBtn = document.getElementById('risk-cycle-btn');
    const opDetails = document.getElementById('op-details');
    const config = {
        1: { label: "N1: CONSERVADOR", color: "#00ff88", detail: "FILTRO DE RIESGO MÁXIMO" },
        2: { label: "N2: MODERADO", color: "#4a90e2", detail: "EQUILIBRIO INSTITUCIONAL" },
        3: { label: "N3: SNIPER", color: "#ff9f43", detail: "ALTA PRECISIÓN V23" }
    };

    if(riskBtn) {
        riskBtn.innerText = `R: N${riskLevel}`;
        riskBtn.style.setProperty('border-color', config[riskLevel].color, 'important');
        riskBtn.style.setProperty('color', config[riskLevel].color, 'important');
    }
    if(opDetails) {
        opDetails.innerText = config[riskLevel].detail;
        opDetails.style.setProperty('color', config[riskLevel].color, 'important');
    }
    if(typeof saveConfig === 'function') saveConfig();
    if(typeof AudioEngine !== 'undefined') AudioEngine.play("CLICK");
}

function toggleAdaptativeView() {
    const terminal = document.getElementById('main-terminal');
    const isMobile = localStorage.getItem('selectedPlatform') === 'mobile';
    if (!terminal) return;

    if (isMobile) {
        terminal.classList.add('terminal-fullscreen');
        document.body.classList.add('mobile-mode');
    } else {
        terminal.classList.remove('terminal-fullscreen');
        document.body.classList.remove('mobile-mode');
    }

    setTimeout(() => {
        if(typeof initCanvas === 'function') initCanvas();
    }, 150);
}

function hardResetApp() {
    if (confirm("⚠️ ¿Reiniciar todo el sistema?")) {
        document.body.style.opacity = "0";
        setTimeout(() => window.location.reload(), 500);
    }
}