// engine.js - Quantum Alpha PRO v22 | Ultimate Edition - MODIFICADO

const AudioEngine = {
    ctx: null,
    init() { 
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); 
    },
    async play(type) {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); 
        gain.connect(this.ctx.destination);

        if(type === "CLICK") {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            osc.start(); 
            osc.stop(this.ctx.currentTime + 0.03);
        } else {
            osc.type = 'triangle';
            const freqInicio = (type === "COMPRA") ? 660 : 440;
            const freqFinal = (type === "COMPRA") ? 990 : 220; 
            
            osc.frequency.setValueAtTime(freqInicio, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freqFinal, this.ctx.currentTime + 0.5);

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);
            
            osc.start(); 
            osc.stop(this.ctx.currentTime + 0.7);
        }

        if(navigator.vibrate) navigator.vibrate(type === "COMPRA" ? [30, 10, 30] : [70]);
    }
};

/**
 * NUEVO: SENSOR DE ENERGÍA QUIRÚRGICO
 * Se llama automáticamente antes de cada redibujado
 */
function updateMarketEnergy() {
    const now = Date.now();
    if (typeof lastDataTimestamp === 'undefined') window.lastDataTimestamp = now;
    if (typeof marketEnergy === 'undefined') window.marketEnergy = 0;

    const timeDiff = now - lastDataTimestamp;
    window.lastDataTimestamp = now;

    // Si los datos entran en menos de 400ms, la energía sube (algoritmos detectados)
    if (timeDiff < 400) {
        window.marketEnergy = Math.min(window.marketEnergy + 0.8, 10);
    } else {
        window.marketEnergy = Math.max(window.marketEnergy - 0.4, 0);
    }
}

function drawChart() {
    const canvas = document.getElementById('flow-chart');
    if(!canvas) return;
    
    // Ejecutamos el sensor de energía antes de dibujar
    updateMarketEnergy();

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;
    
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    
    if (chartData.length < 2) return;

    const centerY = logicalHeight / 2;

    // --- 1. DIBUJO DE LA MEDIA (AMARILLO NEÓN) ---
    const avgValue = chartData.reduce((a, b) => a + b, 0) / chartData.length;
    const avgY = centerY - (avgValue - 40) * 0.8; 

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([6, 4]); 
    ctx.strokeStyle = '#ffff00'; 
    ctx.lineWidth = 2; 
    ctx.globalAlpha = 0.8; 
    ctx.moveTo(0, avgY);
    ctx.lineTo(logicalWidth, avgY);
    ctx.stroke();
    ctx.setLineDash([]); 
    ctx.restore();

    // --- 2. CUADRÍCULA DE FONDO ---
    ctx.strokeStyle = 'rgba(74, 144, 226, 0.05)';
    ctx.lineWidth = 1;
    for(let i=0; i < logicalWidth; i += 25) {
        ctx.beginPath(); 
        ctx.moveTo(i, 0); 
        ctx.lineTo(i, logicalHeight); 
        ctx.stroke();
    }

    // --- 3. DIBUJO DEL PRECIO (DINÁMICA DE ENERGÍA) ---
    ctx.beginPath();
    const lastVal = sequence[sequence.length-1]?.val;
    
    // MEJORA VISUAL: Si la energía es alta (>7), el gráfico brilla con aura blanca/neón
    if (window.marketEnergy > 7) {
        ctx.lineWidth = 5;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = lastVal === 'A' ? '#00ff88' : '#ff2e63';
        ctx.shadowColor = '#ffffff'; // Brillo de alta energía
    } else if (perfectFlow) {
        ctx.lineWidth = 4;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = lastVal === 'A' ? '#00ff88' : '#ff2e63';
        ctx.shadowColor = lastVal === 'A' ? '#00ff88' : '#ff2e63';
    } else {
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#4a90e2';
    }
    
    const step = logicalWidth / (chartData.length - 1);
    chartData.forEach((val, i) => {
        const x = i * step;
        const y = centerY - (val - 40) * 0.8; 
        if(i === 0) ctx.moveTo(x, y); 
        else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function initCanvas() {
    const canvas = document.getElementById('flow-chart');
    if(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        ctx.scale(dpr, dpr);
        
        drawChart();
    }
}
/**
 * SISTEMA DE REGISTRO DE RESULTADOS (PUENTE DE APRENDIZAJE)
 * Llama a esta función cuando termine un trade para que la IA aprenda.
 */
/**
 * SISTEMA DE REGISTRO DE RESULTADOS (PUENTE DE APRENDIZAJE)
 * Versión v26 - Sincronizada con Sensor de Energía
 */
function registrarResultadoTrade(isWin) {
    // 1. Obtener contexto del estado global
    const type = window.lastSignalSide || "COMPRA";
    const energiaMomento = window.marketEnergy || 0;

    // 2. Feedback a la Red Neuronal (LSTM)
    // Pasamos el resultado para que ajuste los pesos del modelo en ai.js
    if (typeof trainModelWithResult === 'function') {
        trainModelWithResult(isWin); 
        console.log(`🧠 IA Feedback: ${isWin ? '✅' : '❌'} | Energía: ${energiaMomento.toFixed(2)}`);
    }

    // 3. Persistencia en el Almacén de Patrones (state.js)
    if (typeof patternVault !== 'undefined') {
        // Registramos la victoria/derrota en las estadísticas de micro-tendencia
        patternVault.microTrendWins += isWin ? 1 : -0.5; // Castigamos un poco más la pérdida
        
        // Guardamos en LocalStorage para que la IA sea "más inteligente" mañana
        localStorage.setItem('quantum_pattern_vault', JSON.stringify(patternVault));
    }

    // 4. Feedback Auditivo (Opcional pero recomendado para testeo)
    if (typeof AudioEngine !== 'undefined' && isWin) {
        // Sonido sutil de éxito si existe la función
        AudioEngine.play("CLICK"); 
    }
}