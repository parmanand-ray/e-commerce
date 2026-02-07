"use client";

import { ThemeProvider } from "@mui/material";
import Datatable from "./Datatable";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "@/lib/meterialTheme";
import { useTheme } from "next-themes";

const DatatableWrapper = ({
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={resolvedTheme === "dark" ? darkTheme : lightTheme}>
      <Datatable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteEndpoint={deleteEndpoint}
        deleteType={deleteType}
        trashView={trashView}
        createAction={createAction}
      />
    </ThemeProvider>
  );
};

export default DatatableWrapper;
