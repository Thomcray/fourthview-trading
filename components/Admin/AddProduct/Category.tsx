import { getCategories } from "@/app/_lib/data-services";
import { Label } from "@/components/ui/label";
import Selection from "@/components/Selection";

type ProductType = {
  product?: {
    id: number;
    name: string;
    description: string;
    productType: string;
    colours: string[];
    price: number;
    discount: number;
    discountType: string;
    categoryId: number;
    target: string;
    imageUrl: string[];
  } | null;
};

type Category = {
  id: number;
  name: string;
  image_url: string;
};
export default async function Category({ product }: ProductType) {
  const categories: Category[] | null = await getCategories();

  const defaultCategory = categories?.find(
    (category) => category.id === product?.categoryId
  );

  return (
    <div className="lg:w-92 md:w-92 max-sm:w-full flex lg:h-full flex-col gap-4 px-4 border-0">
      <h2 className="text-base text-black">Category</h2>

      <Label className="w-full text-sm text-slate-500 flex flex-col gap-0 text-left items-baseline font-light">
        Category
        <Selection
          defaultValue={
            defaultCategory ? defaultCategory.name : "Select Category"
          }
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
        <Selection
          defaultValue={product?.target ? product.target : "Select Target"}
          name="target"
          width="w-full"
        >
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
