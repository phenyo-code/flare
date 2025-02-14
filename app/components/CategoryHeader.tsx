import Link from "next/link";

const categories: string[] = ["FOR YOU", "WOMEN", "MEN", "BRANDS", "HOME"];

interface CategoryHeaderProps {
  activeCategory: string;
}

export default function CategoryHeader({ activeCategory }: CategoryHeaderProps) {
  return (
    <div className="header-categories-row uppercase flex font-bold shadow-md mb-0 items-center py-2 pb-2 px-4 overflow-x-auto lg:justify-between">
      {categories.map((category) => {
        const isActive = category.toUpperCase() === activeCategory.toUpperCase(); // Ensure case-insensitive comparison
        const isForYou = category === "FOR YOU"; // Special handling for "FOR YOU"

        return (
          <Link
            key={category}
            href={isForYou ? "/for-you" : `/category/${category}`} // Redirect "FOR YOU" to its own page
            className={`category-tab flex-none text-center px-4 whitespace-nowrap text-sm sm:text-base ${
              isActive ? "text-red-500" : "text-black"
            } hover:text-red-500 transition-colors duration-200`}
            aria-current={isActive ? "page" : undefined} prefetch // Adds accessibility for the active link
          >
            {category} 
          </Link>
        );
      })}
    </div>
  );
}


