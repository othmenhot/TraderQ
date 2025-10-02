import React, { useEffect, useRef, memo } from 'react';

const TradingViewWidget = memo(({ symbol }) => {
  const container = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    // Define the widget creation function first, so it's always in scope.
    const createWidget = () => {
      if (!container.current) return;
      
      // Clear any previous widget to prevent duplicates
      container.current.innerHTML = '';
      
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        allow_symbol_change: false,
        container_id: container.current.id,
      });
    };

    // Check if the TradingView script is already loaded.
    if (window.TradingView) {
      createWidget();
    } else {
      // If not, create and load the script.
      // This part will only run once in the component's lifecycle.
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = createWidget; // Assign the defined function to onload
      document.head.appendChild(script);
    }

  }, [symbol]); // Re-run the effect when the symbol changes

  return (
    <div id="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }} />
  );
});

export default TradingViewWidget;
