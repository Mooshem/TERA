import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import vision from "@google-cloud/vision";

admin.initializeApp();

const client = new vision.ImageAnnotatorClient();

export const analyzeCleanupImage = functions.https.onCall(async (data, context) => {
  const { imageUrl, userId } = data;

  if (!imageUrl || !userId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing data");
  }

  // 1. Call Google Vision
  const [result] = await client.labelDetection(imageUrl);
  const labels = result.labelAnnotations || [];

  const labelNames = labels.map(l =>
    l.description?.toLowerCase()
  );

  // 2. SIMPLE SCORING RULES
  let points = 0;

  if (labelNames.includes("trash") || labelNames.includes("garbage")) {
    points += 10;
  }

  if (labelNames.includes("bottle") || labelNames.includes("plastic")) {
    points += 5;
  }

  if (labelNames.includes("outdoor") || labelNames.includes("park")) {
    points += 5;
  }

  // 3. Update user points
  const userRef = admin.firestore().doc(`users/${userId}`);

  await userRef.update({
    points: admin.firestore.FieldValue.increment(points),
  });

  return {
    success: true,
    pointsAwarded: points,
    labels: labelNames,
  };
});