import Link from "next/link";

const categories: string[] = ["ALL", "FOR YOU",  "WOMEN", "MEN", "BRANDS", "ACCESSORIES"];

interface CategoryHeaderProps {
  activeCategory: string;
}

export default function CategoryHeader({ activeCategory }: CategoryHeaderProps) {
  return (
    <div className="header-categories-row uppercase flex font-bold mb-0 items-start pt-2 px-2 overflow-x-auto lg:justify-between">
      {categories.map((category) => {
        const isActive = category.toUpperCase() === activeCategory.toUpperCase();
        const isForYou = category === "FOR YOU";
        const isAll = category === "ALL";

        return (
          <div key={category} className="flex flex-col items-center">
            <Link
              href={isForYou ? "/for-you" : isAll ? "/" : `/category/${category}`}
              className={`category-tab text-gray-700 text-center px-4 pb-2 whitespace-nowrap text-sm sm:text-base ${
                isActive ? "text-black font-bold" : "text-black"
              } hover:text-black transition-colors duration-200`}
              aria-current={isActive ? "page" : undefined}
              prefetch
            >
              {category}
            </Link>
            {isActive && <div className="w-full bg-gray-700 h-[5px] mt-0" />}
          </div>
        );
      })}
    </div>
  );
}
