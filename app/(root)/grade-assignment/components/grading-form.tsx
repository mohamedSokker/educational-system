"use client";
import { useState } from "react";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
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
import { toast } from "sonner";

interface GradingFormProps {
  assignmentId: string;
}

const formSchema = z.object({
  grade: z.number().min(1),
  assignmentId: z.string(),
});

type GradingFormValues = z.infer<typeof formSchema>;

export const GradingForm: React.FC<GradingFormProps> = ({ assignmentId }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const title = "Grade Assignment";
  const description = "Grade a  new assignment";
  const toastMessage = "Grading completed";
  const action = "Submit";

  const form = useForm<GradingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignmentId: assignmentId,
      grade: 0,
    },
  });

  const onSubmit = async (data: GradingFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/grade-assignment`, data);

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

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
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
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Subject name"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
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
