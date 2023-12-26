"use client";
import { Attachment, Course } from "@prisma/client";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FileUpload from "./FileUpload";

interface AttachmentFormProps {
  initialData: Course & { attachment: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="size-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      ) : !initialData.imageUrl ? (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <ImageIcon className="size-10 text-slate-500" />
        </div>
      ) : (
        <>
          {initialData.attachment.length === 0 && (
            <p className="text-sm text-slate-500 italic">No attachments yet</p>
          )}
          {initialData.attachment.length > 0 && (
            <div className="space-y-2">
              {initialData.attachment.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md"
                >
                  <File className="size-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{att.name}</p>

                  {deletingId === att.id ? (
                    <div>
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(att.id)}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttachmentForm;
