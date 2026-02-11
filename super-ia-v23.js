// super-ia-v23.js - Capa de Inteligencia Contextual | INTEGRACIÓN ULTRA-SMC 2026
const SuperIA = {
    // 1. CONFIGURACIÓN DINÁMICA
    config: {
        dnaLength: 5,           
        extremeSpeed: 450,      
        recencyBias: 1.4,       
        decayFactor: 0.6,
        // Configuración ICT 2026
        ipdaOffset: -5, // NY Time (EST)
        fvgThreshold: 2.5
    },

    /**
     * CAPA 1: DNA PATTERN MATCHING
     * Analiza si la secuencia actual de velas ha sido ganadora en el pasado
     */
    getDNAMatch() {
        if (sequence.length < this.config.dnaLength || tradeHistory.length < 3) return 0;
        const currentDNA = sequence.slice(-this.config.dnaLength).map(s => s.val).join('');
        let matches = 0; let success = 0;

        tradeHistory.forEach(trade => {
            if (trade.dna === currentDNA) {
                matches++;
                if (trade.win) success++;
            }
        });

        if (matches === 0) return 0;
        const ratio = success / matches;
        // Bono de confianza si el patrón es históricamente ganador
        return ratio > 0.6 ? 1.5 : (ratio < 0.4 ? -1.5 : 0);
    },

    /**
     * CAPA 2: SENTIMENT ANALYZER (VELOCIDAD)
     * Mide la agresividad institucional según la latencia de reacción (ms)
     */
    getSentiment(ms) {
        if (ms <= 0) return 0;
        if (ms < this.config.extremeSpeed) return 2.0; // Alta velocidad = Institucional entrando
        if (ms > 2000) return -1.0; // Lentitud = Indecisión/Retail
        return 0;
    },

    /**
     * CAPA 3: MOMENTUM BIAS
     * Ajusta la confianza según la racha actual (Anti-Rachas negativas)
     */
    getMomentum() {
        if (tradeHistory.length < 3) return 0;
        const lastThree = tradeHistory.slice(-3);
        const wins = lastThree.filter(t => t.win).length;
        if (wins === 3) return 1.0;  // Hot streak
        if (wins === 0) return -2.0; // Protección contra racha perdedora
        return 0;
    },

    /**
     * CAPA 4: INSTITUTIONAL CORE (SMC/ICT 2025-2026)
     * Conexión quirúrgica con el motor QuantumSMC
     */
    getInstitutionalScore(power) {
        let smcScore = 0;
        
        if (typeof QuantumSMC !== 'undefined') {
            // A. Confluencia Base de Modelos (Venom, Zircon, Judas)
            smcScore = QuantumSMC.getSMCConfluenceScore();
            
            // B. Capa de Expansión (Bono por Volatilidad Saludable)
            if (typeof QuantumSMC.checkExpansion === 'function' && QuantumSMC.checkExpansion()) {
                smcScore += 2.5;
            }

            // C. Filtro de Agotamiento (Penalización Anti-FOMO / Reversión)
            if (typeof QuantumSMC.isPriceExhausted === 'function' && QuantumSMC.isPriceExhausted()) {
                console.warn("⚠️ BLOQUEO POR AGOTAMIENTO: Movimiento sobre-extendido.");
                smcScore -= 7.0; // Penalización crítica para evitar comprar techos o vender suelos
            }

            // D. Filtro de PD Array Matrix (Smart Money Discipline)
            const currentTrend = (typeof getMajorTrend === 'function') ? getMajorTrend() : "NEUTRAL";
            const pdZone = QuantumSMC.isPremiumDiscount();
            
            // Penalización por operar en contra del valor (Premium/Discount)
            if (currentTrend === "BULLISH" && pdZone === "PREMIUM") smcScore -= 5.0;
            if (currentTrend === "BEARISH" && pdZone === "DISCOUNT") smcScore -= 5.0;

            // E. Zircon Model: Protected Levels (Bajo ruido + Alta potencia)
            const noise = (typeof QuantumSMC.getDynamicNoise === 'function') ? QuantumSMC.getDynamicNoise() : 0;
            if (noise < 20 && power > 8) {
                smcScore += 3.5; 
            }
        }

        return smcScore;
    },

    /**
     * PROCESADOR MAESTRO DE CONFLUENCIA v26
     * Neural + Psicología + Estructura Institucional
     * Este es el valor final que decide el Stake y la señal
     */
    calculateSuperScore(baseNeural, ms, power) {
        const dnaScore = this.getDNAMatch();
        const sentimentScore = this.getSentiment(ms);
        const momentumScore = this.getMomentum();
        const smcScore = this.getInstitutionalScore(power);

        // Ecuación Maestra v26: La suma de todas las capas de confluencia
        const totalScore = baseNeural + dnaScore + sentimentScore + momentumScore + smcScore;

        // Visualización detallada en consola para auditoría de trades
        console.table({
            "Neural Base": baseNeural.toFixed(2),
            "DNA Match": dnaScore,
            "Sentiment (Fuerza)": sentimentScore,
            "Momentum Bias": momentumScore,
            "SMC Core (ICT 26)": smcScore.toFixed(2),
            "RESULTADO FINAL": totalScore.toFixed(2)
        });

        return totalScore;
    }
};