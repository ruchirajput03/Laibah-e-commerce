"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderStatus() {
  const params = useSearchParams();
  const success = params.get("success");
  const orderId = params.get("orderId");

  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    if (!orderId) return;
    const fetchStatus = async () => {
      const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
      setStatus(res.data.payment.status);
    };
    fetchStatus();
  }, [orderId]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Order Status</h1>
      <p>{success ? `Payment ${status}` : "Payment canceled"}</p>
    </div>
  );
}
