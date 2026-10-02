const SHEET_ID = "1HYp1vsJ-rqrTRlvJHibFPnjrPZEcuoFLW-IXRIvdKwg";
const SHEET_GID = "0";
const CACHE_KEY = "roster_cache";
const CACHE_EXPIRY_KEY = "roster_cache_expiry";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function csvToRows(text) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows.map((cols) => cols.map((v) => v.trim()));
}

function parseRoster(csvText) {
  const rows = csvToRows(csvText);
  const sectionDividers = ["HIGH COMMAND", "SENIOR HIGH RANK", "HIGH RANK", "SERGEANTS PROGRAMME", "LOW RANKS"];
  let currentSection = "";
  const troopers = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    if (!row || !row.some((v) => v)) continue;

    // Check for section divider
    const rowText = row.join(" ").toUpperCase();
    let isSectionDivider = false;
    for (const divider of sectionDividers) {
      if (rowText.includes(divider)) {
        currentSection = divider;
        isSectionDivider = true;
        break;
      }
    }
    if (isSectionDivider) continue;

    // Skip header rows
    if (row[2] && row[2].toLowerCase() === "callsign") continue;

    // Skip rows without username
    if (!row[3]) continue;

    const callsign = row[2] || "";
    const username = row[3] || "";
    const rank = [row[12], row[13], row[14]].filter(Boolean).join(" ");

    if (!username || !callsign) continue;

    try {
      troopers.push({
        callsign,
        roblox: username,
        displayName: username,
        rank,
        section: currentSection,
        avatarUrl: `assets/avatars/${username}.png`
      });
    } catch (error) {
      console.error(`Error processing trooper ${username}:`, error);
    }
  }

  return troopers;
}

function sortByCallsign(troopers) {
  return troopers.sort((a, b) => {
    const aMatch = a.callsign.match(/(\d+)/);
    const bMatch = b.callsign.match(/(\d+)/);
    const aNum = aMatch ? parseInt(aMatch[1]) : 999;
    const bNum = bMatch ? parseInt(bMatch[1]) : 999;
    return aNum - bNum;
  });
}

function renderRoster(container, troopers) {
  container.innerHTML = "";

  const hicom = troopers.filter((t) => t.section === "HIGH COMMAND");
  const regular = sortByCallsign(troopers.filter((t) => t.section !== "HIGH COMMAND"));

  // Render HIGH COMMAND section separately
  if (hicom.length > 0) {
    const hicomSection = document.createElement("div");
    hicomSection.className = "hicom-section";

    const title = document.createElement("h3");
    title.className = "hicom-title";
    title.textContent = "High Command";
    hicomSection.appendChild(title);

    const row = document.createElement("div");
    row.className = "leadership-row";

    hicom.forEach((trooper) => {
      const card = document.createElement("div");
      card.className = "leadership-card";
      card.innerHTML = `
        <img src="${trooper.avatarUrl}" alt="${trooper.roblox}" class="avatar" />
        <p class="name">${trooper.roblox}</p>
        <p class="rank">${trooper.rank}</p>
        <p class="callsign">${trooper.callsign}</p>
      `;
      row.appendChild(card);
    });

    hicomSection.appendChild(row);
    container.appendChild(hicomSection);
  }

  // Render regular roster section
  if (regular.length > 0) {
    const section = document.createElement("div");
    section.className = "rank-section";

    const title = document.createElement("h3");
    title.className = "rank-title";
    title.textContent = "Roster";
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "roster-grid";

    regular.forEach((trooper) => {
      const card = document.createElement("div");
      card.className = "roster-card";
      card.innerHTML = `
        <img src="${trooper.avatarUrl}" alt="${trooper.roblox}" class="avatar" />
        <p class="name">${trooper.roblox}</p>
        <p class="rank">${trooper.rank}</p>
        <p class="callsign">${trooper.callsign}</p>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  }
}

async function loadRoster() {
  const container = document.querySelector("[data-roster-list]");
  if (!container) return;

  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return;
  renderRoster(container, JSON.parse(cached));
}

// Load roster when page loads
document.addEventListener("DOMContentLoaded", loadRoster);
