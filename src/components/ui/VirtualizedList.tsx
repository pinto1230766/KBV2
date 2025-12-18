import React, { useMemo, memo } from 'react';
import { cn } from '@/utils/cn';
import '@/styles/VirtualizedList.css';

interface VirtualizedListProps<T> {
  items: T[];
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  height?: number;
  maxHeight?: number;
  overscan?: number;
}

function VirtualizedListInner<T>({
  items,
  className,
  renderItem,
  itemHeight = 50,
  height = 400,
  maxHeight = 400,
}: VirtualizedListProps<T>) {
  const containerHeight = useMemo(() => {
    const calculatedHeight = Math.min(height, maxHeight, items.length * itemHeight);
    return calculatedHeight > 0 ? calculatedHeight : height;
  }, [height, maxHeight, items.length, itemHeight]);

  // Add a class to the document body when the component mounts
  React.useEffect(() => {
    document.body.classList.add('has-virtualized-list');
    return () => {
      document.body.classList.remove('has-virtualized-list');
    };
  }, []);

  if (items.length === 0) {
    return <div className={cn('virtualized-list-empty', className)}>Aucun élément à afficher</div>;
  }

  return (
    <div className={cn('virtualized-list', className)}>
      <div className='virtualized-list-container'>
        <div className='virtualized-list-content' data-container-height={containerHeight}>
          {items.map((item, index) => (
            <div
              key={index}
              className='virtualized-list-row'
              data-item-height={itemHeight}
              data-item-top={index * itemHeight}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const VirtualizedList = memo(VirtualizedListInner);

function MemoizedListInner<T extends Record<string, any>>({
  items,
  className,
  renderItem,
  keyExtractor,
}: {
  items: T[];
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
}) {
  const Row = useMemo(
    () =>
      ({ item, index }: { item: T; index: number }) => (
        <div className='px-2'>{renderItem(item, index)}</div>
      ),
    [renderItem]
  );

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-32 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg',
          className
        )}
      >
        Aucun élément à afficher
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800',
        className
      )}
    >
      <div className='space-y-1 p-2'>
        {items.map((item, index) => (
          <Row key={keyExtractor ? keyExtractor(item, index) : index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export const MemoizedList = memo(MemoizedListInner);

// Hook pour optimiser les performances de rendu
export function useVirtualizedItems<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  keyExtractor: (item: T, index: number) => string
) {
  return useMemo(
    () => ({
      items,
      renderItem,
      keyExtractor,
    }),
    [items, renderItem, keyExtractor]
  );
}

export default VirtualizedList;
