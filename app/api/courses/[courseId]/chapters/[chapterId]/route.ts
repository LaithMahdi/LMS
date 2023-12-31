import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { isTeacher } from "@/lib/teacher";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_SECRET_KEY!,
);

export async function PATCH(
    req: Request,
    { params }: { params: { chapterId: string, courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId || !isTeacher(userId)) return new NextResponse("unauthorized", { status: 401 })

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

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false,
            })

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("chapter is not found", error);
        return new NextResponse("Interval server error", { status: 500 });
    }
}

export async function DELETE(
    res: Request,
    { params }: {
        params: { chapterId: string, courseId: string, }
    }
) {
    try {
        const { userId } = auth();

        if (!userId || !isTeacher(userId)) return new NextResponse("unauthorized", { status: 401 })

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
                courseId: params.courseId
            }
        })

        if (!chapter) return new NextResponse("Chapter not found", { status: 404 })

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: { id: existingMuxData.id }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,

            }
        })

        const pusblisedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        })

        if (!pusblisedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedChapter)
    } catch (error) {
        console.log("chapter deleted is not found", error);
        return new NextResponse("Interval server error", { status: 500 });
    }
}