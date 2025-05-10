
import React from 'react';
import { cn } from '@/lib/utils';
import { CellStyle } from '@/types/grid';

interface GridCellProps {
  value: any;
  field: string;
  style?: CellStyle;
  isHeader?: boolean;
  onClick?: () => void;
}

const GridCell: React.FC<GridCellProps> = ({
  value,
  field,
  style = {},
  isHeader = false,
  onClick
}) => {
  // Apply cell styling
  const cellStyle: React.CSSProperties = {
    fontSize: style.fontSize,
    height: style.height,
    backgroundColor: style.backgroundColor,
    fontWeight: style.fontWeight || (isHeader ? 'bold' : 'normal'),
    color: style.color,
    borderColor: style.borderColor,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '8px 12px',
    transition: 'all 0.2s ease',
  };

  // Handle null or undefined values
  const displayValue = value === null || value === undefined ? '' : String(value);

  return (
    <div 
      className={cn(
        'grid-cell border-b',
        isHeader ? 'sticky top-0 z-10 bg-secondary' : '',
        style.highlight ? 'animate-pulse bg-yellow-100' : ''
      )}
      style={cellStyle}
      onClick={onClick}
      data-field={field}
    >
      {displayValue}
    </div>
  );
};

export default GridCell;
