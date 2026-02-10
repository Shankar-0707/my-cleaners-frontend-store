import { Search, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ServiceType } from '@/lib/mockData';

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  serviceFilter: ServiceType | 'all';
  onServiceChange: (service: ServiceType | 'all') => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onClearFilters: () => void;
}

export const FiltersBar = ({
  searchQuery,
  onSearchChange,
  serviceFilter,
  onServiceChange,
  onClearFilters,
}: FiltersBarProps) => {
  const hasFilters = searchQuery || serviceFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Picker Placeholder */}
      <Button variant="outline" className="gap-2">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">Date Range</span>
      </Button>

      {/* Service Type Filter */}
      <Select
        value={serviceFilter}
        onValueChange={(value) => onServiceChange(value as ServiceType | 'all')}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Service Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Services</SelectItem>
          <SelectItem value="laundry">Laundry</SelectItem>
          <SelectItem value="dryclean">Dry Clean</SelectItem>
          <SelectItem value="home_cleaning">Home Cleaning</SelectItem>
        </SelectContent>
      </Select>

      {/* Search Input */}
      <div className="relative flex-1 min-w-[250px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-1 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};
