import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SortDropdownProps {
  title: string;
  type: 'name' | 'growth';
  onNameSort?: (sort: 'asc' | 'desc' | undefined) => void;
  onGrowthSort?: (sort: 'highest' | 'lowest' | undefined) => void;
  onGradeSelect?: (grades: string[]) => void;
  selectedGrades?: string[];
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  title,
  type,
  onNameSort,
  onGrowthSort,
  onGradeSelect,
  selectedGrades = [],
  className,
}) => {
  const growthGrades = ["Very Low", "Low", "Average", "High", "Very High"];
  const [isOpen, setIsOpen] = useState(false);
  
  // Updated temporary states with correct types
  const [tempNameSort, setTempNameSort] = useState<'asc' | 'desc' | undefined>(undefined);
  const [tempGrowthSort, setTempGrowthSort] = useState<'highest' | 'lowest' | undefined>(undefined);
  const [tempSelectedGrades, setTempSelectedGrades] = useState<string[]>([]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempSelectedGrades(selectedGrades || []);
    } 
    
    else {
      setTempNameSort(undefined);
      setTempGrowthSort(undefined);
      setTempSelectedGrades([]);
    }
    setIsOpen(open);
  };

  const handleApply = () => {
    if (type === 'name') {
      onNameSort?.(tempNameSort);
    } 
    
    else {
      onGrowthSort?.(tempGrowthSort);
      onGradeSelect?.(tempSelectedGrades);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    if (type === 'name') {
      setTempNameSort(undefined);
      onNameSort?.(undefined);
    } 
    
    else {
      setTempGrowthSort(undefined);
      setTempSelectedGrades([]);
      onGrowthSort?.(undefined);
      onGradeSelect?.([]);
    }
    setIsOpen(false);
  };

  const toggleGrade = (grade: string) => {
    setTempSelectedGrades((prev) => {
      if (prev.includes(grade)) {
        return prev.filter((g) => g !== grade);
      }
      return [...prev, grade];
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className={cn("flex items-center gap-1 hover:text-blue-500", className)}>
        {title}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="min-w-[200px]"
      >
        {type === 'name' && (
          <div className="space-y-2 p-1">
            <div 
              className={cn(
                "px-2 py-1.5 cursor-pointer rounded hover:bg-blue-50",
                tempNameSort === 'asc' && "bg-blue-50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setTempNameSort('asc');
              }}
            >
              A-Z
            </div>
            <div 
              className={cn(
                "px-2 py-1.5 cursor-pointer rounded hover:bg-blue-50",
                tempNameSort === 'desc' && "bg-blue-50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setTempNameSort('desc');
              }}
            >
              Z-A
            </div>
          </div>
        )}
        
        {type === 'growth' && (
          <div className="space-y-2 p-1">
            {growthGrades.map((grade) => (
              <div
                key={grade}
                className={cn(
                  "px-2 py-1.5 cursor-pointer rounded hover:bg-blue-50",
                  tempSelectedGrades.includes(grade) && "bg-blue-50"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGrade(grade);
                }}
              >
                {grade}
              </div>
            ))}
            <DropdownMenuSeparator />
            <div 
              className={cn(
                "px-2 py-1.5 cursor-pointer rounded hover:bg-blue-50",
                tempGrowthSort === 'lowest' && "bg-blue-50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setTempGrowthSort('lowest');
              }}
            >
              Lowest First
            </div>
            <div 
              className={cn(
                "px-2 py-1.5 cursor-pointer rounded hover:bg-blue-50",
                tempGrowthSort === 'highest' && "bg-blue-50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setTempGrowthSort('highest');
              }}
            >
              Highest First
            </div>
          </div>
        )}
        
        <DropdownMenuSeparator />
        <div className="flex justify-between p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="text-red-500 hover:text-red-700"
          >
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleApply();
            }}
          >
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};