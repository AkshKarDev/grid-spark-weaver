
// Web Worker for grid data processing
// This handles heavy computations off the main thread

type SortDirection = 'asc' | 'desc' | null;

export interface GridColumn {
  field: string;
  header: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
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

// Set up the worker context
const ctx: Worker = self as any;

// Data storage for the worker
let gridData: Record<string, any>[] = [];
let sortedData: Record<string, any>[] = [];
let currentSort: GridSort[] = [];
let currentFilter: GridFilter[] = [];
let currentGroup: GridGroup[] = [];

// Helper for sorting
const sortData = (data: Record<string, any>[], sorts: GridSort[]): Record<string, any>[] => {
  if (!sorts.length) return [...data];
  
  return [...data].sort((a, b) => {
    for (const sort of sorts) {
      const { field, direction } = sort;
      
      if (direction === null) continue;
      
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA === valueB) continue;
      
      const compareResult = valueA < valueB ? -1 : 1;
      return direction === 'asc' ? compareResult : -compareResult;
    }
    
    return 0;
  });
};

// Helper for filtering
const filterData = (data: Record<string, any>[], filters: GridFilter[]): Record<string, any>[] => {
  if (!filters.length) return data;
  
  return data.filter(row => {
    return filters.every(filter => {
      const { field, value, operator } = filter;
      const cellValue = String(row[field] || '').toLowerCase();
      const filterValue = String(value).toLowerCase();
      
      switch (operator) {
        case 'contains':
          return cellValue.includes(filterValue);
        case 'equals':
          return cellValue === filterValue;
        case 'startsWith':
          return cellValue.startsWith(filterValue);
        case 'endsWith':
          return cellValue.endsWith(filterValue);
        case 'greaterThan':
          return Number(cellValue) > Number(filterValue);
        case 'lessThan':
          return Number(cellValue) < Number(filterValue);
        default:
          return true;
      }
    });
  });
};

// Helper for grouping
const groupData = (data: Record<string, any>[], groups: GridGroup[]): Record<string, any>[] => {
  if (!groups.length) return data;
  
  const result: Record<string, any>[] = [];
  const groupField = groups[0].field;
  
  // Get unique values for the group field
  const groupValues = [...new Set(data.map(row => row[groupField]))];
  
  // Add group headers and child rows
  groupValues.forEach(groupValue => {
    // Add group header row
    const groupRows = data.filter(row => row[groupField] === groupValue);
    
    result.push({
      isGroupHeader: true,
      groupField,
      groupValue,
      childCount: groupRows.length,
      expanded: true,
      level: 0,
    });
    
    // Add child rows
    if (groups.length > 1) {
      // Handle nested groups (recursive)
      const nestedGroups = [...groups];
      nestedGroups.shift(); // Remove first group
      const groupedChildren = groupData(groupRows, nestedGroups);
      
      // Adjust level for nested groups
      groupedChildren.forEach(row => {
        if (row.isGroupHeader) {
          row.level = (row.level || 0) + 1;
        }
        result.push(row);
      });
    } else {
      groupRows.forEach(row => {
        result.push({ ...row, groupParent: groupValue, level: 1 });
      });
    }
  });
  
  return result;
};

// Process grid data
const processGridData = (request: GridRequest): GridResponse => {
  const startTime = performance.now();
  
  // Initialization or update the data if provided
  if (request.data) {
    gridData = [...request.data];
  }
  
  // Store current state
  if (request.sort) currentSort = request.sort;
  if (request.filter) currentFilter = request.filter;
  if (request.group) currentGroup = request.group;
  
  // Apply operations in sequence: filter -> sort -> group
  let processedData = [...gridData];
  
  // Apply filters
  processedData = filterData(processedData, currentFilter);
  
  // Apply sorts
  processedData = sortData(processedData, currentSort);
  
  // Apply grouping
  processedData = groupData(processedData, currentGroup);
  
  // Handle pagination if needed
  let resultData = [...processedData];
  if (request.pageSize && request.page !== undefined) {
    const startIndex = request.page * request.pageSize;
    resultData = processedData.slice(startIndex, startIndex + request.pageSize);
  }
  
  // Calculate processing time
  const endTime = performance.now();
  
  return {
    action: request.action,
    data: {
      rows: resultData,
      totalRows: processedData.length
    },
    processingTime: endTime - startTime
  };
};

// Handle messages from the main thread
ctx.addEventListener('message', (event: MessageEvent<GridRequest>) => {
  const request = event.data;
  const response = processGridData(request);
  
  // Process cell updates if needed
  if (request.action === 'update' && request.cellUpdates) {
    // Apply cell updates logic here
    // This could involve modifying cell values or adding highlight flags
  }
  
  // Send the response back to the main thread
  ctx.postMessage(response);
});

// Let the main thread know the worker is ready
ctx.postMessage({ action: 'ready' });

