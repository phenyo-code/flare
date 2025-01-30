import Link from "next/link";

const categories = ["WOMEN", "MEN", "BRANDS", "HOME", "JEWELLERY"];

interface CategoryHeaderProps {
  activeCategory: string;
}

export default function CategoryHeader({ activeCategory }: CategoryHeaderProps) {
  return (
    <div className="header-categories-row uppercase flex font-bold shadow-md mb-0 items-center py-2 pb-2 px-4 overflow-x-auto lg:justify-between">
      {categories.map((category) => {
        const isActive = category === activeCategory; // Check if the category is active
        return (
          <Link
            key={category}
            href={`/category/${category}`}
            className={`category-tab flex-none text-center px-4 whitespace-nowrap text-sm sm:text-base ${
              isActive ? "text-red-500" : "text-black"
            }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}


