"use client";

import { Button } from "@/app/components/ui/button";
import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <div className="h-[250px] w-full relative">
        <Button
          onClick={handleBackClick}
          size="icon"
          variant="outline"
          className="top-4 left-4 absolute z-50">
          <ChevronLeftIcon />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="top-4 right-4 absolute z-50">
          <MenuIcon />
        </Button>

        <Image
          className="object-cover opacity-75"
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
        />
      </div>

      <div className="px-5 pt-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>
        <div className="flex item-center gap-2 mt-2">
          <MapPinIcon className="text-primary" />
          <p>{barbershop.address}</p>
        </div>
        <div className="flex item-center gap-2 mt-2">
          <StarIcon className="text-primary" />
          <p>5,0 (899 avaliações)</p>
        </div>
      </div>
    </div>
  );
};

export default BarbershopInfo;
