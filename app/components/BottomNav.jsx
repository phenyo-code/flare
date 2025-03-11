import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { RiUser3Fill } from "react-icons/ri";
import { CgShoppingCart } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { RiMenu4Line } from "react-icons/ri";

export default function BottomNav({
  cartItems = [],
  isStandalone = false,
  activePath = "/",
  onMenuToggle,
}) {
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!isStandalone) return null;

  return (
    <div className="bottom-nav w-full bg-white fixed bottom-0 left-0 flex justify-around py-4 border-t shadow-lg z-50 pb-4">
      <Link href="/" className={`flex flex-col items-center ${activePath === "/" ? "text-gray-800" : "text-gray-600"}`}>
        <IoMdHome className="text-3xl" />
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center ${activePath === "/profile" ? "text-gray-800" : "text-gray-600"}`}
      >
        {activePath === "/profile" ? <RiUser3Fill className="text-3xl" /> : <FiUser className="text-3xl" />}
      </Link>
      <Link href="/search" className="text-white flex flex-col items-center relative">
        <div
          className={`shadow-md transform -translate-y-3 ${activePath === "/search" ? "bg-purple-700" : "bg-purple-500"}`}
          style={{
            clipPath: "polygon(75% 0%, 46% 10%, 87% 30%, 93% 60%, 74% 60%, 50% 96%, 20% 90%, 0% 66%, 10% 23%, 20% 10%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "50px",
            borderRadius: "30px",
          }}
        >
          <CiSearch className="text-3xl font-bold text-white" />
        </div>
      </Link>
      <div className="relative flex flex-col items-center">
        <Link
          href="/cart"
          className={`flex flex-col items-center ${activePath === "/cart" ? "text-gray-800" : "text-gray-600"}`}
        >
          <CgShoppingCart id="cart-icon"
            className={`text-3xl ${activePath === "/cart" ? "scale-110 transition-transform" : ""}`}
          />
          {totalCartItems > 0 && (
            <span className="absolute top-[-6px] right-[-6px] w-3.5 h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <RiMenu4Line
          className={`text-3xl ${activePath === "/menu" ? "text-gray-800" : "text-gray-600"} cursor-pointer`}
          onClick={onMenuToggle}
        />
      </div>
    </div>
  );
}