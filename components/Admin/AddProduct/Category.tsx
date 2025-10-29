import { getCategories } from "@/app/_lib/data-services";
import { Label } from "@/components/ui/label";
import Selection from "@/components/Selection";

export default async function Category() {
  const categories = await getCategories();

  return (
    <div className="lg:w-92 md:w-92 max-sm:w-full flex lg:h-full flex-col gap-4 px-4 border-0">
      <h2 className="text-base text-black">Category</h2>

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

      <Label className="w-full text-sm text-slate-500 flex flex-col gap-0 text-left items-baseline font-light">
        Target
        <Selection defaultValue="Select Target" name="target" width="w-full">
          {["Men", "Women", "Kids"]?.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </Selection>
      </Label>
    </div>
  );
}
