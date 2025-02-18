"use client";

import { CartProvider } from "@/context/CartContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
