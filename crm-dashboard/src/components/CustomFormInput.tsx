// FormInput.tsx
import React from "react";
import { FormInputProps } from "@/types";

interface CustomInputProps extends Omit<FormInputProps, "label"> {
  label?: string | React.ReactNode;
  labelClassName?: string;
  mask?: string; // Optional mask support
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Add onBlur support
}

export const FormInput: React.FC<CustomInputProps> = (props) => {
  const {
    label,
    name,
    type,
    placeholder,
    required,
    value,
    onChange,
    onBlur,
    formErrors,
    className,
    labelClassName,
    disable = false,
    icon,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const inputClassName = `rounded-md form-input-1 text-sm w-full text-primary-medium 
  ${formErrors ? "border-red-300" : "border-gray-300"}
  ${className}
  ${disable ? "opacity-50 cursor-not-allowed" : ""}
  ${icon ? "pl-8" : "pl-3"}`;

  return (
    <div className="flex flex-wrap items-center gap-x-2 w-full">
      {typeof label === "string" ? (
        <label
          htmlFor={name}
          className={`inline-block align-middle form-label text-sm sm:text-primary-medium ${labelClassName || ""}`}
        >
          {label}
          {label !== "" && required && (
            <span className="text-neutral-dark font-medium text-xs sm:text-sm">
              *
            </span>
          )}
        </label>
      ) : (
        label
      )}
      <div className="relative w-full">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {React.createElement(icon, { size: 16 })}
          </span>
        )}

        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          required={false}
          className={inputClassName}
          value={value ? value.toString() : ""}
          onChange={handleChange}
          onBlur={onBlur} // Add onBlur handler
          disabled={disable}
          {...(type === "number" && {
            inputMode: "numeric",
            pattern: "[0-9]*",
          })}
          {...(type === "tel" && {
            inputMode: "tel",
          })}
        />
      </div>

      {formErrors !== null && (
        <p className="text-xs md:text-sm text-red-500 transition-all ease-in-out duration-300 leading-normal sm:pt-1">
          {formErrors}
        </p>
      )}
    </div>
  );
};
