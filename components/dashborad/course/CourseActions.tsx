"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;

  isPublished: boolean;
}
const CourseActions = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const onDelete = async () => {
    try {
      setisLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Course deleted successfully");
      router.push(`/teacher/courses`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setisLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setisLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default CourseActions;
