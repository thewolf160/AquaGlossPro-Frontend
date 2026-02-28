import type React from "react";
import type { Item } from "../../types/models";

export interface ColumnsProps {
  key: string;
  header: string;
  render?: (item: Item) => React.ReactNode;
}

export interface TableProps {
  columns: ColumnsProps[];
  data: Item[];
  emptyMessage?: string;
  onDelete?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onView?: (item: Item) => void;
}
