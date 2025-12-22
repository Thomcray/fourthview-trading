type Props = {
  children: React.ReactNode;
  defaultValue?: string;
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
  width,
  name,
  onChange,
  required = false,
}: Props) {
  return (
    <div className="w-max flex items-center rounded-sm border h-12.25 mt-1 shadow">
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`${width} cursor-pointer px-2 py-6 mt-1 rounded-md border-0 focus:outline-none shadow-none text-sm leading-tight`}
      >
        <option value={defaultValue}>{defaultValue}</option>
        {children}
      </select>
    </div>
  );
}
