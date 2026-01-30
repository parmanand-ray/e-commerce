import { IconButton, Tooltip } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import Link from "next/link";
import React, { use, useState } from "react";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ButtonLoading from "../ButtonLoading";
import { showToast } from "@/lib/showToast";
import { file, object } from "zod";
const Datatable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}) => {
  //filter sorting and pagination states

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  // row selection state
  const [rowSelection, setRowSelection] = useState({});

  const [exportLoading, setExportLoading] = useState(false);
  //handle delete action
  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);
  const handleDelete = (ids, deleteType) => {
    let c;
    if (deleteType === "PD") {
      c = confirm("Are you sure you want to delete the data Permanently.");
    } else {
      c = confirm("Are you sure you want to move the data to Recycle Bin.");
    }

    if (c) {
      deleteMutation.mutate({ ids, deleteType });
      setRowSelection({});
    }
  };
    //handle export action
    const handleExport = async (rows) => {
        setExportLoading(true);
        try {
          const csvConfig = mkConfig({
            feildSaprator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            useKeysAsHeaders: true,
            fileName: 'export.csv',
          });
          let csv
          if(Object.keys(rowSelection).length > 0) {
            //export selected rows
            const rowData = selectedRows.map(row => row.o   riginal);
            csv = generateCsv(csvConfig)(rowData) ;
          } else {
            //export all rows   
            const { data: response } = await axios.get(exportEndpoint);
            if(!response.success) throw new Error(response.message);

            const rowData = response.data;
            csv = generateCsv(csvConfig)(rowData);
          }
            //trigger file download
            download(csvConfig)(csv);
            showToast('success','Data exported successfully');
        }
        catch (error) {
          console.log(error);
          showToast('error',error.message || 'Error exporting data');
        }
        finally {
            setExportLoading(false);
        }
    };

  //data fetching logic would go here
  const {
    data: { data = [], meta = 0 } = {},
    isLoading,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, sorting, pagination }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      const { data: response } = await axios.get(url.href);
      return response;
    },

    placeholderData: keepPreviousData,
  });

  //initialize Table
  const table = useMaterialReactTable({
    columns: columnsConfig,
    data: data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,

    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: data?.meta?.totalRowCount ?? 0,
    onRowSelectionChange: setSelectedRows,
    state: {
      columnFilters,
      globalFilter,
      sorting,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      isLoading,
      rowSelection,
    },
    getRowId: (originalRow) => originalRow.id,

    renderToolbarInternalActions: ({ table }) => (
      <>
        {/* built in buttons. */}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {deleteType === "SD" && (
          <Tooltip title="Delete All">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() =>
                handleDelete(Object.keys(rowSelection), deleteType)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {deleteType === "PD" && (
          <>
            <Tooltip title="Restore All">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete All Permanently">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), deleteType)
                }
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionsMenuItems: ({ table }) => (
      <Tooltip>
        <ButtonLoading
          type="button"
          text={
            <>
              {" "}
              <CloudDownloadIcon /> Export
            </>
          }
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
        />
      </Tooltip>
    ),
  });

  return (
    <MaterialReactTable table={table} />
  )
};

export default Datatable;
