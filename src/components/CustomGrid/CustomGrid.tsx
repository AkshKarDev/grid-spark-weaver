
import React, { useState, useEffect, useCallback } from 'react';
import { GridProps, GridSnapshot, GridSort, CellStyle } from '@/types/grid';
import CustomGridHeader from './CustomGridHeader';
import CustomGridBody from './CustomGridBody';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const CustomGrid: React.FC<GridProps> = ({
  snapshot,
  height = '600px',
  width = '100%',
  pageSize = 100,
  onRowClick,
  onCellClick
}) => {
  const [sorts, setSorts] = useState<GridSort[]>(snapshot.initialSort || []);
  const [data, setData] = useState<{ rows: Record<string, any>[], totalRows: number }>({ 
    rows: snapshot.data || [],
    totalRows: snapshot.data?.length || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [cellStyleMap, setCellStyleMap] = useState<Record<string, CellStyle>>({});
  
  // Initialize cell styles from the snapshot
  useEffect(() => {
    const newCellStyles: Record<string, CellStyle> = {};
    
    // Apply column-specific styles from cellStyles property
    if (snapshot.cellStyles) {
      // For each field with styling
      Object.entries(snapshot.cellStyles).forEach(([field, style]) => {
        // Apply to all cells in that column
        snapshot.data.forEach((_, rowIndex) => {
          const cellKey = `${rowIndex}:${field.toLowerCase().replace(/\s+/g, '')}`;
          newCellStyles[cellKey] = style;
        });
      });
    }
    
    // Apply updates (highlighting)
    if (snapshot.updates) {
      Object.entries(snapshot.updates).forEach(([field, color]) => {
        const fieldName = field.toLowerCase().replace(/\s+/g, '');
        
        snapshot.data.forEach((_, rowIndex) => {
          const cellKey = `${rowIndex}:${fieldName}`;
          newCellStyles[cellKey] = {
            ...newCellStyles[cellKey],
            backgroundColor: color === 'red' ? '#FFDEE2' : color,
            highlight: true
          };
        });
      });
    }
    
    setCellStyleMap(newCellStyles);
    
    // Initialize data
    setData({
      rows: snapshot.data || [],
      totalRows: snapshot.data?.length || 0
    });
    
    // Initialize sorting if present
    if (snapshot.initialSort) {
      setSorts(snapshot.initialSort);
    }
  }, [snapshot]);

  // Handle sorting
  const handleSort = useCallback((field: string, direction: 'asc' | 'desc' | null) => {
    const newSorts = [{ field, direction }];
    setSorts(newSorts);
    
    // Simple client-side sorting
    if (direction) {
      const sortedData = [...data.rows].sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        
        if (valueA === valueB) return 0;
        
        const comparison = valueA > valueB ? 1 : -1;
        return direction === 'asc' ? comparison : -comparison;
      });
      
      setData({
        rows: sortedData,
        totalRows: sortedData.length
      });
    }
  }, [data.rows]);

  // Handle filtering - simplified for demonstration
  const handleFilter = useCallback((field: string, value: string, operator: 'contains' | 'equals' | 'startsWith' | 'endsWith') => {
    // Simple client-side filtering
    if (value) {
      const filteredData = snapshot.data.filter(row => {
        const cellValue = String(row[field] || '').toLowerCase();
        const filterValue = value.toLowerCase();
        
        switch (operator) {
          case 'contains':
            return cellValue.includes(filterValue);
          case 'equals':
            return cellValue === filterValue;
          case 'startsWith':
            return cellValue.startsWith(filterValue);
          case 'endsWith':
            return cellValue.endsWith(filterValue);
          default:
            return true;
        }
      });
      
      setData({
        rows: filteredData,
        totalRows: filteredData.length
      });
    } else {
      // Reset to original data
      setData({
        rows: snapshot.data || [],
        totalRows: snapshot.data?.length || 0
      });
    }
  }, [snapshot.data]);

  // Handle grouping - simplified for demonstration
  const handleGroup = useCallback((field: string) => {
    // Create a map of groups
    const groupMap = new Map<string, any[]>();
    
    // Group the data
    snapshot.data.forEach(row => {
      const groupValue = String(row[field] || '');
      if (!groupMap.has(groupValue)) {
        groupMap.set(groupValue, []);
      }
      groupMap.get(groupValue)?.push(row);
    });
    
    // Convert to array with group headers
    const groupedData: Record<string, any>[] = [];
    
    groupMap.forEach((rows, groupValue) => {
      // Add group header
      groupedData.push({
        isGroupHeader: true,
        groupField: field,
        groupValue: groupValue,
        childCount: rows.length,
        expanded: true,
        level: 0
      });
      
      // Add child rows
      rows.forEach(row => {
        groupedData.push({
          ...row,
          level: 1
        });
      });
    });
    
    setData({
      rows: groupedData,
      totalRows: snapshot.data.length
    });
  }, [snapshot.data]);

  // Render loading state
  if (loading) {
    return (
      <div 
        className="custom-grid-container border rounded-md bg-background"
        style={{ width, height }}
      >
        <div className="custom-grid-header-skeleton px-4 py-3 border-b">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="custom-grid-body-skeleton p-4 space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div 
        className="custom-grid-error border rounded-md bg-destructive/10 p-6 flex flex-col items-center justify-center gap-4"
        style={{ width, height }}
      >
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <div className="font-semibold text-lg text-destructive mb-2">Error loading grid data</div>
          <div className="text-sm text-destructive/80">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="custom-grid-container border rounded-md flex flex-col overflow-hidden bg-background shadow-sm"
      style={{ width, height }}
    >
      <CustomGridHeader
        columns={snapshot.columns}
        sorts={sorts}
        onSort={handleSort}
        onFilter={handleFilter}
        onGroup={handleGroup}
      />

      <ScrollArea className="flex-1">
        <CustomGridBody
          rows={data.rows}
          columns={snapshot.columns}
          cellStyles={cellStyleMap}
          defaultCellStyle={snapshot.defaultCellStyle}
          onRowClick={onRowClick}
          onCellClick={onCellClick}
        />
      </ScrollArea>
      
      <div className="custom-grid-footer px-4 py-3 text-xs text-muted-foreground border-t flex justify-between items-center bg-muted/30">
        <span className="font-medium">
          {data.totalRows} {data.totalRows === 1 ? 'record' : 'records'}
        </span>
        {processingTime > 0 && (
          <span>
            Processed in <span className="font-mono">{processingTime.toFixed(2)}ms</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomGrid;
