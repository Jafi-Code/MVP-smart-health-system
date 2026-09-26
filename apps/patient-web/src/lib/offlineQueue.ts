import Dexie, { type Table } from "dexie";

interface QueuedBooking {
  id?: number;
  clinicId: string;
  date: string;
  time: string;
  reason?: string;
  createdAt: number;
}

class SHSPatientDB extends Dexie {
  bookings!: Table<QueuedBooking, number>;

  constructor() {
    super("shs-patient-offline");
    this.version(1).stores({
      bookings: "++id, createdAt",
    });
  }
}

export const patientOfflineDB = new SHSPatientDB();

export async function queueBooking(data: {
  clinicId: string;
  date: string;
  time: string;
  reason?: string;
}) {
  await patientOfflineDB.bookings.add({
    ...data,
    createdAt: Date.now(),
  });
}

export async function getPendingBookingsCount() {
  return patientOfflineDB.bookings.count();
}

export async function flushBookings(
  bookFn: (data: {
    clinicId: string;
    date: string;
    time: string;
    reason?: string;
  }) => Promise<void>,
) {
  const bookings = await patientOfflineDB.bookings
    .orderBy("createdAt")
    .toArray();

  for (const booking of bookings) {
    try {
      await bookFn({
        clinicId: booking.clinicId,
        date: booking.date,
        time: booking.time,
        reason: booking.reason,
      });
      await patientOfflineDB.bookings.delete(booking.id!);
    } catch {
      break;
    }
  }
}
