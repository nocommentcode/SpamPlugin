const admin = require("firebase-admin");
const db = admin.database();
import { err, ErrorOr, succ } from "./Result";

export const getValFromDb = async (path: string): Promise<unknown> =>
  (await db.ref(path).get()).val();

export const setValInDb = async (path: string, val: unknown): Promise<void> =>
  await db.ref(path).set(val);
export const updateValInDb = async (
  path: string,
  val: Record<string, unknown>
): Promise<void> => await db.ref(path).update(val);

export const getRoundNumber = async (
  meetingId: string
): Promise<ErrorOr<number>> => {
  const currentRound = await getValFromDb(
    `/config/${meetingId}/current/currentState/plugins/spamMessages/roundNumber`
  );

  if (typeof currentRound !== "number") {
    return err(
      `[${meetingId}]: Current section in Database is invalid/malformed: "${currentRound}". (expected a number)`
    );
  }

  return succ(currentRound);
};

/**
 * Call this function to schedule an update to a firebase path in the future.  Note that all scheduled updates
 * associated with a specific meetingId will be cancelled (removed) when that meeting changes to a new section; if you
 * want a scheduled change to survive beyond the lifetime of the current section, use a different meetingId such as
 * "global".
 *
 * @param meetingId The meetingId with which to associate this scheduled update.  The meetingId does not actually have
 * to exist anywhere else in the system, and is only used for cleaning up the scheduled job.
 * @param timestamp The timestamp (ms since epoch) when the path should be updated.
 * @param path The Firebase path to update.
 * @param value The value to write to the nominated path at the nominated time.
 */
export const scheduleFirebaseUpdate = async (
  meetingId: string,
  timestamp: number,
  path: string,
  value: any
) => {
  const job = { timestamp, meetingId, path, value };
  await db.ref(`zoomSenseSchedule/meeting/${meetingId}/job`).push(job);
};
