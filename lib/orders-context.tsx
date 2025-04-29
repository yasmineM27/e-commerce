"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/hooks/use-products";

export interface OrderItem {
  id: string;            // unique order id
  productId: string;
  name: string;
  price: number;
  quantity: number;
  orderedAt: string;     // ISO timestamp
}

interface OrdersContextType {
  orders: OrderItem[];
  addOrder: (item: Omit<OrderItem, "id" | "orderedAt">) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {
        // ignore malformed JSON
      }
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  function addOrder(item: Omit<OrderItem, "id" | "orderedAt">) {
    const newOrder: OrderItem = {
      ...item,
      id: `order-${Date.now()}`,
      orderedAt: new Date().toISOString(),
    };
    // Prepend new order to the list
    setOrders(prev => [newOrder, ...prev]);
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be inside OrdersProvider");
  return ctx;
}
