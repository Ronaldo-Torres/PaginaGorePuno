import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface VisibleColumn {
  key: string;
  label: string;
  visible: boolean;
  align?: "start" | "center" | "end";
  badgeMapping?: { [key: string]: string };
  render?: (value: any) => React.ReactNode;
}

export interface FilterOption {
  key: string;
  type: "input" | "select" | "checkbox";
  placeholder?: string;
  label?: string;
  value: string | boolean | null;
  onChange: (value: any) => void;
  options?: { value: string; label: string }[]; // Para filtros de tipo select
}

interface TableFiltersProps {
  filters: FilterOption[];
  resetFilters: () => void;
  isResetting: boolean;
  visibleColumns: VisibleColumn[];
  toggleColumnaVisible: (column: VisibleColumn) => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  resetFilters,
  isResetting,
  visibleColumns,
  toggleColumnaVisible,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
      <div className="flex flex-row items-center gap-2 sm:gap-4 w-full">
        {filters.map((filter) => {
          if (filter.type === "input") {
            return (
              <Input
                key={filter.key}
                placeholder={filter.placeholder || ""}
                className="w-full sm:max-w-xs rounded-xl dark:bg-secondary bg-white"
                value={filter.value as string}
                onChange={(e) => filter.onChange(e.target.value)}
              />
            );
          } else if (filter.type === "select" && filter.options) {
            return (
              <Select
                key={filter.key}
                value={filter.value as string}
                onValueChange={(val: string) => filter.onChange(val)}
              >
                <SelectTrigger className="w-full sm:w-[180px] rounded-xl dark:bg-secondary bg-white">
                  <SelectValue placeholder={filter.placeholder || ""} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          } else if (filter.type === "checkbox") {
            return (
              <div key={filter.key} className="flex items-center space-x-2">
                <Checkbox
                  id={filter.key}
                  checked={filter.value as boolean | undefined}
                  onCheckedChange={(checked) => {
                    filter.onChange(checked);
                  }}
                />
                <label
                  htmlFor={filter.key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {filter.label}
                </label>
              </div>
            );
          }
          return null;
        })}

        {/* Botón de reset */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={resetFilters}
                disabled={isResetting}
                className={`rounded-xl dark:bg-secondary ${
                  isResetting ? "animate-spin" : ""
                }`}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-xl dark:bg-secondary">
              <p>Resetear filtros</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Menú de columnas */}
      <div className="w-full sm:w-auto flex justify-end border-l-green-900">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-xl dark:bg-secondary w-full sm:w-auto"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Ver Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl dark:bg-secondary">
            {visibleColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={column.visible}
                onCheckedChange={() => toggleColumnaVisible(column)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TableFilters;
