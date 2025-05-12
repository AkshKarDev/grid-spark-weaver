
import React from 'react';
import CustomGridRow from './CustomGridRow';
import { GridColumn, CellStyle } from '@/types/grid';
import { Inbox } from 'lucide-react';

interface CustomGridBodyProps {
  rows: Record<string, any>[];
  columns: GridColumn[];
  cellStyles?: Record<string, CellStyle>;
  defaultCellStyle?: CellStyle;
  onRowClick?: (row: Record<string, any>) => void;
  onCellClick?: (row: Record<string, any>, field: string) => void;
}

const CustomGridBody: React.FC<CustomGridBodyProps> = ({
  rows,
  columns,
  cellStyles = {},
  defaultCellStyle = {},
  onRowClick,
  onCellClick
}) => {
  if (rows.length === 0) {
    return (
      <div className="custom-grid-no-data flex flex-col items-center justify-center p-12 text-muted-foreground">
        <Inbox className="h-12 w-12 mb-3 text-muted-foreground/60" />
        <div className="text-center">
          <p className="text-lg font-medium">No data to display</p>
          <p className="text-sm mt-1">Try changing your filters or adding new records</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-grid-body w-full">
      {rows.map((row, index) => (
        <CustomGridRow
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

export default CustomGridBody;
