"use client";
import { useState } from "react";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Subject, Teacher, User } from "@prisma/client";
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
import { toast } from "sonner";
import axios from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import ImageUpload from "@/components/file-upload";
// import { logout } from "@/actions/logout";

interface UserFormProps {
  //   initialData: ({ subjects: Subject | null } & Teacher)[];
  gradeId: string;
  subjectId: string;
  teacherId: string;
}

const formSchema = z.object({
  title: z.string(),
  subjectId: z.string(),
  teacherId: z.string(),
  gradeId: z.string(),
  fileUrl: z.string(),
});

type UserFormValues = z.infer<typeof formSchema>;

const UploadCourseForm: React.FC<UserFormProps> = ({
  //   initialData,
  gradeId,
  subjectId,
  teacherId,
}) => {
  //   const params = useParams();
  const router = useRouter();

  //   const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Create course";
  const description = "Add a  new course";
  const toastMessage = "Course created";
  const action = "Create";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherId: teacherId,
      gradeId: gradeId,
      subjectId: subjectId,
      title: "",
      fileUrl: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);

      await axios.post(`/api/create-course`, data);

      router.refresh();
      router.push(`/teacher/manage-courses`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  //   const onDelete = async () => {
  //     try {
  //       setLoading(true);
  //       await axios.delete(`/api/manage-account/${params.id}`);
  //       toast.success("User deleted");
  //       await logout();
  //       redirect("/sign-in");
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>

      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Title" {...field} />
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

export default UploadCourseForm;
