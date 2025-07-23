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
// import { AlertModal } from "@/components/modals/alert-modal";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar1Icon } from "lucide-react";
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

interface TeacherFormProps {
  classes: Class[];
  teacherId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  dueDate: z.date(),
  classId: z.string(),
  teacherId: z.string(),
});

type AssignmentFormValues = z.infer<typeof formSchema>;

export const AssignmentsForm = ({ classes, teacherId }: TeacherFormProps) => {
  //   const params = useParams();
  const router = useRouter();

  //   const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const titl = "Create Assignment";
  const desc = "Add a  new assignment";
  const toastMessage = "Assignment created";
  const action = "Create";

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: "",
      description: "",
      dueDate: new Date(),
      teacherId: teacherId,
      title: "",
    },
  });

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      setLoading(true);
      await axios.post(`/api/create-assignment`, data);

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
              name="dueDate"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
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
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
