import { getCourses } from "@/actions/get-courses";
import Catgories from "@/components/dashborad/search/Catgories";
import CoursesList from "@/components/dashborad/search/CoursesList";
import SearchInput from "@/components/shared/SearchInput";
import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SearchParamsProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const catgories = await db.category.findMany({ orderBy: { name: "asc" } });
  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Catgories items={catgories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default page;
