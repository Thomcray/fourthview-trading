type Props = {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  width?: string;
  margin?: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
};

export default function Selection({
  children,
  defaultValue,
  value,
  placeholder,
  width,
  name,
  onChange,
  required = false,
}: Props) {
  return (
    <div
      className={`flex items-center rounded-sm border h-12.25 mt-1 shadow ${width}`}
    >
      <select
        name={name}
        required={required}
        {...(value !== undefined && onChange !== undefined
          ? { value, onChange }
          : { defaultValue })}
        className="w-full cursor-pointer px-2 py-6 rounded-md border-0 focus:outline-none shadow-none text-sm leading-tight"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </div>
  );
}
