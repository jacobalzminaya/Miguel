// quantum_smc_ai.js - Módulo de Inteligencia Institucional 2025-2026 | SUPER-IA v23 UPDATE
const QuantumSMC = {
    // 1. PD ARRAY MATRIX (Jerarquía Octubre 2025) - MANTENIDO
    matrix: {
        SUSPENSION: { level: 7, weight: 15, name: "Suspension Block" }, 
        PROPULSION: { level: 6, weight: 12, name: "Propulsion Block" },
        BREAKER:    { level: 5, weight: 10, name: "Breaker Block" },
        ORDER_BLOCK:{ level: 4, weight: 8,  name: "Order Block" },
        IFVG:       { level: 3, weight: 7,  name: "Inverted FVG" },
        FVG:        { level: 2, weight: 5,  name: "Fair Value Gap" },
        LIQUIDITY:  { level: 1, weight: 3,  name: "Liquidity Void" }
    },

    // 2. IPDA ENGINE (Tiempo > Precio) - MANTENIDO
    getIPDAStatus() {
        const now = new Date();
        const hr = now.getUTCHours() - 5; // Ajuste NY (EST)
        
        if (hr === 0) return { phase: "MIDNIGHT_OPEN", power: 1.5 };
        if (hr >= 2 && hr <= 5) return { phase: "LONDON_OPEN", power: 2.0 };
        if (hr >= 8 && hr <= 10) return { phase: "NY_OPEN_VENOM", power: 2.5 }; 
        if (hr >= 10 && hr <= 11) return { phase: "SILVER_BULLET", power: 2.2 };
        return { phase: "MACRO_CONSOLIDATION", power: 0.5 };
    },

    /**
     * 3. DETECTOR DE MODELOS AVANZADOS - MEJORADO CON TOPES Y CLÍMAX
     */
    detectSetups() {
        const ipda = this.getIPDAStatus();
        const mss = this.checkMarketStructureShift();
        const sweep = this.checkLiquiditySweep();
        const currentPower = this.getDynamicPower();
        const currentNoise = this.getDynamicNoise();
        
        // --- INYECCIÓN QUIRÚRGICA: DETECCIÓN DE AGOTAMIENTO (TOPES) ---
        const exhaustion = this.isPriceExhausted();
        if (exhaustion === "TOP_EXHAUSTION") {
            return { name: "CLÍMAX ALCISTA", signal: "POTENCIAL_REVERSIÓN", action: "VENTA_TOP" };
        }
        if (exhaustion === "BOTTOM_EXHAUSTION") {
            return { name: "CLÍMAX BAJISTA", signal: "POTENCIAL_REVERSIÓN", action: "COMPRA_BOTTOM" };
        }

        // --- INYECCIÓN QUIRÚRGICA: PATRONES DE 3 VELAS (SEMI-FUERTE) ---
        const micro = this.checkMicroTrend();
        if (micro !== "LATENTE" && currentPower > 6) {
            return { name: "PATRÓN IMPULSO", signal: micro, action: "FOLLOW_TREND" };
        }

        // Lógica Original Venom/Zircon
        if (ipda.phase === "NY_OPEN_VENOM" && sweep && currentPower > 8) {
            return { name: "VENOM MODEL", signal: "HIGH_PROB", target: "50-80 Ticks" };
        }
        if (currentNoise < 20 && currentPower > 9 && this.isProtectedLevel()) {
            return { name: "ZIRCON MODEL", signal: "ULTRA_PRECISION", target: "Extreme Liquidity" };
        }
        if (ipda.phase.includes("OPEN") && currentPower > 7 && mss === "FAKE") {
            return { name: "JUDAS SWING", signal: "TRAP", action: "AVOID_OR_REVERSE" };
        }
        return null;
    },

    // 4. LÓGICA DE ESTRUCTURA - MANTENIDO
    checkMarketStructureShift() {
        if (typeof getMajorTrend !== 'function') return "CONTINUATION";
        const trend = getMajorTrend();
        const currentPower = this.getDynamicPower();
        
        if (trend === "BEARISH" && currentPower > 8.5) return "BULLISH_MSS";
        if (trend === "BULLISH" && currentPower > 8.5) return "BEARISH_MSS";
        return "CONTINUATION";
    },

    // 5. CÁLCULO DE CONFLUENCIA MAESTRA - MANTENIDO
    getSMCConfluenceScore() {
        let score = 0;
        const setup = this.detectSetups();
        const ipda = this.getIPDAStatus();
        
        if (setup) score += 10; 
        score *= ipda.power;    

        return score;
    },

    // --- AUXILIARES TÉCNICOS ---
    getDynamicPower() {
        const el = document.getElementById('power-index');
        return el ? parseFloat(el.innerText.replace('POWER: ', '')) : 0;
    },
    
    getDynamicNoise() {
        const el = document.getElementById('noise-index');
        return el ? parseFloat(el.innerText.replace('NOISE: ', '').replace('%', '')) : 0;
    },

    checkLiquiditySweep() { 
        if (typeof sequence === 'undefined' || sequence.length < 5) return false;
        return sequence.slice(-5).every(s => s.val === 'A') || sequence.slice(-5).every(s => s.val === 'B'); 
    },

    isProtectedLevel() { 
        if (typeof tradeHistory === 'undefined') return false;
        return tradeHistory.slice(-10).filter(t => !t.win).length < 2; 
    },

    isPremiumDiscount() {
        if (typeof chartData === 'undefined' || chartData.length === 0) return "NEUTRAL";
        const avg = chartData.reduce((a,b)=>a+b,0)/chartData.length;
        return chartData[chartData.length-1] > avg ? "PREMIUM" : "DISCOUNT";
    },

    // --- NUEVAS FUNCIONES DE ACTUALIZACIÓN (SUPER-IA v23) ---

    /**
     * Detecta impulsos de 3 velas (Tendencias semi-fuertes)
     */
    checkMicroTrend() {
        if (typeof sequence === 'undefined' || sequence.length < 3) return "LATENTE";
        const lastThree = sequence.slice(-3).map(s => s.val);
        if (lastThree.every(v => v === 'A')) return "MICRO_ALCISTA";
        if (lastThree.every(v => v === 'B')) return "MICRO_BAJISTA";
        return "LATENTE";
    },

    /**
     * Media Móvil Adaptativa de 3 periodos para detectar latido/fuerza
     */
    getMovingAverageBias() {
        if (typeof chartData === 'undefined' || chartData.length < 3) return 0;
        const lastThree = chartData.slice(-3);
        const ma3 = lastThree.reduce((a, b) => a + b, 0) / 3;
        return chartData[chartData.length - 1] - ma3; 
    },

    /**
     * DETECCIÓN DE AGOTAMIENTO CON MENSAJE VISUAL
     * Busca rachas de 7 velas y valida zona Premium/Discount
     */
    isPriceExhausted() {
        if (typeof sequence === 'undefined' || sequence.length < 7) return null;
        const lastSeven = sequence.slice(-7).map(s => s.val);
        const isTop = lastSeven.every(v => v === 'A');
        const isBottom = lastSeven.every(v => v === 'B');
        const pd = this.isPremiumDiscount();

        if (isTop && pd === "PREMIUM") {
            this.sendAlertToUI("⚠️ TOPE ALCISTA ALCANZADO", "var(--down-neon)");
            return "TOP_EXHAUSTION";
        }
        if (isBottom && pd === "DISCOUNT") {
            this.sendAlertToUI("⚠️ CAÍDA MÁXIMA ALCANZADA", "var(--up-neon)");
            return "BOTTOM_EXHAUSTION";
        }
        return null;
    },

    /**
     * Envía alertas directas al visor de detalles de la operación
     */
    sendAlertToUI(msg, color) {
        const opDetails = document.getElementById('operation-details');
        if (opDetails) {
            opDetails.innerHTML = `<span style="color: ${color}; font-weight: 800; animation: pulse-risk 1s infinite;">${msg}</span>`;
        }
        console.log(`%c[QUANTUM-SMC]: ${msg}`, `color: ${color}; font-weight: bold;`);
    },

    checkExpansion() {
        if (typeof chartData === 'undefined' || chartData.length < 5) return false;
        const lastFive = chartData.slice(-5);
        const range = Math.max(...lastFive) - Math.min(...lastFive);
        return range > 15;
    }
};