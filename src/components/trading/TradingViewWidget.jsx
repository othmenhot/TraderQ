import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol, theme = 'light' }) {
  const container = useRef();

  useEffect(() => {
    container.current.innerHTML = ''; // Clear previous widget on symbol or theme change

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Use JSON.stringify for robust settings generation
    const widgetConfig = {
      "autosize": true,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    container.current.appendChild(script);

  }, [symbol, theme]); // Re-run effect if symbol or theme changes

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }} />
  );
}

export default memo(TradingViewWidget);
