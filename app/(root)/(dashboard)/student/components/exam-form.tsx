"use client";
import { useState } from "react";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Class,
  Exam,
  ExamForm,
  GradeList,
  Subject,
  Teacher,
  User,
} from "@prisma/client";
import { ArrowLeft, Backpack, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ExamFormProps {
  exam: Exam | null;
  examData: ExamForm[];
  studentId: string;
  examId: string;
}

const formSchema = z.object({
  studentId: z.string(),
  examId: z.string(),
  score: z.number(),
  totalMark: z.number(),
});

type ExamFormValues = z.infer<typeof formSchema>;

export const TakeExamForm: React.FC<ExamFormProps> = ({
  exam,
  examData,
  studentId,
  examId,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState<{
    [key: string]: { score: number };
  }>({});
  const [categoryCount, setCategoryCount] = useState(0);

  const title = exam?.title as string;
  const description = `${exam?.description} (${exam?.totalMarks})`;
  const toastMessage = "Exam Submitted";
  const action = "Submit";

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examId: examId,
      studentId: studentId,
      score: 0,
      totalMark: exam?.totalMarks,
    },
  });

  const score = form.watch("score") || 0;

  console.log(form.getValues());

  const handleNext = () => {
    let result = 0;
    Object.keys(currentScore).map((sc) => {
      result += currentScore[sc].score;
    });
    form.setValue("score", result);
    setCategoryCount((prev) => prev + 1);
  };

  const onSubmit = async (data: ExamFormValues) => {
    try {
      setLoading(true);

      await axios.post(`/api/take-exam`, data);

      router.refresh();
      router.push(`/`);
      toast.success(toastMessage);
    } catch (error) {
      toast("Something went wrong.", {
        description: ((error as AxiosError)?.response?.data as string) || "",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //   const onDelete = async () => {
  //     try {
  //       setLoading(true);
  //       await axios.delete(`/api/teachers/${params.id}`);
  //       router.refresh();
  //       router.push(`/teachers`);
  //       toast.success("Teacher deleted");
  //     } catch (error) {
  //       toast.error("Something went wrong.");
  //     } finally {
  //       setLoading(false);
  //       setOpen(false);
  //     }
  //   };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="w-full flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full h-full"
        >
          <div className="flex-1 flex flex-row overflow-hidden">
            {examData.map((q, i) => {
              const stringChoices = q.choices as string[];
              return (
                <div
                  key={q.id}
                  className="flex flex-col justify-between gap-4 w-full h-full flex-grow-0 flex-shrink-0 "
                  style={{
                    translate: `${-100 * categoryCount}%`,
                    transition: `all 0.5s ease-in-out`,
                  }}
                >
                  <div>
                    <Button
                      disabled={categoryCount === 0}
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (categoryCount > 0)
                          setCategoryCount((prev) => prev - 1);
                      }}
                    >
                      <ArrowLeft />
                    </Button>
                  </div>

                  <h2>{q.question}</h2>
                  <RadioGroup
                    className="w-full px-4"
                    onValueChange={(value) => {
                      if (value === q.correctAnswer) {
                        setCurrentScore((prev) => ({
                          ...prev,
                          [q.question]: { score: q.mark },
                        }));
                      } else {
                        setCurrentScore((prev) => ({
                          ...prev,
                          [q.question]: { score: 0 },
                        }));
                      }
                    }}
                  >
                    {stringChoices &&
                      Array.isArray(stringChoices) &&
                      stringChoices.map((choice) => (
                        <div
                          key={choice}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem id={choice} value={choice} />
                          <Label htmlFor={choice}>{choice}</Label>
                        </div>
                      ))}
                  </RadioGroup>
                  <div className="w-full flex items-center justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      //   disabled={i === examData.length - 1}
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              );
            })}
            <div
              className="flex flex-col justify-between gap-4 w-full h-full flex-grow-0 flex-shrink-0"
              style={{
                translate: `${-100 * categoryCount}%`,
                transition: `all 0.5s ease-in-out`,
              }}
            >
              <div>
                <Button
                  disabled={categoryCount === 0}
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (categoryCount > 0) setCategoryCount((prev) => prev - 1);
                  }}
                >
                  <ArrowLeft />
                </Button>
                <div className="w-full p-2 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <p> Make a revision before submit</p>
                  <p>This action can't be undone</p>
                </div>
              </div>
              <Button disabled={loading} className="ml-auto" type="submit">
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
