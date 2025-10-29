import Category from "./Category";
import ProductForm from "./ProductForm";

export default function AddProduct() {
  return (
    <div className="w-full border-0">
      <ProductForm>
        <Category />
      </ProductForm>
    </div>
  );
}
