import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { initDatabase, seedDatabase } from './services/database';

/**
 * Main App component
 * Initializes the database and renders the dashboard
 */
function App() {
  useEffect(() => {
    // Initialize database on app load
    try {
      initDatabase();
      seedDatabase(); // Pre-populate with example data
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }, []);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
