import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Issue } from './IssueCard';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  searchQuery: string;
  activeFilters: FilterOptions;
}

export interface FilterOptions {
  categories: string[];
  statuses: Issue['status'][];
  dateRange?: {
    start: string;
    end: string;
  };
}

const categories = [
  'Roads & Infrastructure',
  'Street Lighting',
  'Sanitation & Waste',
  'Water Supply',
  'Traffic & Transportation',
  'Public Safety',
  'Parks & Recreation',
  'Other'
];

const statuses: { value: Issue['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

export const SearchAndFilter = ({ 
  onSearch, 
  onFilter, 
  searchQuery, 
  activeFilters 
}: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(activeFilters);

  const handleSearchChange = (value: string) => {
    onSearch(value);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter(c => c !== category)
      : [...tempFilters.categories, category];
    
    setTempFilters({ ...tempFilters, categories: newCategories });
  };

  const handleStatusToggle = (status: Issue['status']) => {
    const newStatuses = tempFilters.statuses.includes(status)
      ? tempFilters.statuses.filter(s => s !== status)
      : [...tempFilters.statuses, status];
    
    setTempFilters({ ...tempFilters, statuses: newStatuses });
  };

  const applyFilters = () => {
    onFilter(tempFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = { categories: [], statuses: [] };
    setTempFilters(emptyFilters);
    onFilter(emptyFilters);
    setShowFilters(false);
  };

  const activeFilterCount = activeFilters.categories.length + activeFilters.statuses.length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleSearchChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  const newFilters = {
                    ...activeFilters,
                    categories: activeFilters.categories.filter(c => c !== category)
                  };
                  onFilter(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {activeFilters.statuses.map((status) => (
            <Badge key={status} variant="secondary" className="text-xs">
              {status.replace('_', ' ')}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  const newFilters = {
                    ...activeFilters,
                    statuses: activeFilters.statuses.filter(s => s !== status)
                  };
                  onFilter(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4 space-y-4 animate-fade-in">
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={tempFilters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={category} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={status.value}
                    checked={tempFilters.statuses.includes(status.value)}
                    onCheckedChange={() => handleStatusToggle(status.value)}
                  />
                  <Label htmlFor={status.value} className="text-sm">
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};