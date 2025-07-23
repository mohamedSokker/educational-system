import { Skeleton } from "@/components/ui/skeleton";

const TeacherDashboardSkeleton = () => {
  return (
    <div className="flex-col w-full gap-4">
      <div className="flex flex-row items-center p-4 gap-4">
        <Skeleton className="w-full h-[50px] flex-1" />
      </div>
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 px-4 gap-4">
        <Skeleton className="w-full h-[200px] flex-1" />
        <Skeleton className="w-full h-[200px] flex-1" />
        <Skeleton className="w-full h-[200px] flex-1" />
        <Skeleton className="w-full h-[200px] flex-1" />
      </div>
      <div className="w-full p-4">
        <Skeleton className="w-full h-[400px] flex-1" />
      </div>
    </div>
  );
};

export default TeacherDashboardSkeleton;
