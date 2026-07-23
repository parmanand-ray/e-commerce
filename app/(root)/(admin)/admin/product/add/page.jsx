"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Select from "@/components/Application/Select";
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
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_SHOW,
} from "@/routes/AdminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeSlug } from "@/lib/utils";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import useFetch from "@/hooks/useFetch";
import Editor from "@/components/Application/Admin/Editor";
import MediaModal from "@/components/Application/Admin/MediaModal";
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Dashboard" },
  { href: ADMIN_PRODUCT_SHOW, label: "All Products" },
  { href: ADMIN_PRODUCT_ADD, label: "Add Products" },
];

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { data: getCategory } = useFetch("/api/category?type=SD&&size=10000");

  //Media Modal States
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data;
      const options = data.map((cat) => ({ label: cat.name, value: cat._id }));
      setCategoryOptions(options);
    }
  }, [getCategory]);
  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    discription: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
      discription: "",
    },
  });

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue("discription", data);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/product/create",
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
          <h4 className="text-xl font-semibold">Add Product</h4>
        </CardHeader>

        <CardContent className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="product-form-grid">
                <div className="mb-2 product-form-cell">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-0">
                        <FormLabel>
                          Name <span className="text-red-500">*</span>
                        </FormLabel>
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

                <div className="mb-2 product-form-cell">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-0">
                        <FormLabel>
                          Slug <span className="text-red-500">*</span>
                        </FormLabel>
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

                <div className="mb-2 product-form-cell">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-0">
                        <FormLabel>
                          Select Category{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOptions}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={true}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-2 product-form-cell">
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-0">
                        <FormLabel>
                          MRP <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter MRP"
                            {...field}
                            className=""
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-2 product-form-cell">
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-0">
                        <FormLabel>
                          Selling Price <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Selling Price"
                            {...field}
                            className=""
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-2 product-form-cell">
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-0">
                        <FormLabel>
                          Discount Percentage{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Discount Percentage"
                            {...field}
                            className=""
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-2 product-form-cell product-form-full">
                  <FormLabel className="mb-2">Description</FormLabel>
                  <Editor onChange={editor} />
                  <FormMessage></FormMessage>
                </div>
              </div>
              <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />
                <div className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer" onClick={() => setOpen(true)}>
                  <span className="font-semibold">Select Media</span>
                </div>
              </div>
              <div className="mb-3 mt-5">
                <ButtonLoading
                  type="submit"
                  text="Add Product"
                  loading={loading}
                  className={
                    "cursor-pointer bg-black/75 hover:bg-black/80 text-white"
                  }
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
