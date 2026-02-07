"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoutes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { CgAdd } from "react-icons/cg";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Dashboard" },
  { href: ADMIN_TRASH, label: "Trash" },
];

const Trash_Config = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category/",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },
};

const trash = () => {
  const searchParams = useSearchParams();
  const trashof = searchParams.get("trashof");
  const config = Trash_Config[trashof];

  const columns = useMemo(() => {
    return columnConfig(config.columns, false, false, true);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <DeleteAction
        key="Delete"
        row={row}
        deleteType={deleteType}
        handleDelete={handleDelete}
      />,
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3  px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{config?.title || "Trash"}</h4>
            
          </div>
        </CardHeader>

        <CardContent className=" px-0">
          <DatatableWrapper
            queryKey={`${trashof}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default trash;
