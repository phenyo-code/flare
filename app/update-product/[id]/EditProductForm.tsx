"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProduct, deleteProduct } from "@/actions/updateProduct";

type Size = {
  size: string;
  sold: number;
  quantity: number;
  measurement: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  Originalprice?: number | null;
  category: string;
  filter: string;
  style?: string | null;
  type?: string | null;
  matchesWith?: string[] | null;
  images: string[];
  sizes: Size[];
};

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);

    // Construct the FormData for delete action
    const formData = new FormData();
    formData.append("id", product.id);

    try {
      await deleteProduct(formData); // Pass FormData to deleteProduct
      router.push("/admin"); // Redirect after deletion
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting product", error);
    }
  };

  return (
    <form action={updateProduct} className="space-y-6">
      <input type="hidden" name="id" value={product.id} />

      {/* Product Image */}
      <div className="flex justify-center mb-6">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={200}
            height={200}
            className="object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center bg-gray-200 rounded-lg text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="label">Name</label>
        <input name="name" defaultValue={product.name} className="input-field" required />
      </div>

      {/* Price */}
      <div>
        <label className="label">Price (R)</label>
        <input name="price" type="number" defaultValue={product.price} className="input-field" required min="0" step="0.01" />
      </div>

      {/* Original Price */}
      <div>
        <label className="label">Original Price (R)</label>
        <input name="originalPrice" type="number" defaultValue={product.Originalprice ?? product.price} className="input-field" min="0" step="0.01" />
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select name="category" defaultValue={product.category} className="input-field" required>
          <option value="MEN">MEN</option>
          <option value="WOMEN">WOMEN</option>
          <option value="BRANDS">BRANDS</option>
          <option value="HOME">HOME</option>
        </select>
      </div>

      {/* Filter */}
      <div>
        <label className="label">Filter</label>
        <input name="filter" defaultValue={product.filter} className="input-field" required />
      </div>

      {/* Style & Type */}
      <div>
        <label className="label">Style</label>
        <input name="style" defaultValue={product.style || ""} className="input-field" />
      </div>
      <div>
        <label className="label">Type</label>
        <input name="type" defaultValue={product.type || ""} className="input-field" />
      </div>

      {/* Matches With */}
      <div>
        <label className="label">Matches With</label>
        <input
          name="matchesWith"
          defaultValue={product.matchesWith?.join(", ") || ""}
          className="input-field"
          placeholder="e.g., T-shirt, Jeans"
        />
      </div>

      {/* Images */}
      <div>
        <label className="label">Images</label>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <input
              key={index}
              name={`image${index + 1}`}
              defaultValue={product.images[index] || ""}
              placeholder={`Image URL ${index + 1}`}
              className="input-field"
            />
          ))}
        </div>
      </div>

      {/* Sizes (Read-Only) */}
      <div>
        <label className="label">Sizes (Read-Only)</label>
        <div className="space-y-2">
          {product.sizes.map((size, index) => (
            <input
              key={index}
              value={`${size.size} - Sold: ${size.sold}, Qty: ${size.quantity}, ${size.measurement}`}
              className="input-field bg-gray-200 cursor-not-allowed"
              readOnly
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button type="submit" className="btn-primary flex-1">
          Update Product
        </button>

        {/* DELETE BUTTON */}
        <button
          type="button"
          disabled={isDeleting}
          className="btn-secondary flex-1"
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>
    </form>
  );
}
