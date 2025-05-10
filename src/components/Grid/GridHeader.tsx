
import React from 'react';
import { ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GridColumn, GridSort } from '@/types/grid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface GridHeaderProps {
  columns: GridColumn[];
  sorts: GridSort[];
  onSort: (field: string, direction: 'asc' | 'desc' | null) => void;
  onFilter: (field: string, value: string, operator: 'contains' | 'equals' | 'startsWith' | 'endsWith') => void;
  onGroup: (field: string) => void;
}

const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  sorts,
  onSort,
  onFilter,
  onGroup
}) => {
  // Get sort direction for a column
  const getSortDirection = (field: string): 'asc' | 'desc' | null => {
    const sort = sorts.find(s => s.field === field);
    return sort ? sort.direction : null;
  };

  // Toggle sort direction
  const toggleSort = (field: string) => {
    const currentDirection = getSortDirection(field);
    let newDirection: 'asc' | 'desc' | null;
    
    if (currentDirection === null) newDirection = 'asc';
    else if (currentDirection === 'asc') newDirection = 'desc';
    else newDirection = null;
    
    onSort(field, newDirection);
  };

  return (
    <div className="grid-header flex w-full bg-secondary border-b border-border">
      {columns.map((column) => (
        <div
          key={column.field}
          className={cn(
            "grid-header-cell flex items-center justify-between px-3 py-2 select-none",
            column.sortable && "cursor-pointer"
          )}
          style={{ 
            width: column.width || 150, 
            minWidth: column.width || 150,
            ...(column.cellStyle || {})
          }}
        >
          <div 
            className="flex items-center gap-2 flex-1"
            onClick={() => column.sortable && toggleSort(column.field)}
          >
            <span>{column.header}</span>
            {column.sortable && getSortDirection(column.field) === 'asc' && (
              <ArrowUp className="h-3 w-3" />
            )}
            {column.sortable && getSortDirection(column.field) === 'desc' && (
              <ArrowDown className="h-3 w-3" />
            )}
          </div>
            
          {(column.filterable || column.groupable) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {column.filterable && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => onFilter(column.field, '', 'contains')}
                    >
                      Filter Contains...
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onFilter(column.field, '', 'equals')}
                    >
                      Filter Equals...
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onFilter(column.field, '', 'startsWith')}
                    >
                      Filter Starts With...
                    </DropdownMenuItem>
                  </>
                )}
                
                {column.groupable && (
                  <DropdownMenuItem onClick={() => onGroup(column.field)}>
                    Group by {column.header}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  );
};

export default GridHeader;
