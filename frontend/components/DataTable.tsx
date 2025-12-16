import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Loader2,
  MoreHorizontal,
  Eye,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatDateForTable } from "@/lib/utils";

export interface VisibleColumn {
  key: string;
  label: string;
  visible: boolean;
  align?: "start" | "center" | "end";
  badgeMapping?: { [key: string]: string };
  render?: (value: any) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface ActionOption<T> {
  label: string;
  icon?: React.ReactElement;
  onClick: (item: T) => void;
  iconColor?: string;
  iconColorDark?: string;
}

interface DataTableProps<T> {
  data: T[];
  visibleColumns: VisibleColumn[];
  isLoading: boolean;
  sortConfig: SortConfig;
  onSort: (columnKey: string) => void;
  onUpdateStatus?: (id: number, status: boolean) => Promise<void>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onViewDocument?: (item: T) => void;
  onSend?: (item: T) => void;
  dropdownActions?: ActionOption<T>[];
  getDropdownActions?: (item: T) => ActionOption<T>[];
  inlineActions?: ActionOption<T>[];
  getInlineActions?: (item: T) => ActionOption<T>[];
}

// Helper function to retrieve nested values using dot notation (e.g., "tipoMaquinaria.nombre")
const getValue = (obj: any, key: string): any =>
  key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);

const formatDate = (timestamp: string | null | undefined) => {
  return formatDateForTable(timestamp);
};

function DataTable<T extends Record<string, any>>({
  data,
  visibleColumns,
  isLoading,
  sortConfig,
  onSort,
  onUpdateStatus,
  onSend,
  dropdownActions,
  getDropdownActions,
  inlineActions,
  getInlineActions,
}: DataTableProps<T>) {
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-white dark:bg-muted/50 md:min-h-min">
      <div className="rounded-xl border dark:border-border dark:bg-background bg-muted/50">
        <Table className="w-full min-w-[500px] divide-y divide-gray-200">
          <TableHeader className="bg-gray-100 dark:bg-zinc-800 rounded-t-full">
            <TableRow>
              {visibleColumns.map(
                (col) =>
                  col.visible && (
                    <TableHead
                      key={col.key}
                      onClick={() => onSort(col.key)}
                      className="cursor-pointer px-4 text-sm font-semibold"
                    >
                      {col.label}{" "}
                      {sortConfig.key === col.key && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                  )
              )}
              <TableHead className="cursor-pointer px-4 text-sm font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="dark:bg-muted/50 bg-white">
            {isLoading ? (
              <TableRow className="">
                <TableCell
                  colSpan={
                    visibleColumns.filter((col) => col.visible).length + 1
                  }
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    visibleColumns.filter((col) => col.visible).length + 1
                  }
                  className="h-24 text-center"
                >
                  No se encontró datos
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {visibleColumns.map(
                    (col) =>
                      col.visible && (
                        <TableCell key={col.key} className={col.key === "estado" || col.key === "activo" ? "text-center" : ""}>
                          {col.key === "estado" || col.key === "activo" ? (
                            <div className="flex justify-center">
                              <Switch
                                id={`${col.key}-${item.id}`}
                                checked={item.activo}
                                className="h-5 w-9 data-[state=checked]:bg-green-500 [&>span]:h-4 [&>span]:w-4 [&>span]:data-[state=checked]:translate-x-4"
                                onCheckedChange={async (checked) => {
                                  if (onUpdateStatus) {
                                    await onUpdateStatus(item.id, checked);
                                  }
                                }}
                              />
                            </div>
                          ) : col.key.includes("fecha") ? (
                            formatDate(getValue(item, col.key))
                          ) : col.render ? (
                            col.render(getValue(item, col.key))
                          ) : col.badgeMapping ? (
                            <Badge
                              className={`px-2 py-1 inline-block ${
                                col.badgeMapping[getValue(item, col.key)] ||
                                col.badgeMapping["default"] ||
                                ""
                              }`}
                            >
                              {getValue(item, col.key) || "-"}
                            </Badge>
                          ) : (
                            <div
                              className={`font-sans text-sm px-2 ${
                                col.align === "center"
                                  ? "text-center"
                                  : col.align === "end"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {getValue(item, col.key) || "-"}
                            </div>
                          )}
                        </TableCell>
                      )
                  )}
                  <TableCell className="flex justify-end items-center gap-2">
                    {(getInlineActions
                      ? getInlineActions(item)
                      : inlineActions
                    )?.map((action, idx) => (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => action.onClick(item)}
                          >
                            {action.icon && (
                              <span
                                className={`h-4 w-4 ${
                                  action.iconColor ? action.iconColor : ""
                                } ${
                                  action.iconColorDark
                                    ? action.iconColorDark
                                    : ""
                                }`}
                              >
                                {action.icon}
                              </span>
                            )}
                            <span className="sr-only">{action.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{action.label}</TooltipContent>
                      </Tooltip>
                    ))}
                    {(() => {
                      const actionsForRow = getDropdownActions
                        ? getDropdownActions(item)
                        : dropdownActions || [];
                      if (actionsForRow && actionsForRow.length > 0) {
                        return (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span className="sr-only">Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl dark:bg-secondary"
                            >
                              {actionsForRow.map((action, idx) => (
                                <DropdownMenuItem
                                  key={idx}
                                  onClick={() => action.onClick(item)}
                                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900"
                                >
                                  {action.icon && (
                                    <span
                                      className={`mr-2 h-4 w-4 ${
                                        action.iconColor ? action.iconColor : ""
                                      } ${
                                        action.iconColorDark
                                          ? action.iconColorDark
                                          : ""
                                      }`}
                                    >
                                      {action.icon}
                                    </span>
                                  )}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        );
                      } else {
                        return (
                          onSend && (
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => onSend(item)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              <span className="sr-only">Enviar</span>
                            </Button>
                          )
                        );
                      }
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;
