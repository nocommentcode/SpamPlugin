import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { getRoundNumber, scheduleFirebaseUpdate } from "./db";

//const { snapshot } = require("firebase-functions");
//const admin = require("firebase-admin");
const db = admin.database();
export const spamAnswers = functions.database
  .ref("/data/chats/{meetingId}/{sensor}/{chatId}")
  .onCreate(async (value, context) => {
    const { meetingId, chatId } = context.params;

    const {
      msg: messageContent,
      msgSender,
      msgSenderName,
      timestamp,
    } = value.val();

    //if anything is missing from the message exit the function
    // if (!messageContent || !msgSender || !msgSenderName || !timestamp) return;
    await db.ref(`/data/spamAnswers/${meetingId}/0/answers/`).push({
      senderId: msgSender,
      senderName: msgSenderName,
    });

    // //Check if plugin is enabled
    // const config = (
    //   await db
    //     .ref(`/config/${meetingId}/current/currentState/plugins/spammessages`)
    //     .get()
    // ).val();
    // if (!config || !config.enabled) return;

    // //getting the round information from the config file
    // const roundNumber = getRoundNumber(meetingId);

    // if (chatId === "message") return;

    // //get the message content
    // //   const {
    // //     msg: messageContent,
    // //     msgSender,
    // //     msgSenderName,
    // //     timestamp,
    // //   } = snapshot.val();

    // //   //if anything is missing from the message exit the function
    // //  // if (!messageContent || !msgSender || !msgSenderName || !timestamp) return;

    // //   setValInDb(`data/spamAnswers/${meetingId}/${roundNumber}/answers`, {
    // //     senderId: msgSender,
    // //     senderName: msgSenderName,
    // //   });

    // const chatText = messageContent.toLowerCase().trim();
    // const currentSection = (
    //   await db.ref(`/config/${meetingId}/current/currentSection`).get()
    // ).val();

    // var query = db.ref(
    //   `/config/${meetingId}/current/currentState/plugins/spamMessages/${roundNumber}/solutions`
    // );

    // let correct = false;
    // query.once("value").then(function (snapshot) {
    //   snapshot.forEach(function (childSnapshot) {
    //     if (childSnapshot.val().equalTo(chatText)) {
    //       correct = true;
    //     }
    //   });
    // });

    // if (correct) {
    //   await scheduleFirebaseUpdate(
    //     meetingId,
    //     timestamp,
    //     `config/${meetingId}/current/currentSection`,
    //     currentSection.data + 1
    //   );
    // }
  });
