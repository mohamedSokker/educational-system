"use client";
import { useState } from "react";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { User } from "@prisma/client";
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
import { logout } from "@/actions/logout";

interface UserFormProps {
  studentId: string;
  assignmentId: string;
}

const formSchema = z.object({
  studentId: z.string(),
  assignmentId: z.string(),
  fileUrl: z.string(),
});

type UserFormValues = z.infer<typeof formSchema>;

export const UploadAssignmentForm: React.FC<UserFormProps> = ({
  studentId,
  assignmentId,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Assignment";
  const description = "Submit your assignment before the deadline";
  const toastMessage = "Assignment Submitted";
  const action = "Submit";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: studentId,
      assignmentId: assignmentId,
      fileUrl: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      console.log(`submitted`);

      await axios.post(`/api/submit-assignment`, data);

      router.refresh();
      router.push(`/`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                <FormLabel>Upload File</FormLabel>
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
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
