import { GradingForm } from "../components/grading-form";

const GradingPage = async ({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) => {
  const resolvedParams = await params;
  const { assignmentId } = resolvedParams;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GradingForm assignmentId={assignmentId} />
      </div>
    </div>
  );
};

export default GradingPage;
