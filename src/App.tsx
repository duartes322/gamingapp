import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { initDatabase, seedDatabase } from './services/database';

/**
 * Main App component
 * Initializes the database and renders the dashboard
 */
function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize database on app load (async)
    async function init() {
      try {
        await initDatabase();
        seedDatabase(); // Pre-populate with example data
        console.log('App initialized successfully');
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true); // Show app anyway
      }
    }
    
    init();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Productivity Quest...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
