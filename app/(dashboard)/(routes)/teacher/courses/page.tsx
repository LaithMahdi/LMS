import { columns } from "@/components/dashborad/course/Columns";
import { DataTable } from "@/components/dashborad/course/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const courses = await db.course.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default page;
