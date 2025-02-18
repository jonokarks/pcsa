"use client";

import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  service: {
    id: string;
    name: string;
    price: number;
  };
}

export default function AddToCartButton({ service }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-300"
    >
      Book Now - ${service.price}
    </button>
  );
}
