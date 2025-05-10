
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { 
  GridSnapshot, 
  GridSnapshotJSON, 
  CustomGridProps,
  GridSort,
  GridFilter,
  GridGroup,
  GridColumn
} from '@/types/grid';
import CustomGrid from './CustomGrid';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicGrid: React.FC<CustomGridProps> = ({
  snapshotUrl,
  height,
  width,
  pageSize,
  onRowClick,
  onCellClick
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridSnapshot, setGridSnapshot] = useState<GridSnapshot | null>(null);
  
  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(snapshotUrl);
        if (!response.ok) {
          throw new Error(`Failed to load grid snapshot: ${response.statusText}`);
        }
        
        const jsonData: GridSnapshotJSON = await response.json();
        
        // Convert from JSON format to our internal GridSnapshot format
        const snapshot = convertJsonToGridSnapshot(jsonData);
        setGridSnapshot(snapshot);
        
      } catch (err) {
        console.error('Error loading grid snapshot:', err);
        setError(err instanceof Error ? err.message : String(err));
        toast.error('Failed to load grid data');
      } finally {
        setLoading(false);
      }
    };
    
    loadSnapshot();
  }, [snapshotUrl]);
  
  // Convert JSON format to our internal GridSnapshot format
  const convertJsonToGridSnapshot = (json: GridSnapshotJSON): GridSnapshot => {
    // Convert columns
    const columns: GridColumn[] = json.columns.map(col => ({
      field: col.field || col.name.toLowerCase().replace(/\s+/g, ''),
      header: col.name,
      width: col.width,
      sortable: true, // Default all columns to sortable
      filterable: true, // Default all columns to filterable
      groupable: true // Default all columns to groupable
    }));
    
    // Convert sorting if present
    let initialSort: GridSort[] | undefined = undefined;
    if (json.sorting) {
      initialSort = [{
        field: json.sorting.column.toLowerCase().replace(/\s+/g, ''),
        direction: json.sorting.order
      }];
    }
    
    // Convert filtering if present
    let initialFilter: GridFilter[] | undefined = undefined;
    if (json.filtering) {
      initialFilter = [{
        field: json.filtering.column.toLowerCase().replace(/\s+/g, ''),
        value: json.filtering.value,
        operator: json.filtering.operator || 'contains'
      }];
    }
    
    // Convert grouping if present
    let initialGroup: GridGroup[] | undefined = undefined;
    if (json.grouping) {
      initialGroup = [{
        field: json.grouping.toLowerCase().replace(/\s+/g, '')
      }];
    }
    
    // Convert cell styles if present
    let cellStyles: Record<string, any> = {};
    if (json.cellStyles) {
      cellStyles = Object.entries(json.cellStyles).reduce((styles, [key, value]) => {
        // Convert column names to field names if needed
        const fieldName = key.toLowerCase().replace(/\s+/g, '');
        
        // Apply styles to all cells in the column
        json.data.forEach((_, rowIndex) => {
          styles[`${rowIndex}:${fieldName}`] = value;
        });
        
        return styles;
      }, {} as Record<string, any>);
    }
    
    // Handle updates (highlighting) if present
    if (json.updates) {
      Object.entries(json.updates).forEach(([column, color]) => {
        const fieldName = column.toLowerCase().replace(/\s+/g, '');
        
        json.data.forEach((_, rowIndex) => {
          cellStyles[`${rowIndex}:${fieldName}`] = {
            ...cellStyles[`${rowIndex}:${fieldName}`],
            backgroundColor: color === 'red' ? '#FFDEE2' : color,
            highlight: true
          };
        });
      });
    }
    
    return {
      columns,
      data: json.data,
      initialSort,
      initialFilter,
      initialGroup,
      cellStyles,
      defaultCellStyle: {
        fontSize: '14px',
        height: '40px',
        backgroundColor: '#ffffff',
        color: '#1A1F2C'
      }
    };
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  
  if (error || !gridSnapshot) {
    return (
      <div className="border border-destructive bg-destructive/10 rounded-md p-6 text-destructive">
        <h3 className="text-lg font-medium mb-2">Failed to load grid</h3>
        <p>{error || 'Unknown error occurred'}</p>
      </div>
    );
  }
  
  return (
    <CustomGrid
      snapshot={gridSnapshot}
      height={height}
      width={width}
      pageSize={pageSize}
      onRowClick={onRowClick}
      onCellClick={onCellClick}
    />
  );
};

export default DynamicGrid;
