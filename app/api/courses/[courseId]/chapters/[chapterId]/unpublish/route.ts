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


        const unpublishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: false,
            }
        });
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(unpublishChapter);
    } catch (error) {
        console.log("chapter unpublish error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}