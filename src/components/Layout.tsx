import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component
 * Main layout wrapper for the application
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Productivity Quest
              </h1>
              <p className="text-sm text-muted-foreground">
                Level up your productivity, one task at a time
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* You can add navigation or user menu here */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with Electron, React, TypeScript, and SQLite
          </p>
        </div>
      </footer>
    </div>
  );
}
