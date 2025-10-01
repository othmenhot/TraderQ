import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <Card className="w-full max-w-lg text-center">
            <CardHeader>
              <CardTitle className="text-destructive">Oops! Something went wrong.</CardTitle>
              <CardDescription>
                An unexpected error occurred in the application. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If the problem persists, please contact support.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
