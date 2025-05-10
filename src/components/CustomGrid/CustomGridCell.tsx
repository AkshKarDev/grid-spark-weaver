
import React from 'react';
import { cn } from '@/lib/utils';
import { CellStyle } from '@/types/grid';

interface CustomGridCellProps {
  value: any;
  field: string;
  style?: CellStyle;
  onClick?: () => void;
}

const CustomGridCell: React.FC<CustomGridCellProps> = ({
  value,
  field,
  style = {},
  onClick
}) => {
  // Apply cell styling
  const cellStyle: React.CSSProperties = {
    fontSize: style.fontSize,
    height: style.height,
    backgroundColor: style.backgroundColor,
    fontWeight: style.fontWeight || 'normal',
    color: style.color,
    borderColor: style.borderColor,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '8px 16px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  // Handle null or undefined values
  const displayValue = value === null || value === undefined ? '' : String(value);

  return (
    <div 
      className={cn(
        'custom-grid-cell border-b border-border',
        style.highlight ? 'animate-pulse' : ''
      )}
      style={cellStyle}
      onClick={onClick}
      data-field={field}
    >
      {displayValue}
    </div>
  );
};

export default CustomGridCell;
