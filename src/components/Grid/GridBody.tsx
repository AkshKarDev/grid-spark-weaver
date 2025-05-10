
import React from 'react';
import GridRow from './GridRow';
import { GridColumn, CellStyle } from '@/types/grid';

interface GridBodyProps {
  rows: Record<string, any>[];
  columns: GridColumn[];
  cellStyles?: Record<string, CellStyle>;
  defaultCellStyle?: CellStyle;
  onRowClick?: (row: Record<string, any>) => void;
  onCellClick?: (row: Record<string, any>, field: string) => void;
}

const GridBody: React.FC<GridBodyProps> = ({
  rows,
  columns,
  cellStyles = {},
  defaultCellStyle = {},
  onRowClick,
  onCellClick
}) => {
  if (rows.length === 0) {
    return (
      <div className="grid-no-data flex items-center justify-center p-8 text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="grid-body w-full">
      {rows.map((row, index) => (
        <GridRow
          key={index}
          row={row}
          columns={columns}
          index={index}
          cellStyles={cellStyles}
          defaultCellStyle={defaultCellStyle}
          onRowClick={onRowClick}
          onCellClick={onCellClick}
        />
      ))}
    </div>
  );
};

export default GridBody;
