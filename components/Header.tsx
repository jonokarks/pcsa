"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Cart from "./Cart";

export default function Header() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-teal-600">
            Pool Compliance SA
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition duration-150"
            >
              Home
            </Link>
            <Link
              href="/book-compliance"
              className="text-gray-600 hover:text-gray-900 transition duration-150"
            >
              Book Inspection
            </Link>
            <Link
              href="/about-us"
              className="text-gray-600 hover:text-gray-900 transition duration-150"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-gray-900 transition duration-150"
            >
              Contact
            </Link>
          </div>

          <button
            onClick={toggleCart}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden mt-4 space-y-2">
          <Link
            href="/"
            className="block text-gray-600 hover:text-gray-900 transition duration-150"
          >
            Home
          </Link>
          <Link
            href="/book-compliance"
            className="block text-gray-600 hover:text-gray-900 transition duration-150"
          >
            Book Inspection
          </Link>
          <Link
            href="/about-us"
            className="block text-gray-600 hover:text-gray-900 transition duration-150"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="block text-gray-600 hover:text-gray-900 transition duration-150"
          >
            Contact
          </Link>
        </div>
      </nav>
      <Cart />
    </header>
  );
}
