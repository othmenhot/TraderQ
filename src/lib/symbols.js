export const SYMBOL_GROUPS = {
    "Stocks": ["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:TSLA", "NASDAQ:NVDA"],
    "Crypto": ["COINBASE:BTCUSD", "COINBASE:ETHUSD", "COINBASE:SOLUSD"],
    "Forex Major": ["OANDA:EURUSD", "OANDA:USDJPY", "OANDA:GBPUSD", "OANDA:USDCHF"],
    "Indices": ["FOREXCOM:SPXUSD", "FOREXCOM:NSXUSD", "FOREXCOM:US30"],
    "Commodities": ["OANDA:XAUUSD", "OANDA:XAGUSD", "TVC:USOIL"],
};

export const SYMBOLS = Object.values(SYMBOL_GROUPS).flat();

// Mocked prices for the simulator - keys must match the symbols above
export const MOCKED_PRICES = {
    // Stocks
    "NASDAQ:AAPL": 170.00,
    "NASDAQ:GOOGL": 140.00,
    "NASDAQ:TSLA": 180.50,
    "NASDAQ:NVDA": 125.75,
    // Crypto
    "COINBASE:BTCUSD": 68000,
    "COINBASE:ETHUSD": 3500,
    "COINBASE:SOLUSD": 165.70,
    // Forex
    "OANDA:EURUSD": 1.0750,
    "OANDA:USDJPY": 157.20,
    "OANDA:GBPUSD": 1.2650,
    "OANDA:USDCHF": 0.9010,
    // Indices
    "FOREXCOM:SPXUSD": 5250,   // S&P 500
    "FOREXCOM:NSXUSD": 18500,  // Nasdaq 100
    "FOREXCOM:US30": 39500,    // Dow Jones
    // Commodities
    "OANDA:XAUUSD": 2300.50,
    "OANDA:XAGUSD": 27.80,
    "TVC:USOIL": 78.50,
};
