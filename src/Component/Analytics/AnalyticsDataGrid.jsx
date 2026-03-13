import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";

const ACCENT = "#26B7C1";

export default function AnalyticsDataGrid({
  columns,
  data = [],
  loading = false,
  title,
  toolbarRight,
  emptyMessage = "No data available",
  enableGlobalSearch = true,
  searchPlaceholder = "Search...",
  maxHeight = 400,
  onRowClick,
  enableColumnFilters = true,
  enablePagination = false,
  pageSize = 25,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columnsWithFilter = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        enableColumnFilter:
          enableColumnFilters &&
          col.meta?.disableColumnFilter !== true,
        filterFn: col.filterFn || "includesString",
      })),
    [columns, enableColumnFilters]
  );

  const table = useReactTable({
    data,
    columns: columnsWithFilter,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(enablePagination
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: {
            pagination: {
              pageSize,
            },
          },
        }
      : {}),
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue || !String(filterValue).trim()) return true;
      const search = String(filterValue).toLowerCase().trim();
      const rowData = row.original;
      return Object.values(rowData || {}).some((val) =>
        String(val ?? "").toLowerCase().includes(search)
      );
    },
  });

  const hasActiveFilters =
    globalFilter.trim() ||
    columnFilters.some(
      (f) => f.value && String(f.value).trim()
    );
  const clearAllFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
  };

  const rows = enablePagination
    ? table.getPaginationRowModel().rows
    : table.getRowModel().rows;

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: "1 1 auto",
            minWidth: 0,
            flexWrap: "wrap",
          }}
        >
          {title && (
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
          )}
          {enableGlobalSearch && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              sx={{
                maxWidth: 260,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  fontSize: "13px",
                  "& fieldset": { borderColor: "#e0e0e0" },
                  "&:hover fieldset": { borderColor: ACCENT },
                  "&.Mui-focused fieldset": {
                    borderColor: ACCENT,
                    borderWidth: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      component="span"
                      sx={{ color: "#888", fontSize: "16px" }}
                    >
                      🔍
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <Typography
            variant="caption"
            sx={{ color: "#888", fontSize: "12px" }}
          >
            Search all
          </Typography>
          {hasActiveFilters && (
            <Typography
              component="button"
              type="button"
              onClick={clearAllFilters}
              sx={{
                fontSize: "12px",
                color: ACCENT,
                fontWeight: 600,
                cursor: "pointer",
                background: "none",
                border: "none",
                textDecoration: "underline",
                "&:hover": { color: "#1e9ba8" },
              }}
            >
              Clear all filters
            </Typography>
          )}
        </Box>
        {toolbarRight}
      </Box>
      {loading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            sx={{
              backgroundColor: "rgba(38, 183, 193, 0.2)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: ACCENT,
              },
            }}
          />
        </Box>
      )}
      <TableContainer sx={maxHeight ? { maxHeight } : undefined}>
        <Table stickyHeader size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <TableCell
                      key={header.id}
                      align={
                        header.column.columnDef.meta?.align ||
                        "left"
                      }
                      sx={{
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "#555",
                        backgroundColor: "#f8f9fa",
                        borderBottom: "1px solid #e0e0e0",
                        py: 1.25,
                        px: 2,
                      }}
                    >
                      {canSort ? (
                        <TableSortLabel
                          active={
                            header.column.getIsSorted() !== false
                          }
                          direction={
                            header.column.getIsSorted() === "asc"
                              ? "asc"
                              : "desc"
                          }
                          onClick={
                            header.column.getToggleSortingHandler()
                          }
                          sx={{
                            "&.MuiTableSortLabel-root": {
                              color: "#555",
                            },
                            "&.MuiTableSortLabel-root:hover": {
                              color: ACCENT,
                            },
                            "&.Mui-active": { color: ACCENT },
                            "& .MuiTableSortLabel-icon": {
                              color: `${ACCENT} !important`,
                            },
                          }}
                        >
                          <span>
                            {typeof header.column.columnDef.header ===
                            "string"
                              ? header.column.columnDef.header
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </span>
                          {header.column.getIsSorted() ? (
                            <Box component="span" sx={visuallyHidden}>
                              {header.column.getIsSorted() === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : typeof header.column.columnDef
                          .header === "string" ? (
                        header.column.columnDef.header
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {enableColumnFilters &&
              table.getHeaderGroups().length > 0 && (
                <TableRow
                  sx={{
                    "& td": {
                      backgroundColor: "#fafafa",
                      borderBottom: "1px solid #eee",
                      py: 0.75,
                      px: 1,
                    },
                  }}
                >
                  {table
                    .getHeaderGroups()[0]
                    .headers.map((header) => (
                      <TableCell
                        key={header.id}
                        align={
                          header.column.columnDef.meta?.align ||
                          "left"
                        }
                        sx={{ verticalAlign: "middle" }}
                      >
                        {header.column.getCanFilter() ? (
                          <TextField
                            size="small"
                            placeholder={`Filter ${
                              typeof header.column.columnDef
                                .header === "string"
                                ? header.column.columnDef.header
                                : ""
                            }`}
                            value={
                              header.column.getFilterValue() ?? ""
                            }
                            onChange={(e) =>
                              header.column.setFilterValue(
                                e.target.value
                              )
                            }
                            sx={{
                              width: "100%",
                              minWidth: 70,
                              "& .MuiOutlinedInput-root": {
                                fontSize: "12px",
                                backgroundColor: "#fff",
                                "& fieldset": {
                                  borderColor: "#e8e8e8",
                                },
                                "&:hover fieldset": {
                                  borderColor: ACCENT,
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: ACCENT,
                                  borderWidth: 1,
                                },
                              },
                              "& .MuiInputBase-input": {
                                py: 0.6,
                              },
                            }}
                            variant="outlined"
                          />
                        ) : (
                          <span />
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              )}
          </TableHead>
          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    py: 4,
                    color: "#888",
                    fontSize: "14px",
                  }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={
                  onRowClick ? () => onRowClick(row) : undefined
                }
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  "&:nth-of-type(even)": {
                    backgroundColor: "rgba(0,0,0,0.02)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(38, 183, 193, 0.06)",
                  },
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    align={
                      cell.column.columnDef.meta?.align || "left"
                    }
                    sx={{
                      whiteSpace: cell.column.columnDef.meta?.nowrap
                        ? "nowrap"
                        : "normal",
                      fontSize: "13px",
                      color: "#333",
                      borderBottom: "1px solid #f0f0f0",
                      py: 1.25,
                      px: 2,
                      maxWidth:
                        cell.column.columnDef.meta?.maxWidth,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "#fafafa",
            fontSize: "12px",
            color: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <span>
              Showing {rows.length} of {data.length} row
              {data.length !== 1 ? "s" : ""}
            </span>
            {hasActiveFilters && (
              <span style={{ color: "#888" }}>
                (filtered by:
                {globalFilter.trim()
                  ? ` search "${globalFilter}"`
                  : ""}
                {columnFilters.filter(
                  (f) => f.value && String(f.value).trim()
                ).length > 0 &&
                  ` + ${
                    columnFilters.filter(
                      (f) => f.value && String(f.value).trim()
                    ).length
                  } column filter${
                    columnFilters.filter(
                      (f) => f.value && String(f.value).trim()
                    ).length !== 1
                      ? "s"
                      : ""
                  }`}
                )
              </span>
            )}
          </Box>
          {enablePagination && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Next
              </button>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}

