import { useState } from "react";
import { MdImage } from "react-icons/md";
import { SDGMapping, AgendaMapping } from "../../shared/types/types";
import { getImageUrl } from "../../../utils/imageUrl";

interface CardProps {
  card: SDGMapping | AgendaMapping;
  onClick?: () => void;
  className?: string;
}


export const Card = ({ card, onClick, className }: CardProps) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getImageUrl(card.image_path);

  return (
    <div
      onClick={onClick}
      className={`flex h-[19rem] min-w-40 flex-col items-center justify-center rounded-md border bg-white shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="h-40 w-full overflow-hidden p-2 flex items-center justify-center">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={card.name}
            className="h-full w-full object-contain"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-md bg-gray-100 text-gray-400">
            <MdImage className="size-10" />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center p-3 text-center">
        <p className="text-sm font-semibold text-gray-700">{card.name}</p>
      </div>
    </div>
  );
};