
import { useEffect, useRef, useState } from 'react';
import { GridData, GridRequest, GridResponse, GridSnapshot } from '../types/grid';

// Custom hook to interact with the grid worker
export const useGridWorker = (initialSnapshot: GridSnapshot) => {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState<GridData>({ rows: [], totalRows: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);

  // Initialize the worker
  useEffect(() => {
    // Create a new worker
    const worker = new Worker(new URL('../workers/gridWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    // Set up message handling
    worker.onmessage = (event: MessageEvent<GridResponse | { action: 'ready' }>) => {
      const response = event.data;
      
      // Handle worker ready message
      if (response.action === 'ready') {
        setIsReady(true);
        return;
      }
      
      // Handle grid responses
      if ('data' in response) {
        setData(response.data);
        if (response.processingTime) {
          setProcessingTime(response.processingTime);
        }
        setLoading(false);
      }
    };

    // Handle worker errors
    worker.onerror = (error) => {
      console.error('Grid worker error:', error);
      setError(new Error(`Worker error: ${error.message}`));
      setLoading(false);
    };

    // Clean up worker on unmount
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Initialize grid with snapshot once worker is ready
  useEffect(() => {
    if (isReady && workerRef.current) {
      initializeGrid(initialSnapshot);
    }
  }, [isReady, initialSnapshot]);

  // Initialize the grid with snapshot
  const initializeGrid = (snapshot: GridSnapshot) => {
    const request: GridRequest = {
      action: 'init',
      data: snapshot.data,
      sort: snapshot.initialSort,
      filter: snapshot.initialFilter,
      group: snapshot.initialGroup,
      cellUpdates: snapshot.cellUpdates
    };
    
    sendToWorker(request);
  };

  // Sort the grid
  const sortGrid = (field: string, direction: 'asc' | 'desc' | null) => {
    const request: GridRequest = {
      action: 'sort',
      sort: [{ field, direction }]
    };
    
    sendToWorker(request);
  };

  // Filter the grid
  const filterGrid = (field: string, value: string, operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan') => {
    const request: GridRequest = {
      action: 'filter',
      filter: [{ field, value, operator }]
    };
    
    sendToWorker(request);
  };

  // Group the grid
  const groupGrid = (field: string) => {
    const request: GridRequest = {
      action: 'group',
      group: [{ field }]
    };
    
    sendToWorker(request);
  };

  // Update cells
  const updateCells = (cellUpdates: { rowIndex: number, field: string, highlight?: boolean }[]) => {
    const request: GridRequest = {
      action: 'update',
      cellUpdates
    };
    
    sendToWorker(request);
  };

  // Helper to send requests to the worker
  const sendToWorker = (request: GridRequest) => {
    if (workerRef.current) {
      setLoading(true);
      workerRef.current.postMessage(request);
    } else {
      setError(new Error('Worker not available'));
    }
  };

  return {
    data,
    loading,
    error,
    processingTime,
    sortGrid,
    filterGrid,
    groupGrid,
    updateCells,
    initializeGrid
  };
};

export default useGridWorker;
