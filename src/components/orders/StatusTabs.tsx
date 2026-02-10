import { OrderStatus } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export type StatusFilter = 'all' | OrderStatus;

interface StatusTabsProps {
  activeTab: StatusFilter;
  onTabChange: (tab: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
}

const tabs: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'pickup_assigned', label: 'Pickup Assigned' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready', label: 'Ready' },
  { value: 'drop_assigned', label: 'Drop Assigned' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const StatusTabs = ({ activeTab, onTabChange, counts }: StatusTabsProps) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
            activeTab === tab.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {tab.label}
          <span
            className={cn(
              'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs rounded-full',
              activeTab === tab.value
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {counts[tab.value] || 0}
          </span>
        </button>
      ))}
    </div>
  );
};
