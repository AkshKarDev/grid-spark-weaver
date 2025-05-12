
import React from 'react';
import { cn } from '@/lib/utils';
import CustomGridCell from './CustomGridCell';
import { CellStyle, GridColumn } from '@/types/grid';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CustomGridRowProps {
  row: Record<string, any>;
  columns: GridColumn[];
  index: number;
  cellStyles?: Record<string, CellStyle>;
  defaultCellStyle?: CellStyle;
  onRowClick?: (row: Record<string, any>) => void;
  onCellClick?: (row: Record<string, any>, field: string) => void;
}

const CustomGridRow: React.FC<CustomGridRowProps> = ({
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
          "custom-grid-row flex w-full group-header",
          "bg-accent/80 hover:bg-accent font-medium cursor-pointer transition-colors"
        )}
        onClick={handleRowClick}
      >
        <div 
          className="flex items-center px-4 py-3"
          style={{ paddingLeft: `${indent + 16}px` }}
        >
          {row.expanded ? 
            <ChevronDown className="h-4 w-4 mr-2 text-primary" /> : 
            <ChevronRight className="h-4 w-4 mr-2 text-primary" />
          }
          <span className="font-medium">{row.groupField}: </span>
          <span className="ml-1">{row.groupValue}</span>
          <span className="ml-2 text-muted-foreground text-xs px-2 py-0.5 bg-background/90 rounded-full">
            {row.childCount} {row.childCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>
    );
  }
  
  // For regular rows, show the cells
  return (
    <div 
      className={cn(
        "custom-grid-row flex w-full transition-colors cursor-pointer",
        isEven ? "bg-background" : "bg-muted/10",
        "hover:bg-accent/20"
      )}
      onClick={handleRowClick}
    >
      {columns.map((column) => {
        const field = column.field || column.name.toLowerCase().replace(/\s+/g, '');
        
        // Get cell style from: cell-specific style or column-specific style or default style
        const cellKey = `${index}:${field}`;
        const style = {
          ...defaultCellStyle,
          ...cellStyles[cellKey]
        };
        
        // For grouped rows, add indentation
        const indentStyle = row.level 
          ? { paddingLeft: `${(row.level * 20) + 16}px` }
          : {};
        
        return (
          <div 
            key={field}
            className="custom-grid-cell-wrapper"
            style={{ 
              width: column.width || 150, 
              minWidth: column.width || 150,
              ...indentStyle
            }}
          >
            <CustomGridCell
              value={row[field]}
              field={field}
              style={style}
              onClick={() => handleCellClick(field)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CustomGridRow;
