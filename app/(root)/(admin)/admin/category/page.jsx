import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_CATEGORY_ADD, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes";
import Link from "next/link";

import { CgAdd } from "react-icons/cg";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Dashboard" },
  { href: "", label: "All Category" },
];
const ShowCategory = () => {
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
        <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3  px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
          <h4 className="text-xl font-semibold">Show Category</h4>
          <Button >
            <CgAdd  />
            <Link href={ADMIN_CATEGORY_ADD} >New Category</Link>
          </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-5">
         <DatatableWrapper queryKey="category-data"
         fetchUrl='/api/category/'
         initialPageSize={10}
         />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCategory;
