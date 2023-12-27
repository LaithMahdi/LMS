"use client";
import { Chapter, MuxData } from "@prisma/client";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import FileUpload from "../FileUpload";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="size-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="size-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapte's video
          </div>
        </div>
      ) : !initialData.videoUrl ? (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <Video className="size-10 text-slate-500" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2">
          <MuxPlayer playbackId={initialData.muxData?.playbackId || ""} />
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
