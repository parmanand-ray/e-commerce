"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import Media from "@/components/Application/Admin/Media";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoutes";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { MdArrowCircleLeft } from "react-icons/md";
import { MdRestore } from "react-icons/md";


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Media" },
];

const MediaPage = () => {
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setSelectedMedia([]);
      const trashof = searchParams.get("trashof");
      if (trashof) {
        setDeleteType("PD");
      } else {
        setDeleteType("SD");
      }
    }
  }, [searchParams]);
  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`,
    );
    return response;
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  const handleDelete = () => {
    let c = true;
    if(deleteType === 'PD'){
      c = confirm("Are you sure you want to delete the data Permanently.");
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  useEffect(()=>{
    if(selectAll){
      const ids = data.pages.flatMap(page => page.mediaData.map(media => media._id));
      setSelectedMedia(ids);
    }else{
      setSelectedMedia([]);
    }
  },[selectAll])
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3  px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold uppercase text-xl">
              {deleteType === "SD" ? "Media" : "Trash Media"}
            </h4>
            <div className="flex items-center gap-5">
              {deleteType === "SD" && <UploadMedia />}
              <div className="flex gap-3 ">
                {deleteType === "SD" ? (
                  <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                    <Button
                      type="button"
                      variant="distructive"
                      className="bg-black text-white cursor-pointer"
                    >
                      <MdDeleteSweep /> Trash
                    </Button>
                  </Link>
                ) : (
                  <Link href={`${ADMIN_MEDIA_SHOW}`} passHref>
                    <Button
                      type="button"
                      className="bg-black text-white cursor-pointer"
                    >
                      <MdArrowCircleLeft /> Go Back
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-black/50 mb-2 flex justify-between items-center">
              <Label>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-black"
                />
                Select All
              </Label>
              <div className="flex gap-2">
                {deleteType === "SD" ? (
                  <>
                    <Button className="bg-red-500 hover:bg-red-600 cursor-pointer"
                      variant="destructive"
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                    >
                      <MdDeleteSweep />
                      Move Into Trash
                    </Button>
                  </>
                ) : (
                  <>
                  
                   <Button className="bg-green-500 hover:bg-green-600 cursor-pointer"
                      onClick={() => handleDelete(selectedMedia, 'RSD')}
                    >
                     <MdRestore/>
                      Restore Media
                    </Button>

                    <Button className="bg-red-500 hover:bg-red-600 cursor-pointer"
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                    >
                     <MdDeleteSweep />
                      Delete Permanently
                    </Button>
                  
                  
                  </>
                )}
              </div>
            </div>
          )}
          {status === "pending" ? (
            <div>Loading....</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5 ">
              {data?.pages?.map((page, index) => (
                <React.Fragment key={index}>
                  {page?.mediaData?.map((media) => (
                    <Media
                      key={media._id}
                      media={media}
                      deleteType={deleteType}
                      handleDelete={handleDelete}
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
