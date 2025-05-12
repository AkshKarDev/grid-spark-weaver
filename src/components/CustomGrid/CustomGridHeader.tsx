
import React from 'react';
import { ArrowDown, ArrowUp, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GridColumn, GridSort } from '@/types/grid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface CustomGridHeaderProps {
  columns: GridColumn[];
  sorts: GridSort[];
  onSort: (field: string, direction: 'asc' | 'desc' | null) => void;
  onFilter: (field: string, value: string, operator: 'contains' | 'equals' | 'startsWith' | 'endsWith') => void;
  onGroup: (field: string) => void;
}

const CustomGridHeader: React.FC<CustomGridHeaderProps> = ({
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
    <div className="custom-grid-header flex w-full bg-muted/40 border-b border-border sticky top-0 z-10">
      {columns.map((column) => (
        <div
          key={column.field || column.name.toLowerCase().replace(/\s+/g, '')}
          className="custom-grid-header-cell relative"
          style={{ 
            width: column.width || 150, 
            minWidth: column.width || 150
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div 
              className={cn(
                "flex items-center gap-2 flex-1 font-medium text-sm",
                "cursor-pointer hover:text-primary transition-colors"
              )}
              onClick={() => toggleSort(column.field || column.name.toLowerCase().replace(/\s+/g, ''))}
            >
              <span>{column.header || column.name}</span>
              {getSortDirection(column.field || column.name.toLowerCase().replace(/\s+/g, '')) === 'asc' && (
                <ArrowUp className="h-3.5 w-3.5 text-primary" />
              )}
              {getSortDirection(column.field || column.name.toLowerCase().replace(/\s+/g, '')) === 'desc' && (
                <ArrowDown className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
              
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none hover:bg-accent hover:text-accent-foreground p-1 rounded-md transition-colors">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Filter Options
                </div>
                <DropdownMenuItem 
                  onClick={() => onFilter(column.field || column.name.toLowerCase().replace(/\s+/g, ''), '', 'contains')}
                >
                  Contains...
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onFilter(column.field || column.name.toLowerCase().replace(/\s+/g, ''), '', 'equals')}
                >
                  Equals...
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onFilter(column.field || column.name.toLowerCase().replace(/\s+/g, ''), '', 'startsWith')}
                >
                  Starts With...
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Grouping
                </div>
                <DropdownMenuItem onClick={() => onGroup(column.field || column.name.toLowerCase().replace(/\s+/g, ''))}>
                  Group by {column.header || column.name}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Column resizer - to be implemented later */}
          <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-border/50 hover:bg-primary/50 transition-colors" />
        </div>
      ))}
    </div>
  );
};

export default CustomGridHeader;
