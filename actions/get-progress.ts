import { db } from "@/lib/database";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const pushlishedChapters = await db.chapter.findMany({
      where: { courseId: courseId, isPublished: true },
      select: { id: true },
    });

    const pushlishedChaptersIds = pushlishedChapters.map(
      (chapter) => chapter.id
    );
    const validCompleteChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: { in: pushlishedChaptersIds },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompleteChapters / pushlishedChapters.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("GET PROGRESS", error);
    return 0;
  }
};
