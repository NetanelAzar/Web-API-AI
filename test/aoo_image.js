const { google } = require("googleapis");

// הגדרת מפתח API
const API_KEY = "AIzaSyBZySpMY5e954jY_zh4uEDCX-VEidlicbM";

// יצירת אובייקט Google Cloud Vision API
const vision = google.vision({
  version: "v1",
  auth: API_KEY,
});

// הגדרת טקסט ליצירת תמונה
const text = "A painting of a beautiful seascape with a colorful sunset";

const requestBody = {
  requests: [
    {
      image: {
        content: "טקסט ליצירת תמונה",
      },
      features: [{ type: "IMAGE_GENERATION" }],
    },
  ],
};

// הדפסת גוף הבקשה לאימות (אופציונלי)
console.log(JSON.stringify(requestBody, null, 2));

// יצירת תמונה
vision.images
  .annotate({
    requestBody,
  })
  .then((response) => {
    // קבלת תמונת base64
    const imageBase64 = response.responses[0].imageAnnotations[0].imageContent;

    // שמירת התמונה
    const fs = require("fs");
    fs.writeFileSync("image.png", Buffer.from(imageBase64, "base64"));

    // הצגת התמונה
    const img = require("imagemagick");
    img.read("image.png", (err, image) => {
      if (err) throw err;
      image.display();
    });
  })
  .catch((error) => {
    console.error(error);
    // ניתוח קוד שגיאה ספציפי (אופציונלי)
    if (error.code === 400) {
      console.error("שגיאת בקשה: ", error.errors);
    } else {
      console.error("שגיאה לא ידועה: ", error.message);
    }
  });
