document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const timeDisplay = document.getElementById('time-display');
    const dateDisplay = document.getElementById('date-display');
    const timezoneDisplay = document.getElementById('timezone-display');
    const searchInput = document.getElementById('search-input');
    const timezoneSelect = document.getElementById('timezone-select');
    const digitalClockDiv = document.getElementById('digital-clock');
    const analogClockCanvas = document.getElementById('analog-clock');
    const ctx = analogClockCanvas.getContext('2d');

    // --- Toggles ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    const themeToggleBall = document.getElementById('themeToggleBall');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const clockTypeToggle = document.getElementById('clockTypeToggle');
    const clockToggleBall = document.getElementById('clockToggleBall');
    const digitalIcon = document.getElementById('digitalIcon');
    const analogIcon = document.getElementById('analogIcon');

    // --- State Variables ---
    let allTimezones = [];
    let selectedTimezone = 'Asia/Dhaka';
    let clockInterval;
    let isAnalog = false;

    // --- Clock Data ---
    const timezoneData = { 'Europe/Andorra': { city: 'Andorra la Vella', country: 'Andorra' }, 'Asia/Dubai': { city: 'Abu Dhabi', country: 'UAE' }, 'Asia/Kabul': { city: 'Kabul', country: 'Afghanistan' }, 'America/Antigua': { city: 'St. John\'s', country: 'Antigua and Barbuda' }, 'Europe/Tirane': { city: 'Tirana', country: 'Albania' }, 'Asia/Yerevan': { city: 'Yerevan', country: 'Armenia' }, 'Africa/Luanda': { city: 'Luanda', country: 'Angola' }, 'America/Argentina/Buenos_Aires': { city: 'Buenos Aires', country: 'Argentina' }, 'Europe/Vienna': { city: 'Vienna', country: 'Austria' }, 'Australia/Sydney': { city: 'Canberra', country: 'Australia' }, 'Asia/Baku': { city: 'Baku', country: 'Azerbaijan' }, 'Europe/Sarajevo': { city: 'Sarajevo', country: 'Bosnia and Herzegovina' }, 'America/Barbados': { city: 'Bridgetown', country: 'Barbados' }, 'Asia/Dhaka': { city: 'Dhaka', country: 'Bangladesh' }, 'Europe/Brussels': { city: 'Brussels', country: 'Belgium' }, 'Africa/Ouagadougou': { city: 'Ouagadougou', country: 'Burkina Faso' }, 'Europe/Sofia': { city: 'Sofia', country: 'Bulgaria' }, 'Asia/Bahrain': { city: 'Manama', country: 'Bahrain' }, 'Africa/Bujumbura': { city: 'Gitega', country: 'Burundi' }, 'Africa/Porto-Novo': { city: 'Porto-Novo', country: 'Benin' }, 'Asia/Brunei': { city: 'Bandar Seri Begawan', country: 'Brunei' }, 'America/La_Paz': { city: 'Sucre', country: 'Bolivia' }, 'America/Sao_Paulo': { city: 'Brasília', country: 'Brazil' }, 'America/Nassau': { city: 'Nassau', country: 'Bahamas' }, 'Asia/Thimphu': { city: 'Thimphu', country: 'Bhutan' }, 'Africa/Gaborone': { city: 'Gaborone', country: 'Botswana' }, 'Europe/Minsk': { city: 'Minsk', country: 'Belarus' }, 'America/Belize': { city: 'Belmopan', country: 'Belize' }, 'America/Toronto': { city: 'Ottawa', country: 'Canada' }, 'Africa/Kinshasa': { city: 'Kinshasa', country: 'DR Congo' }, 'Africa/Bangui': { city: 'Bangui', country: 'Central African Republic' }, 'Africa/Brazzaville': { city: 'Brazzaville', country: 'Congo' }, 'Europe/Zurich': { city: 'Bern', country: 'Switzerland' }, 'Africa/Abidjan': { city: 'Yamoussoukro', country: 'Côte d\'Ivoire' }, 'America/Santiago': { city: 'Santiago', country: 'Chile' }, 'Africa/Douala': { city: 'Yaoundé', country: 'Cameroon' }, 'Asia/Shanghai': { city: 'Beijing', country: 'China' }, 'America/Bogota': { city: 'Bogotá', country: 'Colombia' }, 'America/Costa_Rica': { city: 'San José', country: 'Costa Rica' }, 'America/Havana': { city: 'Havana', country: 'Cuba' }, 'Atlantic/Cape_Verde': { city: 'Praia', country: 'Cape Verde' }, 'Asia/Nicosia': { city: 'Nicosia', country: 'Cyprus' }, 'Europe/Prague': { city: 'Prague', country: 'Czech Republic' }, 'Europe/Berlin': { city: 'Berlin', country: 'Germany' }, 'Africa/Djibouti': { city: 'Djibouti', country: 'Djibouti' }, 'Europe/Copenhagen': { city: 'Copenhagen', country: 'Denmark' }, 'America/Dominica': { city: 'Roseau', country: 'Dominica' }, 'America/Santo_Domingo': { city: 'Santo Domingo', country: 'Dominican Republic' }, 'Africa/Algiers': { city: 'Algiers', country: 'Algeria' }, 'America/Guayaquil': { city: 'Quito', country: 'Ecuador' }, 'Europe/Tallinn': { city: 'Tallinn', country: 'Estonia' }, 'Africa/Cairo': { city: 'Cairo', country: 'Egypt' }, 'Africa/Asmara': { city: 'Asmara', country: 'Eritrea' }, 'Europe/Madrid': { city: 'Madrid', country: 'Spain' }, 'Africa/Addis_Ababa': { city: 'Addis Ababa', country: 'Ethiopia' }, 'Europe/Helsinki': { city: 'Helsinki', country: 'Finland' }, 'Pacific/Fiji': { city: 'Suva', country: 'Fiji' }, 'Europe/Paris': { city: 'Paris', country: 'France' }, 'Africa/Libreville': { city: 'Libreville', country: 'Gabon' }, 'Europe/London': { city: 'London', country: 'UK' }, 'Asia/Tbilisi': { city: 'Tbilisi', country: 'Georgia' }, 'Africa/Accra': { city: 'Accra', country: 'Ghana' }, 'Africa/Banjul': { city: 'Banjul', country: 'Gambia' }, 'Africa/Conakry': { city: 'Conakry', country: 'Guinea' }, 'Africa/Malabo': { city: 'Malabo', country: 'Equatorial Guinea' }, 'Europe/Athens': { city: 'Athens', country: 'Greece' }, 'America/Guatemala': { city: 'Guatemala City', country: 'Guatemala' }, 'America/Guyana': { city: 'Georgetown', country: 'Guyana' }, 'America/Tegucigalpa': { city: 'Tegucigalpa', country: 'Honduras' }, 'Europe/Zagreb': { city: 'Zagreb', country: 'Croatia' }, 'America/Port-au-Prince': { city: 'Port-au-Prince', country: 'Haiti' }, 'Europe/Budapest': { city: 'Budapest', country: 'Hungary' }, 'Asia/Jakarta': { city: 'Jakarta', country: 'Indonesia' }, 'Europe/Dublin': { city: 'Dublin', country: 'Ireland' }, 'Asia/Jerusalem': { city: 'Jerusalem', country: 'Israel' }, 'Asia/Kolkata': { city: 'New Delhi', country: 'India' }, 'Asia/Baghdad': { city: 'Baghdad', country: 'Iraq' }, 'Asia/Tehran': { city: 'Tehran', country: 'Iran' }, 'Atlantic/Reykjavik': { city: 'Reykjavik', country: 'Iceland' }, 'Europe/Rome': { city: 'Rome', country: 'Italy' }, 'America/Jamaica': { city: 'Kingston', country: 'Jamaica' }, 'Asia/Amman': { city: 'Amman', country: 'Jordan' }, 'Africa/Nairobi': { city: 'Nairobi', country: 'Kenya' }, 'Asia/Bishkek': { city: 'Bishkek', country: 'Kyrgyzstan' }, 'Pacific/Tarawa': { city: 'South Tarawa', country: 'Kiribati' }, 'Asia/Kuwait': { city: 'Kuwait City', country: 'Kuwait' }, 'Asia/Vientiane': { city: 'Vientiane', country: 'Laos' }, 'Asia/Beirut': { city: 'Beirut', country: 'Lebanon' }, 'Europe/Vaduz': { city: 'Vaduz', country: 'Liechtenstein' }, 'Africa/Monrovia': { city: 'Monrovia', country: 'Liberia' }, 'Africa/Maseru': { city: 'Maseru', country: 'Lesotho' }, 'Europe/Vilnius': { city: 'Vilnius', country: 'Lithuania' }, 'Europe/Luxembourg': { city: 'Luxembourg', country: 'Luxembourg' }, 'Europe/Riga': { city: 'Riga', country: 'Latvia' }, 'Africa/Tripoli': { city: 'Tripoli', country: 'Libya' }, 'Africa/Casablanca': { city: 'Rabat', country: 'Morocco' }, 'Europe/Monaco': { city: 'Monaco', country: 'Monaco' }, 'Europe/Chisinau': { city: 'Chișinău', country: 'Moldova' }, 'Europe/Podgorica': { city: 'Podgorica', country: 'Montenegro' }, 'Indian/Antananarivo': { city: 'Antananarivo', country: 'Madagascar' }, 'Pacific/Majuro': { city: 'Majuro', country: 'Marshall Islands' }, 'Europe/Skopje': { city: 'Skopje', country: 'North Macedonia' }, 'Africa/Bamako': { city: 'Bamako', country: 'Mali' }, 'Asia/Yangon': { city: 'Naypyidaw', country: 'Myanmar' }, 'Asia/Ulaanbaatar': { city: 'Ulaanbaatar', country: 'Mongolia' }, 'Africa/Nouakchott': { city: 'Nouakchott', country: 'Mauritania' }, 'Europe/Malta': { city: 'Valletta', country: 'Malta' }, 'Indian/Mauritius': { city: 'Port Louis', country: 'Mauritius' }, 'Indian/Maldives': { city: 'Malé', country: 'Maldives' }, 'Africa/Blantyre': { city: 'Lilongwe', country: 'Malawi' }, 'America/Mexico_City': { city: 'Mexico City', country: 'Mexico' }, 'Asia/Kuala_Lumpur': { city: 'Kuala Lumpur', country: 'Malaysia' }, 'Africa/Maputo': { city: 'Maputo', country: 'Mozambique' }, 'Africa/Windhoek': { city: 'Windhoek', country: 'Namibia' }, 'Africa/Niamey': { city: 'Niamey', country: 'Niger' }, 'Africa/Lagos': { city: 'Abuja', country: 'Nigeria' }, 'America/Managua': { city: 'Managua', country: 'Nicaragua' }, 'Europe/Amsterdam': { city: 'Amsterdam', country: 'Netherlands' }, 'Europe/Oslo': { city: 'Oslo', country: 'Norway' }, 'Asia/Kathmandu': { city: 'Kathmandu', country: 'Nepal' }, 'Pacific/Nauru': { city: 'Yaren', country: 'Nauru' }, 'Pacific/Auckland': { city: 'Wellington', country: 'New Zealand' }, 'Asia/Muscat': { city: 'Muscat', country: 'Oman' }, 'America/Panama': { city: 'Panama City', country: 'Panama' }, 'America/Lima': { city: 'Lima', country: 'Peru' }, 'Pacific/Port_Moresby': { city: 'Port Moresby', country: 'Papua New Guinea' }, 'Asia/Manila': { city: 'Manila', country: 'Philippines' }, 'Asia/Karachi': { city: 'Islamabad', country: 'Pakistan' }, 'Europe/Warsaw': { city: 'Warsaw', country: 'Poland' }, 'Europe/Lisbon': { city: 'Lisbon', country: 'Portugal' }, 'Pacific/Palau': { city: 'Ngerulmud', country: 'Palau' }, 'America/Asuncion': { city: 'Asunción', country: 'Paraguay' }, 'Asia/Qatar': { city: 'Doha', country: 'Qatar' }, 'Europe/Bucharest': { city: 'Bucharest', country: 'Romania' }, 'Europe/Belgrade': { city: 'Belgrade', country: 'Serbia' }, 'Europe/Moscow': { city: 'Moscow', country: 'Russia' }, 'Africa/Kigali': { city: 'Kigali', country: 'Rwanda' }, 'Asia/Riyadh': { city: 'Riyadh', country: 'Saudi Arabia' }, 'Pacific/Guadalcanal': { city: 'Honiara', country: 'Solomon Islands' }, 'Indian/Mahe': { city: 'Victoria', country: 'Seychelles' }, 'Africa/Khartoum': { city: 'Khartoum', country: 'Sudan' }, 'Europe/Stockholm': { city: 'Stockholm', country: 'Sweden' }, 'Asia/Singapore': { city: 'Singapore', country: 'Singapore' }, 'Europe/Ljubljana': { city: 'Ljubljana', country: 'Slovenia' }, 'Europe/Bratislava': { city: 'Bratislava', country: 'Slovakia' }, 'Africa/Freetown': { city: 'Freetown', country: 'Sierra Leone' }, 'Europe/San_Marino': { city: 'San Marino', country: 'San Marino' }, 'Africa/Dakar': { city: 'Dakar', country: 'Senegal' }, 'Africa/Mogadishu': { city: 'Mogadishu', country: 'Somalia' }, 'America/Paramaribo': { city: 'Paramaribo', country: 'Suriname' }, 'Africa/Juba': { city: 'Juba', country: 'South Sudan' }, 'Africa/Sao_Tome': { city: 'São Tomé', country: 'Sao Tome & Principe' }, 'America/El_Salvador': { city: 'San Salvador', country: 'El Salvador' }, 'Asia/Damascus': { city: 'Damascus', country: 'Syria' }, 'Africa/Lome': { city: 'Lomé', country: 'Togo' }, 'Asia/Bangkok': { city: 'Bangkok', country: 'Thailand' }, 'Asia/Dushanbe': { city: 'Dushanbe', country: 'Tajikistan' }, 'Asia/Ashgabat': { city: 'Ashgabat', country: 'Turkmenistan' }, 'Africa/Tunis': { city: 'Tunis', country: 'Tunisia' }, 'Pacific/Tongatapu': { city: 'Nukuʻalofa', country: 'Tonga' }, 'Europe/Istanbul': { city: 'Ankara', country: 'Turkey' }, 'America/Port_of_Spain': { city: 'Port of Spain', country: 'Trinidad & Tobago' }, 'Pacific/Funafuti': { city: 'Funafuti', country: 'Tuvalu' }, 'Asia/Taipei': { city: 'Taipei', country: 'Taiwan' }, 'Africa/Dar_es_Salaam': { city: 'Dodoma', country: 'Tanzania' }, 'Europe/Kiev': { city: 'Kyiv', country: 'Ukraine' }, 'Africa/Kampala': { city: 'Kampala', country: 'Uganda' }, 'America/New_York': { city: 'Washington, D.C.', country: 'USA' }, 'America/Montevideo': { city: 'Montevideo', country: 'Uruguay' }, 'Asia/Tashkent': { city: 'Tashkent', country: 'Uzbekistan' }, 'Europe/Vatican': { city: 'Vatican City', country: 'Vatican City' }, 'America/Caracas': { city: 'Caracas', country: 'Venezuela' }, 'Asia/Ho_Chi_Minh': { city: 'Hanoi', country: 'Vietnam' }, 'Pacific/Efate': { city: 'Port Vila', country: 'Vanuatu' }, 'Pacific/Apia': { city: 'Apia', country: 'Samoa' }, 'Asia/Aden': { city: 'Sana\'a', country: 'Yemen' }, 'Africa/Johannesburg': { city: 'Pretoria', country: 'South Africa' }, 'Africa/Lusaka': { city: 'Lusaka', country: 'Zambia' }, 'Africa/Harare': { city: 'Harare', country: 'Zimbabwe' }
    };

    // --- FUNCTION DEFINITIONS ---

    function updateClock() {
        if (isAnalog) {
            drawAnalogClock();
        } else {
            updateDigitalClock();
        }
    }
    
    function setTheme(isDark) {
        if (isDark) {
            htmlElement.classList.add('dark');
            themeToggleBall.style.transform = 'translateX(24px)';
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            themeToggleBall.style.transform = 'translateX(0)';
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        }
        updateClock();
    }
    
    function setClockType(isAnalogClock) {
        isAnalog = isAnalogClock;
        if (isAnalog) {
            digitalClockDiv.classList.add('hidden');
            analogClockCanvas.classList.remove('hidden');
            clockToggleBall.style.transform = 'translateX(24px)';
            digitalIcon.classList.add('hidden');
            analogIcon.classList.remove('hidden');
            const size = analogClockCanvas.parentElement.offsetWidth * 0.9;
            analogClockCanvas.width = size;
            analogClockCanvas.height = size;
        } else {
            digitalClockDiv.classList.remove('hidden');
            analogClockCanvas.classList.add('hidden');
            clockToggleBall.style.transform = 'translateX(0)';
            digitalIcon.classList.remove('hidden');
            analogIcon.classList.add('hidden');
        }
        updateClock();
    }

    function generateTimezoneList() {
        allTimezones = Object.keys(timezoneData).map(tz => {
            const data = timezoneData[tz];
            return { city: `${data.city} (${data.country})`, tz: tz };
        }).sort((a, b) => a.city.localeCompare(b.city));

        const dhakaIndex = allTimezones.findIndex(t => t.tz === 'Asia/Dhaka');
        if (dhakaIndex > -1) {
            const dhaka = allTimezones.splice(dhakaIndex, 1)[0];
            allTimezones.unshift(dhaka);
        }
    }

    function populateDropdown(filter = '') {
        timezoneSelect.innerHTML = '';
        const filteredTimezones = allTimezones.filter(tz => tz.city.toLowerCase().includes(filter.toLowerCase()));

        filteredTimezones.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.tz;
            option.textContent = tz.city;
            if (tz.tz === selectedTimezone) {
                option.selected = true;
            }
            timezoneSelect.appendChild(option);
        });
    }

    function updateDigitalClock() {
        const now = new Date();
        const timeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const gmtFormatter = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimezone, timeZoneName: 'short' });

        timeDisplay.textContent = timeFormatter.format(now);
        dateDisplay.textContent = dateFormatter.format(now);
        const gmtString = gmtFormatter.formatToParts(now).find(part => part.type === 'timeZoneName').value;
        timezoneDisplay.textContent = gmtString;
    }

    function drawAnalogClock() {
        const radius = analogClockCanvas.height / 2;
        if (radius <= 0) return;
        ctx.clearRect(0, 0, analogClockCanvas.width, analogClockCanvas.height);
        ctx.save();
        ctx.translate(radius, radius);
        
        const isDark = htmlElement.classList.contains('dark');
        const primaryColor = isDark ? '#f9fafb' : '#1f2937';
        const secondaryColor = isDark ? '#d1d5db' : '#4b5563';
        const accentColor = '#008cff';

        // Draw clock marks
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * 2 * Math.PI;
            const isHourMark = i % 5 === 0;
            const length = isHourMark ? radius * 0.1 : radius * 0.05;
            const markWidth = isHourMark ? 3 : 1;

            ctx.beginPath();
            ctx.lineWidth = markWidth;
            ctx.strokeStyle = secondaryColor;
            // Rotate the coordinate system to draw marks upright
            ctx.moveTo( (radius * 0.85) * Math.cos(angle), (radius * 0.85) * Math.sin(angle) );
            ctx.lineTo( (radius * 0.85 - length) * Math.cos(angle), (radius * 0.85 - length) * Math.sin(angle) );
            ctx.stroke();
        }

        // Center circle
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = accentColor;
        ctx.fill();
        
        // Get current time in selected timezone
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: selectedTimezone }));
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // Draw hands
        let hourAngle = (hour % 12 + minute / 60) * (2 * Math.PI / 12) - Math.PI / 2;
        drawHand(ctx, hourAngle, radius * 0.4, radius * 0.07, primaryColor);
        let minuteAngle = (minute + second / 60) * (2 * Math.PI / 60) - Math.PI / 2;
        drawHand(ctx, minuteAngle, radius * 0.6, radius * 0.05, primaryColor);
        let secondAngle = second * (2 * Math.PI / 60) - Math.PI / 2;
        drawHand(ctx, secondAngle, radius * 0.7, radius * 0.02, accentColor);

        ctx.restore();
    }
    
    function drawHand(ctx, pos, length, width, color) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(length, 0);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    function startClock() {
        if (clockInterval) clearInterval(clockInterval);
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    }
    
    // --- EVENT LISTENERS & INITIALIZATION ---
    
    timezoneSelect.addEventListener('change', (e) => {
        selectedTimezone = e.target.value;
        startClock();
    });

    searchInput.addEventListener('input', (e) => {
        populateDropdown(e.target.value);
    });
    
    clockTypeToggle.addEventListener('change', () => setClockType(clockTypeToggle.checked));
    darkModeToggle.addEventListener('change', () => setTheme(darkModeToggle.checked));

    // Initial Load
    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedThemePreference = localStorage.getItem('theme');
    const initialThemeIsDarkNow = savedThemePreference === 'dark' || (savedThemePreference === null && prefersDarkTheme);
    setTheme(initialThemeIsDarkNow);
    darkModeToggle.checked = initialThemeIsDarkNow;

    generateTimezoneList();
    populateDropdown();
    startClock();
});
