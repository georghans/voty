import clsx from "clsx";
import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputProps = JSX.IntrinsicElements["input"];
interface ITextInput extends InputProps {
  label?: string;
  register: UseFormRegisterReturn;
}

export const Input: React.FC<ITextInput> = (props) => {
  return (
    <div className="flex w-full flex-col space-y-1">
      {props.label && (
        <label
          htmlFor={props.id}
          className="text-[16px] font-medium text-neutral"
        >
          {props.label}:
          {props.required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          {...props}
          {...props.register}
          size={1}
          className={clsx(
            "invalid:focus:ring-error h-12 w-full rounded-md border px-2 font-medium text-neutral ring-1 ring-neutral/30 invalid:ring-red-800 focus:outline-none focus:ring-2 focus:ring-neutral"
          )}
        />
      </div>
    </div>
  );
};
