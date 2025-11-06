type Props = {
  children: React.ReactNode;
  defaultValue?: string;
  placeholder?: string;
  width?: string;
  margin?: string;
  name: string;
  required: boolean;
};

export default function Selection({
  children,
  defaultValue,
  width,
  name,
  required = false,
}: Props) {
  return (
    <div className="w-full flex items-center rounded-sm border-1 h-[49px] mt-1 shadow">
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={`${width} cursor-pointer px-2 py-6 mt-1 rounded-md border-0 focus:outline-none shadow-none text-sm leading-tight`}
      >
        <option value="">{defaultValue}</option>
        {children}
      </select>
    </div>
  );
}
