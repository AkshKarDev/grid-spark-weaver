
import React from 'react';
import { cn } from '@/lib/utils';
import GridCell from './GridCell';
import { CellStyle, GridColumn } from '@/types/grid';

interface GridRowProps {
  row: Record<string, any>;
  columns: GridColumn[];
  index: number;
  cellStyles?: Record<string, CellStyle>;
  defaultCellStyle?: CellStyle;
  onRowClick?: (row: Record<string, any>) => void;
  onCellClick?: (row: Record<string, any>, field: string) => void;
}

const GridRow: React.FC<GridRowProps> = ({
  row,
  columns,
  index,
  cellStyles = {},
  defaultCellStyle = {},
  onRowClick,
  onCellClick
}) => {
  const isGroupHeader = row.isGroupHeader;
  const isEven = index % 2 === 0;
  
  const handleRowClick = () => {
    if (onRowClick) onRowClick(row);
  };
  
  const handleCellClick = (field: string) => {
    if (onCellClick) onCellClick(row, field);
  };

  // For group headers, show a special row
  if (isGroupHeader) {
    const indent = row.level * 20; // Indentation based on group level
    
    return (
      <div 
        className={cn(
          "grid-row flex w-full group-header",
          "bg-accent hover:bg-accent/90 font-medium"
        )}
        onClick={handleRowClick}
      >
        <div 
          className="flex items-center px-3 py-2"
          style={{ paddingLeft: `${indent + 12}px` }}
        >
          <span className="mr-2">{row.expanded ? '▼' : '►'}</span>
          <span>{row.groupField}: {row.groupValue}</span>
          <span className="ml-2 text-muted-foreground">
            ({row.childCount} {row.childCount === 1 ? 'item' : 'items'})
          </span>
        </div>
      </div>
    );
  }
  
  // For regular rows, show the cells
  return (
    <div 
      className={cn(
        "grid-row flex w-full",
        isEven ? "bg-background" : "bg-muted/20",
        "hover:bg-accent/10 transition-colors"
      )}
      onClick={handleRowClick}
    >
      {columns.map((column) => {
        // Get cell style from: cell-specific style or column-specific style or default style
        const cellKey = `${index}:${column.field}`;
        const style = {
          ...defaultCellStyle,
          ...column.cellStyle,
          ...cellStyles[cellKey]
        };
        
        // For grouped rows, add indentation
        const indentStyle = row.level 
          ? { paddingLeft: `${(row.level * 20) + 12}px` }
          : {};
        
        return (
          <div 
            key={column.field}
            className="grid-cell-wrapper"
            style={{ 
              width: column.width || 150, 
              minWidth: column.width || 150,
              ...indentStyle
            }}
          >
            <GridCell
              value={row[column.field]}
              field={column.field}
              style={style}
              onClick={() => handleCellClick(column.field)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GridRow;
