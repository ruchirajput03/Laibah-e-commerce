'use client';
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="w-full border rounded mb-4">
        <Image
          src={process.env.API_URL+images[active]}
          alt="Main"
          width={500}
          height={500}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex gap-2">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={process.env.API_URL+img}
            alt={`Thumb ${idx}`}
            width={80}
            height={80}
            className={`cursor-pointer border rounded ${
              idx === active ? "border-black" : "border-gray-300"
            }`}
            onClick={() => setActive(idx)}
          />
        ))}
      </div>
    </div>
  );
}
