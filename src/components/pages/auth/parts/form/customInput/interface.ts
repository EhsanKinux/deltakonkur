import { authFormSchema } from "@/lib/schema/Schema";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";

const formSchema = authFormSchema();

export interface ICustomInput {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
}
