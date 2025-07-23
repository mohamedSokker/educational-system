"use client";
import { useState } from "react";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Class,
  GradeList,
  Student,
  Subject,
  Teacher,
  User,
} from "@prisma/client";
import { Trash } from "lucide-react";
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

interface StudentFormProps {
  initialData: Student | null;
  classes: Class[];
  grades: GradeList[];
}

const formSchema = z.object({
  name: z.string().min(1),
  classId: z.string(),
  gradeId: z.string(),
});

type StudentFormValues = z.infer<typeof formSchema>;

export const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  classes,
  grades,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit student" : "Create student";
  const description = initialData ? "Edit student" : "Add a  new student";
  const toastMessage = initialData ? "Student updated" : "Student created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name ?? "",
          classId: initialData.classId ?? "",
          gradeId: initialData.gradeId ?? "",
        }
      : {
          name: "",
          classId: "",
          gradeId: "",
        },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/students/${params.id}`, data);
      } else {
        await axios.post(`/api/students`, data);
      }

      router.refresh();
      router.push(`/students`);
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

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/students/${params.id}`);
      router.refresh();
      router.push(`/students`);
      toast.success("Student deleted");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              // disabled={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Student name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Class</SelectLabel>
                          {classes.map((cl) => (
                            <SelectItem key={cl.id} value={cl.id}>
                              {cl.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Grade</SelectLabel>
                          {grades.map((grade) => (
                            <SelectItem key={grade.id} value={grade.id}>
                              {`${grade.name}`}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
