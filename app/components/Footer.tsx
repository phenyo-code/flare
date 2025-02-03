// Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 mt-0">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

       {/* Newsletter */}
       <div>
          <h4 className="text-xl font-semibold mb-4">Newsletter</h4>
          <p className="text-gray-400 mb-4">Stay updated with our latest news and offers.</p>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 bg-white text-gray-400 "
            />
            <button
              type="submit"
              className="p-2 bg-red-500 text-white hover:bg-red-600"
            >
              Subscribe
            </button>
          </form>
        </div>

     

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-gray-400 hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-gray-400 hover:text-white">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-400 mb-4">Have questions? Feel free to reach out.</p>
          <p className="text-gray-400">Email: <a href="mailto:support@flare.com" className="hover:text-white">support@flare.com</a></p>
          <p className="text-gray-400">Phone: +1 (234) 567-890</p>
        </div>

        
      </div>

      {/* Footer Bottom */}
      <div className=" text-gray-400 py-4 mt-8 text-center">
        <p>© {new Date().getFullYear()} FLARE. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
