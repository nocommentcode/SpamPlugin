"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleFirebaseUpdate = exports.getRoundNumber = exports.updateValInDb = exports.setValInDb = exports.getValFromDb = void 0;
const admin = require("firebase-admin");
const db = admin.database();
const Result_1 = require("./Result");
exports.getValFromDb = async (path) => (await db.ref(path).get()).val();
exports.setValInDb = async (path, val) => await db.ref(path).set(val);
exports.updateValInDb = async (path, val) => await db.ref(path).update(val);
exports.getRoundNumber = async (meetingId) => {
    const currentRound = await exports.getValFromDb(`/config/${meetingId}/current/currentState/plugins/spamMessages/roundNumber`);
    if (typeof currentRound !== "number") {
        return Result_1.err(`[${meetingId}]: Current section in Database is invalid/malformed: "${currentRound}". (expected a number)`);
    }
    return Result_1.succ(currentRound);
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
exports.scheduleFirebaseUpdate = async (meetingId, timestamp, path, value) => {
    const job = { timestamp, meetingId, path, value };
    await db.ref(`zoomSenseSchedule/meeting/${meetingId}/job`).push(job);
};
//# sourceMappingURL=db.js.map