function updateLocalTime() {
    // יצירת אובייקט Date עבור הזמן המקומי
    const now = new Date();

    // קבלת אזור הזמן של המשתמש
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // קבלת השעה המקומית באזור הזמן של המשתמש
    const localTime = now.toLocaleString('en-US', { timeZone: userTimezone, hour12: true });

    // הצגת השעה המקומית באלמנט עם ה-id "datetime"
    document.getElementById('datetime').innerText = localTime;
}

// עדכון השעה המקומית כל 1 שנייה
setInterval(updateLocalTime, 1000);



