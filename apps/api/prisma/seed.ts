import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─────────────────────────────────────────────
  // CLINICS
  // ─────────────────────────────────────────────
  const vutClinic = await prisma.clinic.upsert({
    where: { id: "cln_vut_campus" },
    update: {},
    create: {
      id: "cln_vut_campus",
      name: "VUT Campus Clinic",
      address: "Vaal University of Technology, Vanderbijlpark",
      phone: "016 950 9000",
      operatingHours: {
        monday: { open: "08:00", close: "16:00" },
        tuesday: { open: "08:00", close: "16:00" },
        wednesday: { open: "08:00", close: "16:00" },
        thursday: { open: "08:00", close: "16:00" },
        friday: { open: "08:00", close: "16:00" },
        saturday: null,
        sunday: null,
      },
    },
  });

  const sebokengClinic = await prisma.clinic.upsert({
    where: { id: "cln_sebokeng" },
    update: {},
    create: {
      id: "cln_sebokeng",
      name: "Sebokeng Community Clinic",
      address: "Sebokeng, Vanderbijlpark",
      phone: "016 988 0000",
      operatingHours: {
        monday: { open: "07:30", close: "16:00" },
        tuesday: { open: "07:30", close: "16:00" },
        wednesday: { open: "07:30", close: "16:00" },
        thursday: { open: "07:30", close: "16:00" },
        friday: { open: "07:30", close: "16:00" },
        saturday: { open: "08:00", close: "13:00" },
        sunday: null,
      },
    },
  });

  console.log(`Created clinics: ${vutClinic.name}, ${sebokengClinic.name}`);

  // ─────────────────────────────────────────────
  // STAFF USERS
  // ─────────────────────────────────────────────
  const staffPassword = await bcrypt.hash("StaffPass123!", 12);

  const receptionist = await prisma.user.upsert({
    where: { email: "reception@vut-clinic.test" },
    update: {},
    create: {
      name: "Thandi Nkosi",
      email: "reception@vut-clinic.test",
      phone: "0820000001",
      passwordHash: staffPassword,
      role: "RECEPTIONIST",
      clinicId: "cln_vut_campus",
    },
  });

  const nurse = await prisma.user.upsert({
    where: { email: "nurse@vut-clinic.test" },
    update: {},
    create: {
      name: "Sister Nomsa Dlamini",
      email: "nurse@vut-clinic.test",
      phone: "0820000002",
      passwordHash: staffPassword,
      role: "NURSE",
      clinicId: "cln_vut_campus",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@vut-clinic.test" },
    update: {},
    create: {
      name: "Mr Thapelo Kgakatsi",
      email: "manager@vut-clinic.test",
      phone: "0820000003",
      passwordHash: staffPassword,
      role: "MANAGER",
      clinicId: "cln_vut_campus",
    },
  });

  console.log(
    `Created staff: ${receptionist.name}, ${nurse.name}, ${manager.name}`,
  );

  // ─────────────────────────────────────────────
  // DEMO PATIENT
  // ─────────────────────────────────────────────
  const patientPassword = await bcrypt.hash("PatientPass123!", 12);

  const patient = await prisma.user.upsert({
    where: { phone: "0821234567" },
    update: {},
    create: {
      name: "Gogo Maria Dlamini",
      phone: "0821234567",
      idNumber: "5501015800083",
      passwordHash: patientPassword,
      role: "PATIENT",
    },
  });

  console.log(`Created patient: ${patient.name}`);

  // ─────────────────────────────────────────────
  // DEMO APPOINTMENTS FOR TODAY
  // ─────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const demoAppointments = [
    {
      patientId: patient.id,
      clinicId: "cln_vut_campus",
      createdById: receptionist.id,
      date: today,
      time: "08:30",
      reason: "Follow-up consultation",
      status: "CHECKED_IN",
      queuePosition: 1,
    },
    {
      patientId: patient.id,
      clinicId: "cln_vut_campus",
      createdById: receptionist.id,
      date: today,
      time: "09:15",
      reason: "Blood pressure review",
      status: "SCHEDULED",
      queuePosition: 2,
    },
    {
      patientId: patient.id,
      clinicId: "cln_vut_campus",
      createdById: receptionist.id,
      date: today,
      time: "10:00",
      reason: "Medication refill",
      status: "IN_CONSULTATION",
      queuePosition: 3,
    },
    {
      patientId: patient.id,
      clinicId: "cln_vut_campus",
      createdById: receptionist.id,
      date: today,
      time: "11:45",
      reason: "Routine check-up",
      status: "DONE",
      queuePosition: 4,
    },
  ] as const;

  const appointmentEntries = await Promise.all(
    demoAppointments.map(async (entry) =>
      prisma.appointment.upsert({
        where: {
          id: `${entry.clinicId}-${entry.time}-${entry.patientId}`,
        },
        update: entry,
        create: {
          ...entry,
          id: `${entry.clinicId}-${entry.time}-${entry.patientId}`,
        },
      }),
    ),
  );

  console.log(
    `Created ${appointmentEntries.length} demo appointments for today.`,
  );
  console.log("");
  console.log("Seed complete!");
  console.log("");
  console.log("Login credentials:");
  console.log("  Receptionist: reception@vut-clinic.test / StaffPass123!");
  console.log("  Nurse:        nurse@vut-clinic.test / StaffPass123!");
  console.log("  Manager:      manager@vut-clinic.test / StaffPass123!");
  console.log("  Patient:      0821234567 / PatientPass123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
