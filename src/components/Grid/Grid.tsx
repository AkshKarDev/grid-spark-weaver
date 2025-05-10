
import React, { useState, useEffect, useCallback } from 'react';
import { useGridWorker } from '@/hooks/useGridWorker';
import { GridProps, GridSnapshot, GridSort, CellStyle } from '@/types/grid';
import GridHeader from './GridHeader';
import GridBody from './GridBody';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const Grid: React.FC<GridProps> = ({
  snapshot,
  height = '600px',
  width = '100%',
  pageSize = 100,
  onRowClick,
  onCellClick
}) => {
  const [gridSnapshot, setGridSnapshot] = useState<GridSnapshot>(snapshot);
  const [sorts, setSorts] = useState<GridSort[]>(snapshot.initialSort || []);
  const [cellStyleMap, setCellStyleMap] = useState<Record<string, CellStyle>>({});
  
  // Initialize the grid worker with the snapshot
  const { 
    data, 
    loading, 
    error, 
    processingTime,
    sortGrid,
    filterGrid, 
    groupGrid,
    updateCells,
    initializeGrid
  } = useGridWorker(gridSnapshot);

  // Update when the snapshot changes
  useEffect(() => {
    setGridSnapshot(snapshot);
    initializeGrid(snapshot);
    
    // Initialize cell styles from the snapshot
    const newCellStyles: Record<string, CellStyle> = {};
    
    if (snapshot.cellStyles) {
      Object.keys(snapshot.cellStyles).forEach(key => {
        newCellStyles[key] = snapshot.cellStyles![key];
      });
    }
    
    setCellStyleMap(newCellStyles);
  }, [snapshot]);

  // Handle sorting
  const handleSort = useCallback((field: string, direction: 'asc' | 'desc' | null) => {
    const newSorts = [{ field, direction }];
    setSorts(newSorts);
    sortGrid(field, direction);
  }, [sortGrid]);

  // Handle filtering
  const handleFilter = useCallback((field: string, value: string, operator: 'contains' | 'equals' | 'startsWith' | 'endsWith') => {
    // You could open a dialog/modal here to get the filter value
    const filterValue = prompt(`Enter filter value for ${field}:`, '');
    if (filterValue !== null) {
      filterGrid(field, filterValue, operator);
    }
  }, [filterGrid]);

  // Handle grouping
  const handleGroup = useCallback((field: string) => {
    groupGrid(field);
  }, [groupGrid]);

  // Render loading state
  if (loading && !data.rows.length) {
    return (
      <div 
        className="grid-container border rounded-md"
        style={{ width, height }}
      >
        <div className="grid-header-skeleton p-2 border-b">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="grid-body-skeleton p-4 space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div 
        className="grid-error border rounded-md bg-destructive/10 text-destructive p-4"
        style={{ width, height }}
      >
        <div className="font-semibold">Error loading grid data</div>
        <div>{error.message}</div>
      </div>
    );
  }

  return (
    <div 
      className="grid-container border rounded-md flex flex-col overflow-hidden"
      style={{ width, height }}
    >
      <GridHeader
        columns={gridSnapshot.columns}
        sorts={sorts}
        onSort={handleSort}
        onFilter={handleFilter}
        onGroup={handleGroup}
      />

      <ScrollArea className="flex-1">
        <GridBody
          rows={data.rows}
          columns={gridSnapshot.columns}
          cellStyles={cellStyleMap}
          defaultCellStyle={gridSnapshot.defaultCellStyle}
          onRowClick={onRowClick}
          onCellClick={onCellClick}
        />
      </ScrollArea>
      
      <div className="grid-footer p-2 text-xs text-muted-foreground border-t flex justify-between items-center">
        <span>
          {data.totalRows} row{data.totalRows !== 1 ? 's' : ''}
        </span>
        {processingTime > 0 && (
          <span>
            Processed in {processingTime.toFixed(2)}ms
          </span>
        )}
      </div>
    </div>
  );
};

export default Grid;
