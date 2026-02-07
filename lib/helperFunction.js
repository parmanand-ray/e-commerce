
import { NextResponse } from "next/server";



export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  });
};

export const catchError = (error, customMessage) => {
  // Handle duplicate key error (MongoDB)
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(",");
    error.message = `Duplicate fields: ${keys}. These fields must be unique.`;
  }

  let errorObj;

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "Internal Server Error",
    };
  }

  return response(false, error.code || 500, errorObj.message, errorObj);
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // return otp;
  return "123456";
};



export const columnConfig = (column, isCreatedAt=false, isUpdatedAt=false, isDeletedAt=false) => {
  const newColumn = [...column];
  if (isCreatedAt) {
    newColumn.push({
      accessorKey: "createdAt",
      header: "Created At",
     cell:({renderedCellValue})=> new Date(renderedCellValue).toLocaleString(),
    });
  }
  if (isUpdatedAt) {
    newColumn.push({
      accessorKey: "updatedAt",
      header: "Updated At",
      cell:({renderedCellValue})=> new Date(renderedCellValue).toLocaleString(),
    });
  }
  if (isDeletedAt) {
    newColumn.push({
      accessorKey: "deletedAt",
      header: "Deleted At",
      cell:({renderedCellValue})=> new Date(renderedCellValue).toLocaleString(),
    });
  }
  return newColumn;
};
