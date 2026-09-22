import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: "reception@vut-clinic.test" },
        { email: "nurse@vut-clinic.test" },
        { phone: "0821234567" },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      station: true,
      clinicId: true,
    },
  });

  console.log("USERS");
  console.log(JSON.stringify(users, null, 2));

  const appointments = await prisma.appointment.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: {
      patient: { select: { id: true, name: true, phone: true } },
      clinic: { select: { id: true, name: true } },
    },
  });

  console.log("APPOINTMENTS");
  console.log(JSON.stringify(appointments, null, 2));

  const today = new Date(
    new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
  );
  console.log("TODAY_UTC", today.toISOString());

  const filtered = await prisma.appointment.findMany({
    where: {
      clinicId: "cln_vut_campus",
      date: today,
      status: { in: ["SCHEDULED", "CHECKED_IN"] },
    },
    orderBy: { time: "asc" },
    include: { patient: { select: { id: true, name: true, phone: true } } },
  });

  console.log("RECEPTION_FILTERED");
  console.log(JSON.stringify(filtered, null, 2));
} finally {
  await prisma.$disconnect();
}
