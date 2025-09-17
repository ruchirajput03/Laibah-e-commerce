'use client';



import Image from "next/image";
import Link from "next/link";



import { useWishlist } from "@/context/wishlistedContext";
import Header from "@/components/header";
import Footer from "@/components/footer";


// Types
interface Size {
  size: number;
  stock: number;
}

interface Variation {
  color: string;
  price: number;
  images: string[];
  sizes: Size[];
}


export default function WishlistPage() {
  const { wishlist } = useWishlist();


  



 

  if (wishlist.length === 0) {
    return <p className="text-center mt-8">Your wishlist is empty 💔</p>;
  }

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:pt-[120px] pt-[20px] gap-4 lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden">

        {wishlist.map((item) => (
          <Link href={`/productdetail/${item.id}`} key={item.id} className="group">

          <div key={item.id} className="p-4 rounded ">
             {/* Image container wizth fixed size and relative positioning */}

            <div className="relative w-full aspect-[1/1] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={process.env.API_URL + item.image}
                alt={item.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105 rounded-lg"
              />
            </div>

            <div className="flex justify-between mt-2">
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="font-semibold text-sm">AED {item.price}</p>
             
            </div>
          </div>

          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
}
