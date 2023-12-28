import Catgories from "@/components/dashborad/search/Catgories";
import SearchInput from "@/components/shared/SearchInput";
import { db } from "@/lib/database";

const page = async () => {
  const catgories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Catgories items={catgories} />
      </div>
    </>
  );
};

export default page;
