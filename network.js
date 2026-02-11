// network.js - Gestión de datos Real-Time vía WebSockets | OPTIMIZADO v23
const MarketBridge = {
    socket: null,
    endpoint: "wss://stream.binance.com:9443/ws/btcusdt@aggTrade",
    
    lastProcessTime: 0,
    throttleMS: 1500, 
    isPaused: false,

    init() {
        // Cerramos cualquier conexión previa para evitar duplicidad de hilos
        if (this.socket) {
            this.socket.close();
        }

        try {
            this.socket = new WebSocket(this.endpoint);
            
            this.socket.onmessage = (event) => {
                if (this.isPaused) return;
                const data = JSON.parse(event.data);
                this.processTick(parseFloat(data.p));
            };

            this.socket.onerror = (err) => {
                console.error("📡 Error WebSocket:", err);
            };

            this.socket.onclose = () => {
                console.warn("📡 Conexión cerrada. Reintentando en 5s...");
                setTimeout(() => this.init(), 5000);
            };
            
            console.log("📡 Conexión con Binance establecida.");
        } catch (e) {
            console.error("Error al iniciar Network:", e);
        }
    },

    processTick(price) {
        const now = Date.now();
        
        // --- Cálculo de Energía del Mercado (V-FAST) ---
        const timeDiff = now - (window.lastDataTimestamp || now); 
        window.marketEnergy = Math.min(10, Math.max(1, 1000 / (timeDiff + 1))); 
        window.lastDataTimestamp = now;

        // Filtro de fluidez: Evita saturar el procesador con trades milisegundos
        if (now - this.lastProcessTime < this.throttleMS) return;
        this.lastProcessTime = now;

        this.syncSystem(price);
    },

    syncSystem(price) {
        // --- CORRECCIÓN REALIZADA: Usamos Date.now() directamente para evitar ReferenceError ---
        const currentMS = Date.now() - window.lastDataTimestamp;

        // 1. Sincronía con UI Analytics
        if (typeof updateAnalyticUI === 'function') {
            updateAnalyticUI(
                (window.marketEnergy * 5), // Cálculo de ruido basado en energía
                window.marketEnergy, 
                currentMS,                 // <--- Corregido
                window.sequence || [], 
                window.majorTrend || "NEUTRAL"
            );
        }

        // 2. Renderizado de Precio en Pantalla
        const priceDisplay = document.getElementById('price-display');
        if (priceDisplay) {
            priceDisplay.innerText = price.toFixed(2);
            // Efecto visual: Si la energía es > 7 (volatilidad alta), el precio brilla en rojo neón
            priceDisplay.style.color = window.marketEnergy > 7 ? 'var(--down-neon)' : 'var(--text-main)';
        }

        // 3. Puente con el Engine Gráfico (Canvas Flow)
        if (typeof renderFrame === 'function') {
            renderFrame(price);
        }
    }
};

// Arrancamos con un pequeño delay para asegurar que el DOM esté listo
setTimeout(() => MarketBridge.init(), 1000);