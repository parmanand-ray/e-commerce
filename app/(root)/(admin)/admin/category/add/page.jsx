"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zSchema } from "@/lib/zodSchema";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeSlug } from "@/lib/utils";
import axios from "axios";
import { showToast } from "@/lib/showToast";
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Dashboard" },
  { href: ADMIN_CATEGORY_SHOW, label: "All Category" },
  { href: ADMIN_CATEGORY_ADD, label: "Add Category" },
];

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const formSchema = zSchema.pick({ name: true, slug: true });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/category/create",
        values,
      );
      if (!response.success) throw new Error(response.message);
      showToast("success", response.message);
      form.reset();
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", makeSlug(name));
    }
  }, [form.watch("name")]);
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3  px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Category</h4>
        </CardHeader>

        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Name"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Slug"
                          {...field}
                           readOnly
                          className="bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <ButtonLoading
                  type="submit"
                  text="Add Category"
                  loading={loading}
                  className={"cursor-pointer bg-black/75 hover:bg-black/80 text-white"}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
