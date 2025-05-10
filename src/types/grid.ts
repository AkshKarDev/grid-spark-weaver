
// Grid engine types

export type SortDirection = 'asc' | 'desc' | null;

export interface GridColumn {
  field: string;
  header: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  cellStyle?: CellStyle;
}

export interface GridSort {
  field: string;
  direction: SortDirection;
}

export interface GridFilter {
  field: string;
  value: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

export interface GridGroup {
  field: string;
}

export interface CellStyle {
  fontSize?: string;
  height?: string | number;
  backgroundColor?: string;
  fontWeight?: string;
  color?: string;
  borderColor?: string;
  highlight?: boolean;
}

export interface CellUpdate {
  rowIndex: number;
  field: string;
  highlight?: boolean;
}

export interface GridData {
  rows: Record<string, any>[];
  totalRows: number;
}

export interface GridSnapshot {
  columns: GridColumn[];
  data: Record<string, any>[];
  initialSort?: GridSort[];
  initialFilter?: GridFilter[];
  initialGroup?: GridGroup[];
  cellStyles?: Record<string, CellStyle>;
  cellUpdates?: CellUpdate[];
  defaultCellStyle?: CellStyle;
}

export interface GridRequest {
  action: 'init' | 'sort' | 'filter' | 'group' | 'update';
  data?: Record<string, any>[];
  sort?: GridSort[];
  filter?: GridFilter[];
  group?: GridGroup[];
  cellUpdates?: CellUpdate[];
  pageSize?: number;
  page?: number;
}

export interface GridResponse {
  action: 'init' | 'sort' | 'filter' | 'group' | 'update';
  data: GridData;
  processingTime?: number;
}

export interface GridProps {
  snapshot: GridSnapshot;
  height?: string | number;
  width?: string | number;
  pageSize?: number;
  onRowClick?: (row: Record<string, any>) => void;
  onCellClick?: (row: Record<string, any>, field: string) => void;
}
