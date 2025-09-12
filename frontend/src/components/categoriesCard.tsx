'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CategoryProps {
  title: string;
  subtitle?: string;
  image: string;
  link: string;
}

export default function CategoryCard({ title, subtitle, image, link }: CategoryProps) {
  return (
    <Link href={link} className="block group rounded-2xl overflow-hidden relative h-64 sm:h-72 lg:h-80">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* Overlay */}
      <div className="absolute inset-0  bg-opacity-20 group-hover:bg-opacity-40 transition duration-300" />

      {/* Text */}
      <div className="absolute bottom-6 left-6 text-white z-10">
        <h3 className="text-lg sm:text-xl font-semibold capitalize">{title}</h3>
        {subtitle && <p className="text-sm sm:text-base">{subtitle}</p>}
      </div>
    </Link>
  );
}
