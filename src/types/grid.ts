
// Grid engine types

export type SortDirection = 'asc' | 'desc' | null;

export interface GridColumn {
  field: string;
  header: string;
  name?: string; // Added for compatibility
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  cellStyle?: CellStyle;
}

export interface GridSort {
  field: string;
  direction: SortDirection;
  column?: string; // Added for compatibility
  order?: 'asc' | 'desc'; // Added for compatibility
}

export interface GridFilter {
  field: string;
  value: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  column?: string; // Added for compatibility
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

// New interface to match the specific JSON format shown
export interface GridSnapshotJSON {
  columns: Array<{
    name: string;
    width?: number;
    field?: string;
  }>;
  data: Record<string, any>[];
  sorting?: {
    column: string;
    order: 'asc' | 'desc';
  };
  filtering?: {
    column: string;
    value: string;
    operator?: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  };
  grouping?: string;
  cellStyles?: Record<string, CellStyle>;
  updates?: Record<string, string>;
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

// New interface for our custom grid component that accepts GridSnapshotJSON
export interface CustomGridProps {
  snapshotUrl: string;
  height?: string | number;
  width?: string | number;
  pageSize?: number;
  onRowClick?: (row: Record<string, any>) => void;
  onCellClick?: (row: Record<string, any>, field: string) => void;
}
