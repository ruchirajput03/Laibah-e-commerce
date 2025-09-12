interface Size {
  size: number;
  stock: number;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: number | null;
  onSelectSize: (size: number) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s, i) => {
        const isOutOfStock = s.stock === 0;
        const isSelected = selectedSize === s.size;

        return (
          <button
            key={i}
            disabled={isOutOfStock}
            onClick={() => !isOutOfStock && onSelectSize(s.size)}
            className={`px-3 py-1 border rounded text-sm transition-all
              ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                  : isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-gray-100"
              }
            `}
          >
            {s.size}
          </button>
        );
      })}
    </div>
  );
}
