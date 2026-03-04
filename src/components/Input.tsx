import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  label?: string;
  name: string;
  type: string;
  value?: string;
  onChangue?: () => void;
  icon?: ReactNode;
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChangue,
  icon,
  ...props
}: InputProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-slate-400 size-5 flex items-center justify-center">
              {icon}
            </div>
          )}

        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChangue}
          className={`w-full border border-slate-300 p-3 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in 
            ${icon ? 'pl-11 pr-4': 'px-4'}`}
          {...props}
        />
        </div>
      </div>
    </>
  );
}

export default Input;
