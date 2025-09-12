import Image from 'next/image';

interface Props {
  title: string;
  description: string;
  image: string;
}

export default function CategoryHeader({ title, description, image }: Props) {
  return (
    <div className="relative w-full h-64 mb-8">
      <Image src={image} alt={title} fill className="object-cover rounded-lg" />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-lg">{description}</p>
      </div>
    </div>
  );
}
