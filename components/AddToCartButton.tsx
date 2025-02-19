"use client";

import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  service: {
    id: string;
    name: string;
    price: number;
  };
}

export default function AddToCartButton({ service }: AddToCartButtonProps) {
  const router = useRouter();

  const handleBookNow = () => {
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleBookNow}
      className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-300"
    >
      Book Now - ${service.price}
    </button>
  );
}
