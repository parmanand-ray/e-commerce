import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const BreadCrumb = ({breadcrumbData}) => {
  return (
    <Breadcrumb className="mb-5">
  <BreadcrumbList className="flex items-center flex-wrap gap-2 text-sm text-gray-800">

    {breadcrumbData?.length > 0 && breadcrumbData.map((data, index) => {
      const isLast = index === breadcrumbData.length - 1;

      return (
        <React.Fragment key={index}>
          
          <BreadcrumbItem>
            <BreadcrumbLink
              href={data.href}
              className={`
                transition-colors
                ${isLast 
                  ? "text-black font-semibold cursor-default pointer-events-none" 
                  : "hover:text-black hover:underline"
                }
              `}
            >
              {data.label}
            </BreadcrumbLink>
          </BreadcrumbItem>

          {!isLast && (
            <BreadcrumbSeparator className="text-gray-600"/> 
          )}

        </React.Fragment>
      );
    })}

  </BreadcrumbList>
</Breadcrumb>

  );
};

export default BreadCrumb;
