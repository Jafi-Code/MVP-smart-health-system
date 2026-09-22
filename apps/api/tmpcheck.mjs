import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const users = await prisma.user.findMany({
  where: { OR: [{ email: "reception@vut-clinic.test" }, { email: "nurse@vut-clinic.test" }, { phone: "0821234567" }] },
  select: { id: true, name: true, email: true, phone: true, role: true, station: true, clinicId: true }
});
console.log("USERS");
console.log(JSON.stringify(users, null, 2));
const appointments = await prisma.appointment.findMany({
  orderBy: [{ date: "asc" }, { time: "asc" }],
  include: { patient: { select: { name: true, phone: true } }, clinic: { select: { id: true, name: true } } }
});
console.log("APPOINTMENTS");
console.log(JSON.stringify(appointments, null, 2));
await prisma.$disconnect();
