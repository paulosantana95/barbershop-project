import { format } from "date-fns";
import Header from "../components/header";
import { ptBR } from "date-fns/locale";
import Search from "./components/search";
import BookingItem from "../components/booking-item";
import { db } from "../lib/prisma";
import BarbershopItem from "./components/barbershop-item";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, bookings] = await Promise.all([
    db.barbershop.findMany({}),
    session?.user
      ? await db.booking.findMany({
          where: {
            userId: (session.user as any).id,
          },
          include: {
            service: true,
            barbershop: true,
          },
          orderBy: {
            date: "desc",
          },
          take: 4,
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          {session?.user
            ? `Olá, ${session.user.name?.split(" ")[0]}`
            : "Olá, vamos agendar um corte hoje ?"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      {bookings.length > 0 && (
        <div className="mt-6">
          <h2 className="pl-5 text-xs mb-3 uppercase text-gray-400 font-bold">
            Últimos Agendamentos
          </h2>

          <div className="px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {bookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">
          Recomendados
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-[4.5rem]">
        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">
          Populares
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
