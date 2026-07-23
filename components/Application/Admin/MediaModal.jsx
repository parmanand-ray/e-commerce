import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import loading from "@/public/assets/images/loading.svg";

const MediaModal = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMedia = async (page = 0) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&limit=18&deleteType=SD`,
    );
    return response;
  };

  const {
    isPending,
    isError,
    error,
    data,
  } = useInfiniteQuery({
    queryKey: ["MediaModal"],
    queryFn: ({ pageParam = 0 }) => fetchMedia(pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return lastPage?.hasMore ? nextPage : undefined;
    },
  });

  const mediaItems = data?.pages?.flatMap((page) => page?.mediaData ?? []) ?? [];

  const handleClear = () => {
    setSelectedMedia([]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = () => {
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none"
      >
        <DialogDescription className="hidden"></DialogDescription>

        <div className="h-[90vh] bg-white p-3 rounded shadow">
          <DialogHeader className="h-8 border-b flex  justify-center">
            <DialogTitle>Media Selection</DialogTitle>
          </DialogHeader>

          <div className="h-[calc(100%-80px)] overflow-auto py-2">
            {isPending ? (
              <div className="size-full flex justify-center items-center">
                <Image src={loading} alt="loading" height={80} width={80} />
              </div>
            ) : isError ? (
              <div className="size-full flex justify-center items-center">
                <span className="text-red-500">{error?.message || "Something went wrong"}</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
                {mediaItems.map((media) => (
                  <div key={media._id} className="rounded border p-2 text-sm">
                    {media.name || media._id}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-10 pt-3 border-t flex justify-between">
            <div>
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear All
              </Button>
            </div>
            <div className="flex gap-5">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="button" onClick={handleSelect}>
                Select
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
