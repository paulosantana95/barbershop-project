import { getServerSession } from "next-auth";
import Header from "../components/header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "../lib/prisma";
import BookingItem from "../components/booking-item";
import { isFuture, isPast } from "date-fns";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    await db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
      orderBy: {
        date: "desc",
      },
    }),
    await db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lte: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
      orderBy: {
        date: "desc",
      },
    }),
  ]);

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {confirmedBookings.length > 0 && (
          <div>
            <h2 className="text-gray-400 uppercase font-bol text-sm mt-6 mb-3">
              Confirmados
            </h2>

            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}

        {finishedBookings.length > 0 && (
          <div>
            <h2 className="text-gray-400 uppercase font-bol text-sm mt-6 mb-3">
              Finalizados
            </h2>

            <div className="flex flex-col gap-3">
              {finishedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}

        {confirmedBookings.length === 0 && finishedBookings.length === 0 && (
          <h2 className="text-gray-400 font-bol text-sm mt-6 mb-3">
            Você ainda não fez nenhum agendamento.
          </h2>
        )}
      </div>
    </>
  );
};

export default BookingsPage;
