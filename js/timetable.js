const routesDiv = document.getElementById("routes");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterUp = document.getElementById("filterUp");
const filterDown = document.getElementById("filterDown");

let routesData = [];
let currentSort = "route-asc";
let currentLang = localStorage.getItem("lang") || "en";

const translations = {
  en: {
    home: "Home",
    about: "About",
    timetables: "Timetables",
    contact: "Contact",
    title: "BMTC Timetables",
    loading: "Loading timetables...",
    sortBy: "Sort by:",
    routeAsc: "Route ↑",
    routeDesc: "Route ↓",
    up: "UP",
    down: "DOWN",
    searchPlaceholder: "Search route / source / destination"
  },
  kn: {
    home: "ಮುಖ್ಯ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    timetables: "ವೇಳಾಪಟ್ಟಿಗಳು",
    contact: "ಸಂಪರ್ಕ",
    title: "ಬಿಎಂಟಿಸಿ ವೇಳಾಪಟ್ಟಿಗಳು",
    loading: "ವೇಳಾಪಟ್ಟಿಗಳನ್ನು ಲೋಡ್ ಮಾಡುತ್ತಿದೆ...",
    sortBy: "ವಿಂಗಡಿಸಿ:",
    routeAsc: "ಮಾರ್ಗ ↑",
    routeDesc: "ಮಾರ್ಗ ↓",
    up: "ಮೇಲೆ",
    down: "ಕೆಳಗೆ",
    searchPlaceholder: "ಮಾರ್ಗ / ಮೂಲ / ಗಮ್ಯಸ್ಥಾನ ಹುಡುಕಿ"
  }
};

const stationTranslations = {
  en: {
    "Kempegowda Bus Station": "Kempegowda Bus Station",
    "Cauvery Nagara": "Cauvery Nagara",
    "Majestic": "Majestic",
    "Shivajinagar": "Shivajinagar",
    "Rajajinagar": "Rajajinagar",
    "Yesvantpur": "Yesvantpur",
    "Malleshwaram": "Malleshwaram",
    "Seshadripuram": "Seshadripuram",
    "Chamarajpet": "Chamarajpet",
    "Basavanagudi": "Basavanagudi",
    "Jayanagar": "Jayanagar",
    "JP Nagar": "JP Nagar",
    "Banashankari": "Banashankari",
    "Sarjapur Road": "Sarjapur Road",
    "Electronic City": "Electronic City",
    "Marathahalli": "Marathahalli",
    "Whitefield": "Whitefield",
    "Indiranagar": "Indiranagar",
    "Koramangala": "Koramangala",
    "HSR Layout": "HSR Layout",
    "BTM Layout": "BTM Layout",
    "Hebbal": "Hebbal",
    "Yelahanka": "Yelahanka",
    "Peenya": "Peenya",
    "Rajguru Nagar": "Rajguru Nagar",
    "Vijayanagar": "Vijayanagar",
    "Nagarbhavi": "Nagarbhavi",
    "Kengeri": "Kengeri",
    "Mysore Road": "Mysore Road",
    "Jayaprakash Nagar": "Jayaprakash Nagar",
    "RR Nagar": "RR Nagar",
    "Jalahalli": "Jalahalli",
    "Nelamangala": "Nelamangala",
    "Devanahalli": "Devanahalli",
    "Hosur Road": "Hosur Road",
    "Kanakapura Road": "Kanakapura Road",
    "Tumkur Road": "Tumkur Road",
    "Old Airport Road": "Old Airport Road",
    "Outer Ring Road": "Outer Ring Road",
    "Bellandur": "Bellandur",
    "Sarjapur": "Sarjapur",
    "Kadugodi": "Kadugodi",
    "Hoodi": "Hoodi",
    "Krishnarajapuram": "Krishnarajapuram",
    "Mahadevapura": "Mahadevapura",
    "Marathahalli Bridge": "Marathahalli Bridge",
    "Varthur": "Varthur",
    "Gunjur": "Gunjur",
    "Bommanahalli": "Bommanahalli",
    "Begur": "Begur",
    "Hongasandra": "Hongasandra",
    "Singasandra": "Singasandra",
    "Kudlu Gate": "Kudlu Gate",
    "Garvebhavi Palya": "Garvebhavi Palya",
    "Bommasandra": "Bommasandra",
    "Electronic City Phase 1": "Electronic City Phase 1",
    "Konappana Agrahara": "Konappana Agrahara",
    "Hosa Road": "Hosa Road",
    "Veerasandra": "Veerasandra",
    "Attibele": "Attibele",
    "Anekal": "Anekal",
    "Chandapura": "Chandapura",
    "Ramanagaram": "Ramanagaram",
    "Kanakapura": "Kanakapura",
    "Bidadi": "Bidadi",
    "Mysore": "Mysore",
    "Mandya": "Mandya",
    "Channapatna": "Channapatna",
    "Tumkur": "Tumkur",
    "Doddaballapur": "Doddaballapur",
    "Chikkaballapur": "Chikkaballapur",
    "Hoskote": "Hoskote",
    "Malur": "Malur",
    "Kolar": "Kolar",
    "Bangalore Rural": "Bangalore Rural",
    "Nelamangala": "Nelamangala",
    "Magadi": "Magadi",
    "Ramanagara": "Ramanagara",
    "Attibele Bus Stand": "Attibele Bus Stand",
    "Banashankari Bus Station": "Banashankari Bus Station",
    "Bannerughatta National Park": "Bannerughatta National Park",
    "Basavanagara": "Basavanagara",
    "Brigade Road": "Brigade Road",
    "Depot-02 Shanthinagara": "Depot-02 Shanthinagara",
    "Depot-03 Shanthinagara": "Depot-03 Shanthinagara",
    "Electronic City Wipro Main Gate": "Electronic City Wipro Main Gate",
    "KR Market": "KR Market",
    "KR Market (Kalasipalya)": "KR Market (Kalasipalya)",
    "Kadugodi Bus Station": "Kadugodi Bus Station",
    "Koramangala 1st Block": "Koramangala 1st Block",
    "Kumaraswamy Layout": "Kumaraswamy Layout",
    "Sarjapura": "Sarjapura",
    "Shanthinagara Bus Station": "Shanthinagara Bus Station",
    "Shivajinagara Bus Station": "Shivajinagara Bus Station",
    "Srinagara Bus Station": "Srinagara Bus Station",
    "Hebbala Bridge": "Hebbala Bridge",
    "Harohalli": "Harohalli",
    "Neelasandra Bus Stand": "Neelasandra Bus Stand",
    "Pramod Layout": "Pramod Layout",
    "Kaval Byrasandra": "Kaval Byrasandra",
    "Central Silk Board": "Central Silk Board",
    "Girinagara Extension": "Girinagara Extension",
    "Beguru": "Beguru",
    "Kamalanagara BEML Layout": "Kamalanagara BEML Layout"
  },
  kn: {
    "Kempegowda Bus Station": "ಕೆಂಪೇಗೌಡ ಬಸ್ ನಿಲ್ದಾಣ",
    "Cauvery Nagara": "ಕಾವೇರಿ ನಗರ",
    "Majestic": "ಮೆಜೆಸ್ಟಿಕ್",
    "Shivajinagar": "ಶಿವಾಜಿನಗರ",
    "Rajajinagar": "ರಾಜಾಜಿನಗರ",
    "Yesvantpur": "ಯಶವಂತಪುರ",
    "Malleshwaram": "ಮಲ್ಲೇಶ್ವರಂ",
    "Seshadripuram": "ಶೇಷಾದ್ರಿಪುರಂ",
    "Chamarajpet": "ಚಾಮರಾಜಪೇಟೆ",
    "Basavanagudi": "ಬಸವನಗುಡಿ",
    "Jayanagar": "ಜಯನಗರ",
    "JP Nagar": "ಜೆಪಿ ನಗರ",
    "Banashankari": "ಬನಶಂಕರಿ",
    "Sarjapur Road": "ಸರ್ಜಾಪುರ ರಸ್ತೆ",
    "Electronic City": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ",
    "Marathahalli": "ಮರಥಹಳ್ಳಿ",
    "Whitefield": "ವೈಟ್ ಫೀಲ್ಡ್",
    "Indiranagar": "ಇಂದಿರಾನಗರ",
    "Koramangala": "ಕೋರಮಂಗಲ",
    "HSR Layout": "ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್",
    "BTM Layout": "ಬಿ.ಟಿ.ಎಂ. ಲೇಔಟ್",
    "Hebbal": "ಹೆಬ್ಬಾಲ್",
    "Yelahanka": "ಯಲಹಂಕ",
    "Peenya": "ಪೀಣ್ಯ",
    "Rajguru Nagar": "ರಾಜಗುರು ನಗರ",
    "Vijayanagar": "ವಿಜಯನಗರ",
    "Nagarbhavi": "ನಗರಭಾವಿ",
    "Kengeri": "ಕೆಂಗೇರಿ",
    "Mysore Road": "ಮೈಸೂರು ರಸ್ತೆ",
    "Jayaprakash Nagar": "ಜಯಪ್ರಕಾಶ್ ನಗರ",
    "RR Nagar": "ಆರ್.ಆರ್. ನಗರ",
    "Jalahalli": "ಜಲಹಳ್ಳಿ",
    "Nelamangala": "ನೇಲಮಂಗಲ",
    "Devanahalli": "ದೇವನಹಳ್ಳಿ",
    "Hosur Road": "ಹೊಸೂರು ರಸ್ತೆ",
    "Kanakapura Road": "ಕನಕಪುರ ರಸ್ತೆ",
    "Tumkur Road": "ತುಮಕೂರು ರಸ್ತೆ",
    "Old Airport Road": "ಹಳೆಯ ವಿಮಾನ ನಿಲ್ದಾಣ ರಸ್ತೆ",
    "Outer Ring Road": "ಔಟರ್ ರಿಂಗ್ ರಸ್ತೆ",
    "Bellandur": "ಬೆಲ್ಲಂದೂರು",
    "Sarjapur": "ಸರ್ಜಾಪುರ",
    "Kadugodi": "ಕಡುಗೋಡಿ",
    "Hoodi": "ಹೂಡಿ",
    "Krishnarajapuram": "ಕೃಷ್ಣರಾಜಪುರಂ",
    "Mahadevapura": "ಮಹಾದೇವಪುರ",
    "Marathahalli Bridge": "ಮರಥಹಳ್ಳಿ ಬ್ರಿಜ್",
    "Varthur": "ವರ್ಥೂರು",
    "Gunjur": "ಗುಂಜೂರು",
    "Bommanahalli": "ಬೊಮ್ಮನಹಳ್ಳಿ",
    "Begur": "ಬೇಗೂರು",
    "Hongasandra": "ಹೊಂಗಸಂದ್ರ",
    "Singasandra": "ಸಿಂಗಸಂದ್ರ",
    "Kudlu Gate": "ಕುಡ್ಲು ಗೇಟ್",
    "Garvebhavi Palya": "ಗರ್ವೇಭಾವಿ ಪಾಳ್ಯ",
    "Bommasandra": "ಬೊಮ್ಮಸಂದ್ರ",
    "Electronic City Phase 1": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಫೇಸ್ 1",
    "Konappana Agrahara": "ಕೋನಪ್ಪನ ಅಗ್ರಹಾರ",
    "Hosa Road": "ಹೊಸ ರಸ್ತೆ",
    "Veerasandra": "ವೀರಸಂದ್ರ",
    "Attibele": "ಅಟ್ಟಿಬೇಲೆ",
    "Anekal": "ಅನೇಕಲ್",
    "Chandapura": "ಚಂದಾಪುರ",
    "Ramanagaram": "ರಾಮನಗರಂ",
    "Kanakapura": "ಕನಕಪುರ",
    "Bidadi": "ಬಿದಡಿ",
    "Mysore": "ಮೈಸೂರು",
    "Mandya": "ಮಂಡ್ಯ",
    "Channapatna": "ಚನ್ನಪಟ್ಟಣ",
    "Tumkur": "ತುಮಕೂರು",
    "Doddaballapur": "ದೊಡ್ಡಬಳ್ಳಾಪುರ",
    "Chikkaballapur": "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
    "Hoskote": "ಹೊಸಕೋಟೆ",
    "Malur": "ಮಲೂರು",
    "Kolar": "ಕೋಲಾರ್",
    "Bangalore Rural": "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
    "Nelamangala": "ನೇಲಮಂಗಲ",
    "Magadi": "ಮಾಗಡಿ",
    "Ramanagara": "ರಾಮನಗರ",
    "Attibele Bus Stand": "ಅಟ್ಟಿಬೇಲೆ ಬಸ್ ನಿಲ್ದಾಣ",
    "Banashankari Bus Station": "ಬನಶಂಕರಿ ಬಸ್ ನಿಲ್ದಾಣ",
    "Bannerughatta National Park": "ಬನ್ನೇರುಘಟ್ಟ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನ",
    "Basavanagara": "ಬಸವನಗರ",
    "Brigade Road": "ಬ್ರಿಗೇಡ್ ರಸ್ತೆ",
    "Depot-02 Shanthinagara": "ಡಿಪೋ-02 ಶಾಂತಿನಗರ",
    "Depot-03 Shanthinagara": "ಡಿಪೋ-03 ಶಾಂತಿನಗರ",
    "Electronic City Wipro Main Gate": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ವಿಪ್ರೋ ಮುಖ್ಯ ಗೇಟ್",
    "KR Market": "ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ",
    "KR Market (Kalasipalya)": "ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ (ಕಲಸಿಪಾಳ್ಯ)",
    "Kadugodi Bus Station": "ಕಡುಗೋಡಿ ಬಸ್ ನಿಲ್ದಾಣ",
    "Koramangala 1st Block": "ಕೋರಮಂಗಲ 1ನೇ ಬ್ಲಾಕ್",
    "Kumaraswamy Layout": "ಕುಮಾರಸ್ವಾಮಿ ಲೇಔಟ್",
    "Sarjapura": "ಸರ್ಜಾಪುರ",
    "Shanthinagara Bus Station": "ಶಾಂತಿನಗರ ಬಸ್ ನಿಲ್ದಾಣ",
    "Shivajinagara Bus Station": "ಶಿವಾಜಿನಗರ ಬಸ್ ನಿಲ್ದಾಣ",
    "Srinagara Bus Station": "ಶ್ರೀನಗರ ಬಸ್ ನಿಲ್ದಾಣ",
    "Hebbala Bridge": "ಹೆಬ್ಬಾಲ ಬ್ರಿಜ್",
    "Harohalli": "ಹರೋಹಳ್ಳಿ",
    "Neelasandra Bus Stand": "ನೀಲಸಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣ",
    "Pramod Layout": "ಪ್ರಮೋದ್ ಲೇಔಟ್",
    "Kaval Byrasandra": "ಕಾವಲ್ ಬೈರಸಂದ್ರ",
    "Central Silk Board": "ಸೆಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್",
    "Girinagara Extension": "ಗಿರಿನಗರ ಎಕ್ಸ್ಟೆನ್ಷನ್",
    "Beguru": "ಬೇಗೂರು",
    "Kamalanagara BEML Layout": "ಕಮಲನಗರ ಬಿಇಎಂಎಲ್ ಲೇಔಟ್"
  }
};

function translateStation(name) {
  return stationTranslations[currentLang][name] || name;
}

/* =========================================
   Remove ONLY trailing UP / DOWN
   ========================================= */
function normalizeRouteNumber(routeNo) {
  return routeNo.replace(/\s+(UP|DOWN)$/i, "").trim();
}

/* =========================================
   Fetch JSON
   ========================================= */
document.getElementById('loading').style.display = 'block';
fetch("data/timetables.json")
  .then(res => res.json())
  .then(data => {
    routesData = data;
    document.getElementById('loading').style.display = 'none';
    updateRoutes();
  })
  .catch(err => {
    console.error(err);
    document.getElementById('loading').textContent = 'Error loading timetables.';
  });

/* =========================================
   Search
   ========================================= */
searchInput.addEventListener("input", () => {
  updateRoutes();
});

/* =========================================
   Sort
   ========================================= */
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  updateRoutes();
});

/* =========================================
   Filters
   ========================================= */
filterUp.addEventListener("change", updateRoutes);
filterDown.addEventListener("change", updateRoutes);

/* =========================================
   Update Texts
   ========================================= */
function updateTexts() {
  const t = translations[currentLang];
  document.getElementById("titleText").textContent = t.title;
  document.getElementById("loading").textContent = t.loading;
  document.getElementById("searchInput").placeholder = t.searchPlaceholder;
  sortSelect.querySelector('option[value="route-asc"]').textContent = t.routeAsc;
  sortSelect.querySelector('option[value="route-desc"]').textContent = t.routeDesc;
  filterUp.nextSibling.textContent = t.up;
  filterDown.nextSibling.textContent = t.down;
  document.querySelector('label[for="sortSelect"]').textContent = t.sortBy;
}
function updateRoutes() {
  const val = searchInput.value.toLowerCase();
  let filtered = routesData.filter(r =>
    normalizeRouteNumber(r.route_number).toLowerCase().includes(val) ||
    r.timetable?.data?.some(entry =>
      entry.fromstationname.toLowerCase().includes(val) ||
      entry.tostationname.toLowerCase().includes(val) ||
      translateStation(entry.fromstationname).toLowerCase().includes(val) ||
      translateStation(entry.tostationname).toLowerCase().includes(val)
    )
  );

  // Sort
  filtered.sort((a, b) => {
    const aNorm = normalizeRouteNumber(a.route_number);
    const bNorm = normalizeRouteNumber(b.route_number);
    if (currentSort === "route-asc") {
      return aNorm.localeCompare(bNorm, undefined, { numeric: true });
    } else {
      return bNorm.localeCompare(aNorm, undefined, { numeric: true });
    }
  });

  renderRoutes(filtered);
}

/* =========================================
   Render Routes (FIXED)
   ========================================= */
function renderRoutes(data) {
  routesDiv.innerHTML = "";

  // Filter out routes with no timetable data
  data = data.filter(route => route.timetable?.data?.length > 0);

  const groupedRoutes = {};

  // 1️⃣ Group by NORMALIZED route number (e.g., "12", "12B", "13")
  data.forEach(route => {
    const baseRoute = normalizeRouteNumber(route.route_number);
    if (!groupedRoutes[baseRoute]) {
      groupedRoutes[baseRoute] = [];
    }
    groupedRoutes[baseRoute].push(route);
  });

  // Sort groups alphabetically (numerically for numbers)
  const sortedGroups = Object.entries(groupedRoutes).sort(([a], [b]) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.localeCompare(b);
  });

  // 2️⃣ Render ONE card per base number
  sortedGroups.forEach(([baseRoute, routes]) => {
    const card = document.createElement("div");
    card.className = "route-card fade-in";

    let html = `
      <div class="route-header">
        <div class="route-number">${baseRoute}</div>
        <button class="expand-btn">▼</button>
      </div>
      <div class="route-details" style="display: none;">
    `;

    // Collect details
    const details = routes.map(route => {
      const entry = route.timetable?.data?.[0];
      return entry ? {
        distance: entry.distance,
        platform: entry.platformname,
        from: entry.fromstationname,
        to: entry.tostationname
      } : null;
    }).filter(Boolean);

    if (details.length > 0) {
      const detail = details[0];
      html += `
        <p><strong>Distance:</strong> ${detail.distance} km</p>
        <p><strong>Platform:</strong> ${detail.platform}</p>
      `;
    }

    html += `</div>`;

    const directions = {};

    // 3️⃣ Collect directions by VARIANT with direction
    routes.forEach(route => {
      const direction = route.route_number.includes('UP') ? ' UP' : ' DOWN';
      const variant = normalizeRouteNumber(route.route_number) + direction; // e.g., "12 UP", "12B UP", "13A DOWN"
      if (!directions[variant]) directions[variant] = {};

      route.timetable?.data?.forEach(entry => {
        const key = `${translateStation(entry.fromstationname)} → ${translateStation(entry.tostationname)}`;

        if (!directions[variant][key]) {
          directions[variant][key] = [];
        }

        entry.tripdetails?.forEach(trip => {
          directions[variant][key].push(trip.starttime);
        });
      });
    });

    // 4️⃣ Render variants
    Object.keys(directions).sort().forEach(variant => {
      if ((variant.includes('UP') && !filterUp.checked) || (variant.includes('DOWN') && !filterDown.checked)) return;

      const paths = directions[variant];
      Object.entries(paths).forEach(([path, times]) => {
        const sortedTimes = times.sort();
        html += `
          <div class="direction">
            <h4>🚍 ${variant}</h4>
            <div class="route-path">${path}</div>
            <div class="timings">
              ${sortedTimes.map(time => `<span class="time">${time}</span>`).join("")}
            </div>
          </div>
        `;
      });
    });

    card.innerHTML = html;
    routesDiv.appendChild(card);

    // Add expand functionality
    const expandBtn = card.querySelector('.expand-btn');
    const detailsDiv = card.querySelector('.route-details');
    expandBtn.addEventListener('click', () => {
      const isVisible = detailsDiv.style.display !== 'none';
      detailsDiv.style.display = isVisible ? 'none' : 'block';
      expandBtn.textContent = isVisible ? '▼' : '▲';
    });
  });
}

/* =========================================
   Dark mode
   ========================================= */
document.getElementById("themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  updateThemeIcon();
});

function updateThemeIcon() {
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  }
}

// Load theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
updateThemeIcon();

// Load language
updateTexts();

/* =========================================
   Language toggle
   ========================================= */
document.getElementById("langToggle")?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "kn" : "en";
  localStorage.setItem("lang", currentLang);
  updateTexts();
  updateRoutes();
});
