import React, { useMemo, memo, CSSProperties } from 'react';
// @ts-expect-error react-window types issue
import { FixedSizeList as List } from 'react-window';
import { cn } from '@/utils/cn';

interface VirtualizedListProps<T> {
  items: T[];
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  height?: number;
  maxHeight?: number;
  overscan?: number;
  width?: string | number;
}

function VirtualizedListInner<T>({
  items,
  className,
  renderItem,
  itemHeight = 50,
  height = 400,
  maxHeight = 400,
  overscan = 5,
  width = '100%',
}: VirtualizedListProps<T>) {
  const containerHeight = useMemo(() => {
    const calculatedHeight = Math.min(height, maxHeight, items.length * itemHeight);
    return calculatedHeight > 0 ? calculatedHeight : height;
  }, [height, maxHeight, items.length, itemHeight]);

  // Row renderer pour react-window
  const Row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => (
        <div style={style} className='virtualized-list-row'>
          {renderItem(items[index], index)}
        </div>
      ),
    [items, renderItem]
  );

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-32 text-gray-500 dark:text-gray-400',
          className
        )}
      >
        Aucun élément à afficher
      </div>
    );
  }

  return (
    <div className={cn('virtualized-list-container', className)}>
      <List
        height={containerHeight}
        itemCount={items.length}
        itemSize={itemHeight}
        width={width}
        overscanCount={overscan}
        className='virtualized-list'
      >
        {Row}
      </List>
    </div>
  );
}

export const VirtualizedList = memo(VirtualizedListInner) as <T>(
  props: VirtualizedListProps<T>
) => JSX.Element;

// MemoizedList - Version simple sans virtualisation pour petites listes
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
