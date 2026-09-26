import Dexie, { type Table } from "dexie";

interface QueuedAction {
  id?: number;
  type: "UPDATE_STATUS";
  appointmentId: string;
  status: string;
  createdAt: number;
}

class SHSOfflineDB extends Dexie {
  actions!: Table<QueuedAction, number>;

  constructor() {
    super("shs-offline");
    this.version(1).stores({
      actions: "++id, createdAt",
    });
  }
}

export const offlineDB = new SHSOfflineDB();

export async function queueStatusUpdate(appointmentId: string, status: string) {
  await offlineDB.actions.add({
    type: "UPDATE_STATUS",
    appointmentId,
    status,
    createdAt: Date.now(),
  });
}

export async function getPendingCount() {
  return offlineDB.actions.count();
}

export async function flushQueue(
  updateFn: (appointmentId: string, status: string) => Promise<void>,
) {
  const actions = await offlineDB.actions.orderBy("createdAt").toArray();

  for (const action of actions) {
    try {
      await updateFn(action.appointmentId, action.status);
      await offlineDB.actions.delete(action.id!);
    } catch {
      break; // stop on first failure — retry next flush
    }
  }
}
