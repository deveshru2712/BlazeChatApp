import { Lock, Mail, User } from "lucide-react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type: "email" | "password" | "text" | "file";
}

const getIconByPlaceholder = (placeholder: string) => {
  const lowerPlaceholder = placeholder.toLowerCase();

  if (lowerPlaceholder.includes("email") || lowerPlaceholder.includes("mail")) {
    return <Mail className="h-5 w-5 text-gray-400" />;
  }

  if (lowerPlaceholder.includes("password") || lowerPlaceholder.includes("pass")) {
    return <Lock className="h-5 w-5 text-gray-400" />;
  }

  return <User className="h-5 w-5 text-gray-400" />;
};

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
}: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel className="text-lg font-semibold">{label}</FormLabel>
        <FormControl>
          <div className="relative flex items-center">
            <div className="absolute left-3 z-10">{getIconByPlaceholder(placeholder)}</div>
            <Input
              className={`pl-10 text-lg font-semibold ${
                fieldState.error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder={placeholder}
              type={type}
              {...field}
            />
          </div>
        </FormControl>
        <FormMessage className="text-red-500 text-sm mt-1" />
        {fieldState.error && (
          <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
        )}
      </FormItem>
    )}
  />
);

export default FormField;
