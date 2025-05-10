
import React from 'react';
import GridDemo from '@/components/GridDemo';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary">Grid Engine Demo</h1>
          <p className="text-muted-foreground mt-2">
            Efficient grid rendering with Web Worker processing
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <section>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <GridDemo />
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-primary mb-2">Web Worker Processing</h3>
                <p className="text-muted-foreground">
                  Data operations run in a separate thread, keeping the UI responsive even with large datasets.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-primary mb-2">Cell Customization</h3>
                <p className="text-muted-foreground">
                  Control appearance with custom styles including fonts, colors, and highlighting.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-primary mb-2">Data Operations</h3>
                <p className="text-muted-foreground">
                  Sort, filter, and group data dynamically with minimal UI lag.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Grid Engine Demo &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
