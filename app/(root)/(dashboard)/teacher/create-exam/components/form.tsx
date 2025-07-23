"use client";
import { useState } from "react";

import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Class, GradeList, Student, Teacher, User } from "@prisma/client";
// import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar1Icon, Edit, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Question {
  id: number;
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correctAnswer: string;
  mark: number;
}

interface ExamFormProps {
  classes: Class[];
  teacherId: string;
  gradeId: string;
  subjectId: string | undefined;
}

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  duration: z.number(),
  totalMarks: z.number(),
  subjectId: z.string(),
  teacherId: z.string(),
  gradeId: z.string(),
  questions: z.array(
    z.object({
      id: z.number(),
      question: z.string(),
      choice1: z.string(),
      choice2: z.string(),
      choice3: z.string(),
      choice4: z.string(),
      correctAnswer: z.string(),
      mark: z.number(),
    })
  ),
});

type ExamFormValues = z.infer<typeof formSchema>;

export const ExamsForm = ({
  classes,
  teacherId,
  gradeId,
  subjectId,
}: ExamFormProps) => {
  // const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Omit<Question, "id">>({
    question: "",
    choice1: "",
    choice2: "",
    choice3: "",
    choice4: "",
    correctAnswer: "",
    mark: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  //   const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const titl = "Create Exam";
  const desc = "Add a  new exam";
  const toastMessage = "Exam created";
  const action = "Create";

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      teacherId: teacherId,
      gradeId: gradeId,
      subjectId: subjectId,
      title: "",
      totalMarks: 100,
      duration: 120,
      questions: [],
    },
  });

  const questions = form.watch("questions") || [];

  const handleAddQuestion = () => {
    const {
      question,
      choice1,
      choice2,
      choice3,
      choice4,
      correctAnswer,
      mark,
    } = currentQuestion;

    if (!question || !choice1 || !choice2 || !choice3 || !choice4 || !mark) {
      toast.error(
        "Please fill all fields for the question and choices and mark."
      );
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now(),
    };

    if (editingId !== null) {
      const updatedQuestions = questions.map((q) =>
        q.id === editingId ? newQuestion : q
      );
      form.setValue("questions", updatedQuestions);
      setEditingId(null);
      toast.success("Question updated!");
    } else {
      form.setValue("questions", [...questions, newQuestion]);
      toast.success("Question added!");
    }

    setCurrentQuestion({
      question: "",
      choice1: "",
      choice2: "",
      choice3: "",
      choice4: "",
      correctAnswer: "",
      mark: 0,
    });
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion({
      question: question.question,
      choice1: question.choice1,
      choice2: question.choice2,
      choice3: question.choice3,
      choice4: question.choice4,
      correctAnswer: question.correctAnswer,
      mark: question.mark,
    });
    setEditingId(question.id);
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    form.setValue("questions", updatedQuestions);
    toast.success("Question deleted.");
  };

  const onSubmit = async (data: ExamFormValues) => {
    try {
      setLoading(true);
      await axios.post(`/api/create-exam`, data);

      router.refresh();
      router.push(`/`);
      toast.success(toastMessage);
    } catch (error) {
      toast("Something went wrong.", {
        description:
          ((error as AxiosError)?.response?.data as string) || "UnKnown error",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //   const onDelete = async () => {
  //     try {
  //       setLoading(true);
  //       await axios.delete(`/api/classes/${params.id}`);
  //       router.refresh();
  //       router.push(`/classes`);
  //       toast.success("Class deleted");
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
        onConfirm={handleDeleteQuestion}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={titl} description={desc} />
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="title"
              // disabled={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Title name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the assignment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Duration in min"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalMarks"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormLabel>Total Marks</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Total marks of exam"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            {/* Question Form */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Add New Question</h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter the question"
                  className="resize-none"
                  value={currentQuestion.question}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      question: e.target.value,
                    })
                  }
                />
                <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                  <Input
                    placeholder="Choice 1"
                    value={currentQuestion.choice1}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        choice1: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Choice 2"
                    value={currentQuestion.choice2}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        choice2: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Choice 3"
                    value={currentQuestion.choice3}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        choice3: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Choice 4"
                    value={currentQuestion.choice4}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        choice4: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-row gap-4">
                  <Select
                    onValueChange={(value) => {
                      const choices = [
                        currentQuestion.choice1,
                        currentQuestion.choice2,
                        currentQuestion.choice3,
                        currentQuestion.choice4,
                      ];
                      const selectedText = choices[parseInt(value)] || "";
                      setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: selectedText,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Correct Answer</SelectLabel>
                        <SelectItem value="0">Choice 1</SelectItem>
                        <SelectItem value="1">Choice 2</SelectItem>
                        <SelectItem value="2">Choice 3</SelectItem>
                        <SelectItem value="3">Choice 4</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="w-full flex flex-row gap-4 items-center">
                    <p>Mark:</p>
                    <Input
                      placeholder="Mark"
                      type="number"
                      value={currentQuestion.mark}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          mark: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddQuestion}
                  type="button"
                  variant="outline"
                >
                  Add Question
                </Button>
              </div>
            </div>

            {/* Display Added Questions */}
            {questions.length > 0 && (
              <Card className="mt-6 w-full">
                <CardHeader>
                  <CardTitle>
                    <h3 className="text-lg font-semibold mb-2">
                      Added Questions
                    </h3>
                  </CardTitle>
                  <CardContent>
                    <div className="w-full flex flex-col gap-4">
                      {questions.map((q, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>
                              <strong>{q.question}</strong>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                              <div>Choice 1: {q.choice1}</div>
                              <div>Choice 2: {q.choice2}</div>
                              <div>Choice 3: {q.choice3}</div>
                              <div>Choice 4: {q.choice4}</div>
                              <div>
                                Correct Answer: Choice {`${q.correctAnswer}`}
                              </div>
                              <div>Mark: {q.mark}</div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <div className="flex gap-2 flex-row justify-end w-full">
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleEditQuestion(q)}
                              >
                                <Edit />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => handleDeleteQuestion(q.id)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </CardHeader>
              </Card>
            )}
          </div>
          <Button
            disabled={loading}
            className="ml-auto"
            type="submit"
            variant="secondary"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
