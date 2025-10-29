import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PasswordType = {
  password?: string;
};
export default function PasswordValidity({ password }: PasswordType) {
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[@$!%*?&]/;

  return (
    <RadioGroup defaultValue="" className="border rounded-md px-4 py-4">
      <div className="flex items-center gap-3">
        <RadioGroupItem
          value="characters"
          disabled
          className={`${
            (password ?? "").length >= 8
              ? "border bg-green-800"
              : "border-gray-300 opacity-50"
          }`}
        />

        <label className="block text-xs font-medium text-gray-500">
          8 characters long
        </label>
      </div>

      <div className="flex items-center gap-3">
        <RadioGroupItem
          value="uppercase"
          disabled
          className={`${
            hasUpperCase.test(password ?? "")
              ? "border bg-green-800"
              : "border-gray-300 opacity-50"
          }`}
        />

        <label className="block text-xs font-medium text-gray-500">
          Contains at least one uppercase letter
        </label>
      </div>

      <div className="flex items-center gap-3">
        <RadioGroupItem
          value="lowercase"
          disabled
          className={`${
            hasLowerCase.test(password ?? "")
              ? "border bg-green-800"
              : "border-gray-300 opacity-50"
          }`}
        />

        <label className="block text-xs font-medium text-gray-500">
          Contains at least one lowercase letter
        </label>
      </div>

      <div className="flex items-center gap-3">
        <RadioGroupItem
          value="number"
          disabled
          className={`${
            hasNumber.test(password ?? "")
              ? "border bg-green-800"
              : "border-gray-300 opacity-50"
          }`}
        />

        <label className="block text-xs font-medium text-gray-500">
          Contains at least one number
        </label>
      </div>

      <div className="flex items-center gap-3">
        <RadioGroupItem
          value="specialChar"
          disabled
          className={`${
            hasSpecialChar.test(password ?? "")
              ? "border bg-green-800"
              : "border-gray-300 opacity-50"
          }`}
        />

        <label className="block text-xs font-medium text-gray-500">
          Contains at least one special character e.g. @$!%*?&
        </label>
      </div>
    </RadioGroup>
  );
}
