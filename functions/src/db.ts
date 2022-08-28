import { Team, Teams } from "./types";

const admin = require("firebase-admin");
const db = admin.database();

export const getValFromDb = async (path: string): Promise<unknown> =>
  (await db.ref(path).get()).val();

export const setValInDb = async (path: string, val: unknown): Promise<void> =>
  await db.ref(path).set(val);

export const updateValInDb = async (
  path: string,
  val: Record<string, unknown>
): Promise<void> => await db.ref(path).update(val);

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

/**
 * Returns a team id from a player id
 * @param msgSenderId the Id of the player who's team we want to find
 * @param meetingId the meeting id
 * @returns the team's id
 */
export const getPlayersTeam = async (
  msgSenderId: string,
  meetingId: string
): Promise<string> => {
  const teams = (await getValFromDb(
    `data/plugins/teamPlugin/${meetingId}`
  )) as Teams;

  const teamId = Object.entries(teams)
    .map(([teamId]) => {
      // find member in this team with the id wer'e looking fo
      const member = teams[teamId].members.find(
        (member) => member.userId === msgSenderId
      );

      if (member) {
        return teamId;
      }
      return undefined;
    })
    // find only the teamId
    .find((teamId) => teamId !== undefined);

  if (!teamId) {
    // teamId not found -> error
    return "";
  }

  return teamId;
};

/**
 * Returns a zoom bot id associated with a particular team
 * @param meetingId The meeting id
 * @param teamId the team id
 * @returns the bot id
 */
export const getBotForTeam = async (
  meetingId: string,
  teamId: string
): Promise<string> => {
  const team = (await getValFromDb(
    `data/plugins/teamPlugin/${meetingId}/${teamId}`
  )) as Team;
  return team.sensorId;
};

/**
 * Increments a team's score
 * @param meetingId the id of the meeting
 * @param teamId the id of the team
 * @param scoreIncrement the amount to increment the score by
 * @param timestamp the timestamp
 */
export const incrementTeamsScore = async (
  meetingId: string,
  teamId: string,
  scoreIncrement: number,
  timestamp: number
): Promise<void> => {
  await setValInDb(`data/plugins/leaderboard/${meetingId}/scoreEvents`, {
    amount: scoreIncrement,
    teamId,
    timestamp,
  });
};

export const getAllBots = async (meetingId: string): Promise<string[]> => {
  const activeSpeakers = await getValFromDb(`/data/chats/${meetingId}`);

  if (!activeSpeakers || typeof activeSpeakers !== "object") return [];

  return Object.entries(
    (activeSpeakers as Record<string, { isInBO: boolean }>) ?? {}
  )
    .filter(([, { isInBO }]) => isInBO)
    .map(([zoomSensor]) => zoomSensor);
};

// Request that sensor with ID `sensorId` broadcasts the given message
// (i.e. sends it to everyone in the room)
export const broadcastMessage = async (
  meetingId: string,
  sensorId: string,
  content: string
): Promise<void> => {
  await db.ref(`data/chats/${meetingId}/${sensorId}/message`).push({
    msg: content,
    receiver: 0,
  });
};
