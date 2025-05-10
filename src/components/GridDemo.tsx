
import React, { useState, useEffect } from 'react';
import Grid from './Grid/Grid';
import { GridSnapshot } from '@/types/grid';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const GridDemo: React.FC = () => {
  const [snapshot, setSnapshot] = useState<GridSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch the grid snapshot from the mock data
    fetch('/mock/gridSnapshot.json')
      .then(response => response.json())
      .then((data: GridSnapshot) => {
        setSnapshot(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading grid snapshot:', error);
        setLoading(false);
      });
  }, []);
  
  // Handle row click
  const handleRowClick = (row: Record<string, any>) => {
    // Don't show toast for group headers
    if (row.isGroupHeader) return;
    
    toast(`Row clicked: ${row.name}`);
  };
  
  // Handle cell click
  const handleCellClick = (row: Record<string, any>, field: string) => {
    // Don't show toast for group headers
    if (row.isGroupHeader) return;
    
    toast(`Cell clicked: ${field} = ${row[field]}`);
  };
  
  // Handle highlighting updates
  const handleHighlightSalaries = () => {
    if (!snapshot) return;
    
    // Create a copy of the snapshot
    const newSnapshot = { ...snapshot };
    
    // Add highlighted cells for engineers with high salaries
    const cellStyles = { ...snapshot.cellStyles } || {};
    
    snapshot.data.forEach((row, index) => {
      if (row.department === 'Engineering' && row.salary > 100000) {
        const cellKey = `${index}:salary`;
        cellStyles[cellKey] = {
          backgroundColor: '#FEF7CD',
          fontWeight: '700',
          highlight: true
        };
      }
    });
    
    newSnapshot.cellStyles = cellStyles;
    setSnapshot(newSnapshot);
    
    toast('Highlighted high salaries for Engineering department');
  };
  
  // Reset highlighting
  const handleResetHighlighting = () => {
    if (!snapshot) return;
    
    // Fetch the original snapshot
    fetch('/mock/gridSnapshot.json')
      .then(response => response.json())
      .then((data: GridSnapshot) => {
        setSnapshot(data);
        toast('Reset all highlighting');
      })
      .catch(error => {
        console.error('Error loading grid snapshot:', error);
      });
  };

  if (loading || !snapshot) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg font-medium">Loading grid data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-1">Employee Data Grid</h2>
          <p className="text-sm text-muted-foreground">
            Interactive grid with Web Worker processing
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleHighlightSalaries}
          >
            Highlight High Salaries
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleResetHighlighting}
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md p-4 bg-card">
        <Grid 
          snapshot={snapshot}
          height="600px"
          onRowClick={handleRowClick}
          onCellClick={handleCellClick}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Tips:</strong> Click column headers to sort, click the filter icon for more options. 
          Try grouping by department or other fields.
        </p>
      </div>
    </div>
  );
};

export default GridDemo;
