import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("unauthorized", { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })


        if (!courseOwner) return new NextResponse("unauthorized", { status: 401 })

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }


        const publishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true,
            }
        })
        return NextResponse.json(publishChapter);
    } catch (error) {
        console.log("chapter publish error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}