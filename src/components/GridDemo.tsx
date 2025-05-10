
import React from 'react';
import DynamicGrid from './CustomGrid/DynamicGrid';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

const GridDemo: React.FC = () => {
  // Handle row click
  const handleRowClick = (row: Record<string, any>) => {
    // Don't show toast for group headers
    if (row.isGroupHeader) return;
    
    toast(`Row clicked: ${row.Name || row.name}`);
  };
  
  // Handle cell click
  const handleCellClick = (row: Record<string, any>, field: string) => {
    // Don't show toast for group headers
    if (row.isGroupHeader) return;
    
    toast(`Cell clicked: ${field} = ${row[field]}`);
  };

  // Demo function to update the GridSnapshot.json
  const handleUpdateGridData = () => {
    toast.info('This would update the GridSnapshot.json file');
    // In a real application, this would make an API call to update the JSON file
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-1">Dynamic Grid Demo</h2>
          <p className="text-sm text-muted-foreground">
            Grid controlled by GridSnapshot.json
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleUpdateGridData}
          >
            Update Grid Data
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md p-4 bg-card">
        <DynamicGrid 
          snapshotUrl="/mock/gridSnapshot.json"
          height="600px"
          onRowClick={handleRowClick}
          onCellClick={handleCellClick}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> This grid is defined and controlled by the GridSnapshot.json file.
          The grid definitions, data, styling, sorting, filtering, and grouping are all configured in the JSON file.
        </p>
      </div>
    </div>
  );
};

export default GridDemo;
