'use client';
import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (qty: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, setQuantity }) => {
  const decrease = () => setQuantity(Math.max(1, quantity - 1));
  const increase = () => setQuantity(quantity + 1);

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700 font-medium text-[13px]">Quantity:</span>
      <button onClick={decrease} className="font-medium">-</button>
      <span className="px-3 py-1 border bg-black text-white">{quantity}</span>
      <button onClick={increase} className="font-medium">+</button>
    </div>
  );
};

export default QuantitySelector;
