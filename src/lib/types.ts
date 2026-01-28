export type ComponentType = "mwlButton" | "mwlGrid";

export interface MWLButtonProps {
  type?: "icon" | "normal";
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  text?: string | string[];
  className?: string;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  endIcon?: React.ReactNode;
  count?: number;
  orientation?: "horizontal" | "vertical";
  href?: string;
  borderRadius?: number;
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  dataTestid?: string;
  loading?: boolean;
  loadingPosition?: "start" | "end" | "center";
  loadingText?: string;
  [key: string]: unknown;
}

import {
  GridCellParams,
  GridColumnVisibilityModel,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  GridApi,
  GridRowModesModel,
  GridRowParams,
  GridToolbarProps,
} from "@mui/x-data-grid";
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";
import { GridApiPro } from "@mui/x-data-grid-pro";

export interface MyToolbarProps extends Partial<GridToolbarProps> {
  reasonText?: string;
  componentsConfig?: Record<string, unknown>;
  rowDataLength?: number;
  exportDynamicModule?: React.ReactNode;
}

export interface CrudDetails {
  id: string;
  operation: "Add" | "Edit" | "Delete" | "Cancel" | "Save";
  editFieldToFocus?: string;
  rowDataToAdd?: RowData;
}

export type RowData = {
  [key: string]: string | number | boolean | undefined;
};

type CombinedApiRef = React.MutableRefObject<GridApiPremium> &
  React.MutableRefObject<GridApiPro> &
  React.MutableRefObject<GridApi>;
interface PinnedColumns {
  left?: string[];
  right?: string[];
}

export interface ToolbarIcons {
  columnsButton?: React.ReactNode;
  filterButton?: React.ReactNode;
  export?: React.ReactNode;
  quickFilter?: React.ReactNode;
  // Add other toolbar icon properties here if needed
}

export interface DataGridProps {
  /** Row data for the grid. */
  rowData: RowData[];

  /** Function to update the row data. */
  setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;

  /** Column configuration: `field`, `headerName`, `hide` (optional), `type` (optional). */
  columnData: {
    field: string;
    headerName: string;
    hide?: boolean;
    type?: "string" | "number" | "boolean" | "date" | "singleSelect";
  }[];

  /** Optional CRUD operation details. */
  crudDetails?: CrudDetails;

  /** Function to update CRUD operation status. */
  setCrudOperationStatus: React.Dispatch<React.SetStateAction<boolean>>;

  /** Whether a CRUD operation is in progress. */
  crudOperationStatus: boolean;

  /** Function to update row modes (e.g., edit). */
  setRowModesData: React.Dispatch<React.SetStateAction<GridRowModesModel>>;

  /** Row modes data (e.g., edit, delete). */
  rowModesData?: GridRowModesModel;

  /** Optional custom class name for the grid. */
  className?: string;

  /** Optional row click handler. */
  onRowClick?: (params: GridRowParams) => void;

  /** Optional rows per page for pagination. */
  rowsPerPageCount?: number;

  /** Optional function for row updates. */
  currentlyUpdateRow?: (val: RowData) => void;

  /** Optional row selection model. */
  rowSelectionModel?: GridRowSelectionModel;

  /** Callback for changes in row selection. */
  onRowSelectionModelChangeSelection?: (
    newSelection: GridRowSelectionModel,
    selectedRowsData: RowData[],
  ) => void;

  /** Disable row selection on row click. */
  disableRowSelectionOnClick?: boolean;

  /** Function to check if a row is selectable. */
  isRowSelectable?: () => boolean;

  /** Show header filters. */
  headerFilters?: boolean;

  /** Optional keyboard event handler for cell focus. */
  onCellKeyDown?: (params: GridCellParams, event: React.KeyboardEvent) => void;

  /** Disable selection on row click. */
  disableSelectionOnClick?: boolean;

  /** String reason for custom row actions. */
  reasonText?: string | React.ReactNode;

  /** Height of column group header. */
  columnGroupHeaderHeight?: number;

  /** Additional custom props for the grid. */
  dataGridProOtherProps?: Record<string, unknown>;

  /** Optional license key for Pro version. */
  licenseKey?: string;

  /** Grid variant: 'community', 'pro', or 'premium'. */
  variant?: "community" | "pro" | "premium";

  /** Common custom props for the grid. */
  commonProps?: Record<string, unknown>;

  /** Configuration for custom grid components. */
  componentsConfig?: object;

  /** Show list content in the grid. */
  listContent?: boolean;

  /** Optional custom right-side content for the grid. */
  GridRightListContent?: React.ReactNode;

  /** Optional localization text for toolbar. */
  localeText?: {
    toolbarColumns?: string;
    toolbarFilters?: string;
    toolbarDensity?: string;
    toolbarExport?: string;
  };

  /** Optional pagination size options. */
  pageSizeOptions?: object;

  /** Callback for pagination model changes. */
  onPaginationModelChange?: (model: { page: number; pageSize: number }) => void;

  /** Show or Hide pagination depends on user preference. */
  showPagination?: boolean;

  /** Current pagination model. */
  paginationModel?: { page: number; pageSize: number };

  /** Optional row count for server-side pagination. */
  rowCount?: number;

  /** Callback for filter model changes. */
  onFilterModelChange?: (filterModel: {
    quickFilterValues?: string[];
    items: { columnField: string; operatorValue: string; value: string }[];
  }) => void;

  /** Callback for sort model changes. */
  onSortModelChange?: (sortModel: GridSortModel) => void;

  /** Current filter model. */
  filterModel?: {
    quickFilterValues?: string[];
    items: { columnField: string; operatorValue: string; value: string }[];
  };

  /** Optional dynamic export component. */
  exportDynamicModule?: React.ReactNode;

  /** Function to get visible columns based on visibility model. */
  getVisibleColumn?: (columnVisibilityModel: GridColumnVisibilityModel) => void;

  /** Optional pinned columns configuration. */
  pinnedColumns?: PinnedColumns;

  /** Disable column filter functionality. */
  disableColumnFilter?: boolean;

  /** Header text for the right-side slide panel. */
  gridSlideHeaderContent?: React.ReactNode;

  /** Custom component for when no rows are available. */
  CustomNoRowsOverlay?: React.ReactNode;

  /** Optional filter operators to include. */
  filterOperatorsToInclude?: string[];

  // Ref to the combined Grid API (Premium, Pro & Community)
  apiRef?: CombinedApiRef;

  // Function returning detail panel content for a row
  getDetailPanelContent?: (params: GridRowParams) => React.ReactNode;

  // Function returning detail panel height for a row (in pixels)
  getDetailPanelHeight?: (params: GridRowParams) => number;

  // For custom detail panel expand icon
  detailPanelExpandIcon?: React.JSXElementConstructor<unknown>;

  // For custom detail panel collapse icon
  detailPanelCollapseIcon?: React.JSXElementConstructor<unknown>;

  /** Order of components in the toolbar */
  componentOrder?: Array<
    | "quickFilter"
    | "columnsButton"
    | "filterButton"
    | "densitySelector"
    | "export"
    | "exportDynamic"
  >;

  /** Optional search placeholder text. */
  searchPlaceholder?: string;

  /** Optional toolbar props. */
  toolbarProps?: ToolbarIcons;

  /** Optional custom icons for toolbar buttons. */
  toolbarIcons?: ToolbarIcons;

  /** Show or hide the entire toolbar */
  showToolbar?: boolean;

  /** MUI Data Grid Slot Props for passing props to slot components */
  slotProps?: Partial<import("@mui/x-data-grid").GridSlotsComponentsProps>;
  /** Optional custom toolbar slot component */
  toolbarSlot?: React.JSXElementConstructor<MyToolbarProps>;
}

export type ComponentProps = [MWLButtonProps, DataGridProps];

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: Partial<ComponentProps>;
}

export interface CanvasState {
  components: CanvasComponent[];
  selectedComponentId: string | null;
}

export const DEFAULT_MWL_BUTTON_PROPS: MWLButtonProps = {
  type: "normal",
  text: "MWL Button",
  variant: "contained",
  color: "primary",
  size: "medium",
  disabled: false,
  borderRadius: 4,
  className: "mwl-button",
  textTransform: "none",
  loading: false,
  loadingPosition: "center",
};
const rowData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    active: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 26,
    active: false,
  },
  {
    id: 3,
    name: "Ravi Kumar",
    email: "ravi@example.com",
    age: 35,
    active: true,
  },
];
export const DEFAULT_MWL_GRID_PROPS: DataGridProps = {
  /* ===================== */
  /* Demo data (canvas preview) */
  /* ===================== */
  columnData: [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
    },
    {
      field: "active",
      headerName: "Active",
      type: "boolean",
    },
  ],

  rowData: rowData,

  /* ===================== */
  /* Required handlers (safe no-op) */
  /* ===================== */
  setRowData: () => {},
  setRowModesData: () => {},
  setCrudOperationStatus: () => {},

  /* ===================== */
  /* Grid state */
  /* ===================== */
  crudOperationStatus: false,
  rowModesData: {},

  /* ===================== */
  /* Grid behavior */
  /* ===================== */
  variant: "community",
  showToolbar: true,
  showPagination: true,
  paginationModel: { pageSize: 5, page: 0 },
  pageSizeOptions: [5, 10, 20],
  disableColumnFilter: false,
  listContent: false,
  rowCount: rowData.length,

  /* ===================== */
  /* Optional */
  /* ===================== */
  localeText: {},
  commonProps: {},
  componentsConfig: {
    columnsButton: true,
    densitySelector: false,
    export: false,
    filterButton: true,
    quickFilter: false,
  },
};
