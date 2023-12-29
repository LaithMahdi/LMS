import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { isCompleted } = await req.json();

        if (!userId) return new NextResponse("unauthorized", { status: 401 });

        const userProgress = await db.userProgress.upsert({
            where: { userId_chapterId: { userId, chapterId: params.chapterId } },
            update: { isCompleted },
            create: { userId, chapterId: params.chapterId, isCompleted }
        });

        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("Chapter ID progress put error", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}