import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { chapterId: string, courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("unauthorized", { status: 401 })

        const { isPusblished, ...values } = await req.json();

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!courseOwner) return new NextResponse("unauthorized", { status: 401 })

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        })
        return NextResponse.json(chapter);
    } catch (error) {
        console.log("chapter id not found", error);
        return new NextResponse("Interval server error", { status: 500 });
    }
}