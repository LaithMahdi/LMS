import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: {
    params: {
        courseId: string
    }
}) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const values = await req.json();

        const course = await db.course.update({
            where: {
                id: params.courseId,
                userId
            }, data: {
                ...values,
            }
        })
        return NextResponse.json(course);
    } catch (error) {
        console.log("PATCH COURSE ID ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}