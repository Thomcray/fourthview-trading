import { getCategories } from "@/app/_lib/data-services";
import Selection from "@/components/Selection";
import { Label } from "@/components/ui/label";

export default async function CategoryList() {
  const categories = await getCategories();

  return (
    <div>
      <Label className="w-full text-sm text-slate-500 flex flex-col gap-0 text-left items-baseline font-light">
        Category
        <Selection
          defaultValue="Select Category"
          name="category"
          width="w-full"
        >
          {categories?.map((category) => (
            <option value={category.name} key={category.name}>
              {category.name}
            </option>
          ))}
        </Selection>
      </Label>
    </div>
  );
}
