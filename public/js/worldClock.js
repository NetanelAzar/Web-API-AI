    // רשימת המדינות והערים
    const timezones = [
        { city: "New York", timezone: "America/New_York" },
        { city: "London", timezone: "Europe/London" },
        { city: "Paris", timezone: "Europe/Paris" },
        { city: "Jerusalem", timezone: "Asia/Jerusalem" }, 
        { city: "Tokyo", timezone: "Asia/Tokyo" },
        // הוספת מדינות נוספות כרצונך
    ];

    // פונקציה ליצירת שעון עבור מדינה נתונה
    function createClock(city, timezone) {
        // יצירת אלמנט חדש לשעון
        const clockElement = document.createElement('div');
        clockElement.classList.add('clock');

        // הוספת שעון ל-DOM
        document.getElementById("clocks").appendChild(clockElement);

        // עדכון השעה לפי המדינה הנבחרת
        function updateClock() {
            const now = new Date();
            const localTime = now.toLocaleTimeString("en-US", { timeZone: timezone });
            clockElement.innerText = city + ": " + localTime;
        }

        // קריאה ראשונית לעדכון השעה
        updateClock();

        // קביעת עדכון השעה לפי מדינה כל 1 שניות
        setInterval(updateClock, 1000);
    }

    // לכל מדינה ברשימה, צור שעון
    timezones.forEach(timezone => {
        createClock(timezone.city, timezone.timezone);
    });