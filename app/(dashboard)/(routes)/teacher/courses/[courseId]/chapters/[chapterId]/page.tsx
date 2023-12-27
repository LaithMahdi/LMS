import ChapterAccessForm from "@/components/dashborad/course/chapters/ChapterAccessForm";
import ChapterActions from "@/components/dashborad/course/chapters/ChapterActions";
import ChapterDescriptionForm from "@/components/dashborad/course/chapters/ChapterDescriptionForm";
import ChapterTitleForm from "@/components/dashborad/course/chapters/ChapterTitleForm";
import ChapterVideoForm from "@/components/dashborad/course/chapters/ChapterVideoForm";
import Banner from "@/components/shared/Banner";
import IconBadge from "@/components/shared/IconBadge";
import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });
  if (!chapter) return redirect("/");

  const requiredFiels = [chapter.title, chapter.description, chapter.videoUrl];
  const completedFiels = requiredFiels.filter(Boolean).length;

  const completionText = `(${completedFiels}/${requiredFiels.length})`;
  const isComplete = requiredFiels.every(Boolean);
  return (
    <>
      {!chapter.isPublished && (
        <Banner
          label="This chapter is unpublished. It will not be visible in the course."
          variant="warning"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to course setup
            </Link>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all field {completionText}
                </span>
              </div>

              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>

            <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
