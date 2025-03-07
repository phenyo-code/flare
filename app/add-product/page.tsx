"use client";

import { useState, useTransition } from "react";
import { AddProduct } from "../actions/addProduct";
import AdminHeader from "../components/AdminHeader";

export default function AddProductPage() {
  const [buttonText, setButtonText] = useState("Add Product");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setButtonText("Adding Product...");

    startTransition(async () => {
      await AddProduct(formData);
      setButtonText("Added Product ✅");

      // Reset button text after a delay
      setTimeout(() => setButtonText("Add Product"), 2000);
    });
  };

  return (
    <div>
      <AdminHeader />
      <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>

        <form action={handleSubmit}>
          <input
            name="name"
            placeholder="Product Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          <input
            name="originalPrice"
            placeholder="Original Price"
            type="number"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />

          {/* Category Dropdown */}
          <select
            name="category"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md bg-white"
            required
          >
            <option value="">Select Category</option>
            <option value="MEN">MEN</option>
            <option value="WOMEN">WOMEN</option>
            <option value="BRANDS">BRANDS</option>
            <option value="HOME">ACCESSORIES</option>
          </select>

          <input
            name="filter"
            placeholder="Filter"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          {/* New Fields */}
          <input
            name="style"
            placeholder="Brand Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />
          <input
            name="type"
            placeholder="Type"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />
          <input
            name="logo"
            placeholder="Logo URL (e.g., /images/nike-logo.png)"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />

          {/* Matches With (Multi-Input) */}
          <label className="block text-sm font-medium text-gray-700">
            Matches With (Comma Separated)
          </label>
          <input
            name="matchesWith"
            placeholder="Enter matching product types (e.g., T-shirt, Jeans, Sneakers)"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />

          {/* Image Inputs */}
          {[...Array(5)].map((_, index) => (
            <input
              key={index}
              name={`image${index + 1}`}
              placeholder={`Image URL ${index + 1}`}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required={index === 0}
            />
          ))}

          {/* Sizes Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Sizes (e.g., &quot;Small:10:50:Measurement_cm&quot;)
            </label>

            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                name="sizes"
                placeholder="Size:Sold:Quantity:Measurement (e.g., S:10:50:cm)"
                className="w-2/3 p-2 border border-gray-300 rounded-md"
              />
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white p-2 rounded-md"
            disabled={isPending}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}