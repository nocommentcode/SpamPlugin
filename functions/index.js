const admin = require("firebase-admin");
admin.initializeApp();

const { spamAnswers } = require("./lib/spamAnswers");

exports.spamAnswers = spamAnswers;
