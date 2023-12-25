import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <Button className="p-6" asChild>
        <Link href="/teacher/create">New Course</Link>
      </Button>
    </div>
  );
};

export default page;
