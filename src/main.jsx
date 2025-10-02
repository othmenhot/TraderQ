import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ErrorBoundary } from 'react-error-boundary'; // Import from the library
import App from './App';
import './index.css';

// A simple fallback component to display when an error occurs
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4">
    <p>Something went wrong:</p>
    <pre className="text-red-500">{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // You could add logic here to reset the app's state if needed
          window.location.reload();
        }}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
