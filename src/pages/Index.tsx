
import React from 'react';
import GridDemo from '@/components/GridDemo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DynamicGrid from '@/components/CustomGrid/DynamicGrid';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  // Handle row click for custom grid
  const handleRowClick = (row: Record<string, any>) => {
    if (row.isGroupHeader) return;
    toast(`Row clicked: ${row.Name || row.name}`);
  };
  
  // Handle cell click for custom grid
  const handleCellClick = (row: Record<string, any>, field: string) => {
    if (row.isGroupHeader) return;
    toast(`Cell clicked: ${field} = ${row[field]}`);
  };
  
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
            <Tabs defaultValue="original">
              <TabsList className="mb-4">
                <TabsTrigger value="original">Original Grid</TabsTrigger>
                <TabsTrigger value="dynamic">Dynamic JSON Grid</TabsTrigger>
              </TabsList>
              
              <TabsContent value="original" className="bg-white p-6 rounded-lg shadow-sm">
                <GridDemo />
              </TabsContent>
              
              <TabsContent value="dynamic" className="bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-1">JSON-Driven Grid</h2>
                    <p className="text-sm text-muted-foreground">
                      Grid controlled entirely by GridSnapshot.json
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <DynamicGrid
                      snapshotUrl="/mock/customGridSnapshot.json"
                      height="600px"
                      onRowClick={handleRowClick}
                      onCellClick={handleCellClick}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
                <h3 className="text-lg font-semibold text-primary mb-2">JSON Configuration</h3>
                <p className="text-muted-foreground">
                  Grid behavior and styling are controlled through a simple JSON format that can be updated dynamically.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-primary mb-2">Cell Customization</h3>
                <p className="text-muted-foreground">
                  Control appearance with custom styles including fonts, colors, and highlighting based on JSON configuration.
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
