/* ============================================================
   FHP Ghost Unit - Vehicle Guide
   Multi-step, per-rank / per-vehicle configuration guide.
  Step 1: pick a division.
  Step 2: pick a rank section (Chain of Command).
  Step 3: pick a vehicle accessible at that rank.
  Step 4: view that vehicle's specific configuration guidelines
           plus a gallery of 5 correctly-configured examples.

   The old vehicle-checker engine (js/vehicle-checker.js) is kept
   on disk for reference but is no longer loaded by this page.
   ============================================================ */

(function () {
  "use strict";

  /* ------------------- DATA: TIER DEFAULTS ------------------ */
  /* Base configuration shared by every vehicle in a rank section.
     Each rank section can override a value, and each individual vehicle
     can override that value again. This keeps every piece customisable
     without hard-coding each category in a different place.            */

  var CONFIG_KEYS = [
    "decals",
    "lightbar",
    "requiredLighting",
    "optionalLighting",
    "requiredAccessories",
    "optionalAccessories",
    "antennas",
    "notes",
    "cls",
    "name"
  ];

  function normalizeList(value) {
    if (value == null) return [];
    if (Array.isArray(value)) return value.filter(function (item) { return item != null && item !== ""; });
    if (typeof value === "string") return [value];
    return [String(value)];
  }

  function mergeConfig(base, override) {
    var out = {};
    var keys = CONFIG_KEYS.concat(["reqLighting", "optLighting", "required", "optional"]);
    keys.forEach(function (key) {
      var value = override && Object.prototype.hasOwnProperty.call(override, key) ? override[key] : base && Object.prototype.hasOwnProperty.call(base, key) ? base[key] : undefined;
      if (value !== undefined) out[key] = value;
    });

    var aliasMap = {
      reqLighting: "requiredLighting",
      optLighting: "optionalLighting",
      required: "requiredAccessories",
      optional: "optionalAccessories"
    };

    Object.keys(aliasMap).forEach(function (alias) {
      if (out[alias] !== undefined && out[aliasMap[alias]] === undefined) {
        out[aliasMap[alias]] = out[alias];
      }
    });

    ["decals", "requiredLighting", "optionalLighting", "requiredAccessories", "optionalAccessories", "antennas", "notes"].forEach(function (key) {
      if (out[key] === undefined) out[key] = [];
      else out[key] = normalizeList(out[key]);
    });

    if (out.lightbar == null || out.lightbar === "") {
      out.lightbar = "Visor Lights / Legacy Lightbar";
    }
    if (out.cls == null) out.cls = "";
    if (out.name == null) out.name = "";
    return out;
  }

  var TIER = {
    HICOM: {
      decals: ["Black Decal", "White Decal", "Grey Decal"],
      lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
      requiredLighting: [
        "Rear Window Lights",
        "Side Window Lights",
        "Plate Lights",
        "Fog Lights",
        "Fender Lights",
        "Grille Lights / Grill Lightbar",
        "Small Siderunners / Siderunners"
      ],
      optionalLighting: ["LED Spotlight (Optional)", "Passenger Spotlight (Optional)"],
      requiredAccessories: ["Wraparound Bar"],
      optionalAccessories: ["Pushbar (Optional)", "ALPR (optional)", "Low Profile Siren 1 / 2 (optional)"],
      notes: []
    },
    SHR: {
      decals: ["Black Decal"],
      lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
      requiredLighting: [
        "Side Window Lights",
        "Plate Lights",
        "Fog Lights",
        "Fender Lights",
        "Grille Lights / Grill Lightbar",
        "Small Siderunners / Siderunners",
        "Rear Light Stick"
      ],
      optionalLighting: ["LED Spotlight (Optional)", "Passenger Spotlight (Optional)"],
      requiredAccessories: ["Pushbar", "Wraparound Bar"],
      optionalAccessories: ["ALPR (optional)", "Low Profile Siren 1 / 2 (optional)"],
      notes: ["HR/SHR may request HICOM White/Grey decal permissions."]
    },
    HR: {
      decals: ["Black Decal"],
      lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
      requiredLighting: [
        "Side Window Lights",
        "Plate Lights",
        "Fog Lights",
        "Fender Lights",
        "Small Siderunners / Siderunners",
        "Grille Lights / Grill Lightbar",
        "Rear Light Stick"
      ],
      optionalLighting: [],
      requiredAccessories: ["Pushbar", "Wraparound Bar"],
      optionalAccessories: ["ALPR (optional)", "Low Profile Siren 1 / 2 (optional)"],
      notes: []
    },
    SGTP: {
      decals: ["Black Decal"],
      lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
      requiredLighting: [
        "Side Window Lights",
        "Plate Lights",
        "Fender Lights",
        "Fog Lights",
        "Small Siderunners / Siderunners",
        "Grille Lights / Grill Lightbar",
        "Rear Light Stick"
      ],
      optionalLighting: [],
      requiredAccessories: ["Pushbar", "Wraparound Bar"],
      optionalAccessories: ["ALPR (optional)", "Low Profile Siren 1 / 2 (optional)"],
      notes: []
    },
    LR: {
      decals: ["Black Decal"],
      lightbar: "Visor Lights / Legacy Lightbar",
      requiredLighting: [
        "Side Window Lights",
        "Plate Lights",
        "Fender Lights",
        "Fog Lights",
        "Small Siderunners",
        "Grille Lights / Grill Lightbar",
        "Rear Light Stick"
      ],
      optionalLighting: [],
      requiredAccessories: ["Pushbar", "Wraparound Bar"],
      optionalAccessories: ["ALPR (optional)", "Low Profile Siren 1 / 2 (optional)"],
      notes: []
    }
  };
/* ------------------- DATA: RANK SECTIONS ------------------- */
  /* order: 1 = lowest rank section, 5 = highest. A rank section's
     accessible vehicles = its own cars + all lower sections' cars. */
  var RANK_SECTIONS = [
    {
      id: "HICOM",
      title: "High Command",
      short: "HICOM",
      order: 5,
      intro: "Full fleet / M/D vehicles.",
      tier: "HICOM",
      cars: [
        {
          name: "Stuttgart Runner Prisoner Transport 2020",
          cls: "Van",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Upper lights", "Grille Lights", "Side Lighting", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Flood Lights"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Front Right)", "Long Range Antenna (Rear)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Emergency Services Falcon Advance 2020",
          cls: "Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Front Bumper Lights", "Grille Lights","Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Flood Lights"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Back Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Prancer Pursuit 2011",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights","Fog Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon eStallion 2024",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Rear Trim Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
          {
          name: "Falcon Traveller PPV 2022",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Cargo Lights", "Grille Lights 1","Mirror Lights", "Plate Lights 1 / 2", "Rear Bumper Lights", "Side Window Lights","Pushbar Lights 1", "Pushbar Lights 2", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight", "Pushbar Floodlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)","Front Plate (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Back Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Platoro PPV 2019",
          cls: "Pickup Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Rear Right)", "Long Range Antenna (Rear Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2024",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick","Grille Lights", "Lower Grille Lights / Grille Lightstick","Fog Lights", "Plate Lights","Headlight Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2021",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Cargo Lights 1 / 2", "Fog Lights", "Grille Lights 1 / 2 / 3", "Plate Lights 1 / 2", "Rear Bumper Lights", "Mirror Lights", "Pillar Lights", "Fender Lights / Side Window Lights", "Siderunners", "Pushbar Lights 1", "Pushbar Lights 2", "Pushbar Lights 3"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight", "Pushbar Floodlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)", "Front Plate (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Back Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Advance 350 2020",
          cls: "Pickup Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2013",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Lower Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2019",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Lower Grille Lights","Pillar Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center / Rear Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Pueblo Pursuit 2020",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Fender Lights","Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Rear Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2018",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Prancer Pursuit 2015",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Fog Lights", "Grille Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Antelope 1994",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2008",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar"],
          optionalAccessories: ["ALPR (optional)","Trailer Hitch (optional)", "Low Profile Siren 1 / 2 (optional)", "Passenger Spotlight (optional)", "Laptop (optional)", "Cage (optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Sedan 2017",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Grille Lights", "Lower Grille Lights","Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Prime Eques Interceptor 2003",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Fog Lights", "Plate Lights", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal / Silver Decal / White Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Equipment Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["N/A"]
        },
        {
          name: "Flood Light Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        },
        {
          name: "Speed Radar Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        }
      ]
    },
    {
      id: "SHR",
      title: "Senior High Rank",
      short: "SHR",
      order: 4,
      intro: "May request HICOM White / Silver decals.",
      tier: "SHR",
      cars: [
        {
          name: "Bullhorn Prancer Pursuit 2011",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights","Fog Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon eStallion 2024",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Rear Trim Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
          {
          name: "Falcon Traveller PPV 2022",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Cargo Lights", "Grille Lights 1","Mirror Lights", "Plate Lights 1 / 2", "Rear Bumper Lights", "Side Window Lights","Pushbar Lights 1", "Pushbar Lights 2", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight", "Pushbar Floodlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)","Front Plate (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Back Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Platoro PPV 2019",
          cls: "Pickup Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Rear Right)", "Long Range Antenna (Rear Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2024",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick","Grille Lights", "Lower Grille Lights / Grille Lightstick","Fog Lights", "Plate Lights","Headlight Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2021",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Cargo Lights 1 / 2", "Fog Lights", "Grille Lights 1 / 2 / 3", "Plate Lights 1 / 2", "Rear Bumper Lights", "Mirror Lights", "Pillar Lights", "Fender Lights / Side Window Lights", "Siderunners", "Pushbar Lights 1", "Pushbar Lights 2", "Pushbar Lights 3"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight", "Pushbar Floodlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)", "Front Plate (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Back Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Advance 350 2020",
          cls: "Pickup Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2013",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Lower Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2019",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Lower Grille Lights","Pillar Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center / Rear Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Pueblo Pursuit 2020",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Fender Lights","Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Rear Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2018",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Prancer Pursuit 2015",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Fog Lights", "Grille Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Antelope 1994",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2008",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar"],
          optionalAccessories: ["ALPR (optional)","Trailer Hitch (optional)", "Low Profile Siren 1 / 2 (optional)", "Passenger Spotlight (optional)", "Laptop (optional)", "Cage (optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Sedan 2017",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Grille Lights", "Lower Grille Lights","Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Prime Eques Interceptor 2003",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Fog Lights", "Plate Lights", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Equipment Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["N/A"]
        },
        {
          name: "Flood Light Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        },
        {
          name: "Speed Radar Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        }
      ]
    },
    {
      id: "HR",
      title: "High Rank",
      short: "HR",
      order: 3,
      intro: "Field command vehicles.",
      tier: "HR",
      cars: [
        {
          name: "Falcon Traveller PPV 2022",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Cargo Lights", "Grille Lights 1","Mirror Lights", "Plate Lights 1 / 2", "Rear Bumper Lights", "Side Window Lights","Pushbar Lights 1", "Pushbar Lights 2", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight", "Pushbar Floodlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)","Front Plate (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Back Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Platoro PPV 2019",
          cls: "Pickup Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Rear Right)", "Long Range Antenna (Rear Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2024",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick","Grille Lights", "Lower Grille Lights / Grille Lightstick","Fog Lights", "Plate Lights","Headlight Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2021",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Cargo Lights 1 / 2", "Fog Lights", "Grille Lights 1 / 2 / 3", "Plate Lights 1 / 2", "Rear Bumper Lights", "Mirror Lights", "Pillar Lights", "Fender Lights / Side Window Lights", "Siderunners", "Pushbar Lights 1", "Pushbar Lights 2", "Pushbar Lights 3"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight", "Pushbar Floodlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)", "Front Plate (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Back Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Advance 350 2020",
          cls: "Pickup Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2013",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Lower Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2019",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Lower Grille Lights","Pillar Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center / Rear Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Pueblo Pursuit 2020",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Fender Lights","Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Rear Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2018",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Prancer Pursuit 2015",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Fog Lights", "Grille Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Antelope 1994",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2008",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar"],
          optionalAccessories: ["ALPR (optional)","Trailer Hitch (optional)", "Low Profile Siren 1 / 2 (optional)", "Passenger Spotlight (optional)", "Laptop (optional)", "Cage (optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Sedan 2017",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Grille Lights", "Lower Grille Lights","Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Prime Eques Interceptor 2003",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Fog Lights", "Plate Lights", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Equipment Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["Black Decal / Grey Decal"],
          antennas: ["N/A"]
        },
        {
          name: "Flood Light Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        },
        {
          name: "Speed Radar Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        }
      ]
    },
    {
      id: "SGTP",
      title: "Sergeant Program",
      short: "SGTP",
      order: 2,
      intro: "Supervisory patrol vehicles.",
      tier: "SGTP",
      cars: [
        {
          name: "Falcon Advance 350 2020",
          cls: "Pickup Truck",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2013",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Lower Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Utility 2019",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Grille Lights", "Lower Grille Lights","Pillar Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center / Rear Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Pueblo Pursuit 2020",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Fender Lights","Grille Lights", "Plate Lights", "Side Window Lights", "Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Rear Center / Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2018",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Prancer Pursuit 2015",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Fog Lights", "Grille Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Antelope 1994",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2008",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar"],
          optionalAccessories: ["ALPR (optional)","Trailer Hitch (optional)", "Low Profile Siren 1 / 2 (optional)", "Passenger Spotlight (optional)", "Laptop (optional)", "Cage (optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Sedan 2017",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Grille Lights", "Lower Grille Lights","Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Prime Eques Interceptor 2003",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Fog Lights", "Plate Lights", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Equipment Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["Black Decal"],
          antennas: ["N/A"]
        },
        {
          name: "Flood Light Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        },
        {
          name: "Speed Radar Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        }
      ]
    },
    {
      id: "LR",
      title: "Low Rank",
      short: "LR",
      order: 1,
      intro: "Standard black decaled patrol fleet.",
      tier: "LR",
      cars: [
        {
          name: "Chevlon Camion PPV 2018",
          cls: "SUV",
          lightbar: "Visor Lights / Legacy Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Trailer Hitch (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Bullhorn Prancer Pursuit 2015",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Fog Lights", "Grille Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Antelope 1994",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Chevlon Camion PPV 2008",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar",
          requiredLighting: ["Rear Light Stick", "Fog Lights", "Grille Lights", "Pillar Lights", "Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar"],
          optionalAccessories: ["ALPR (optional)","Trailer Hitch (optional)", "Low Profile Siren 1 / 2 (optional)", "Passenger Spotlight (optional)", "Laptop (optional)", "Cage (optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Interceptor Sedan 2017",
          cls: "Sedan",
          lightbar: "Visor Lights / Legacy Lightbar",
          requiredLighting: ["Rear Light Stick", "Fender Lights", "Grille Lights", "Lower Grille Lights","Plate Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Falcon Prime Eques Interceptor 2003",
          cls: "Classic Sedan",
          lightbar: "Visor Lights / Legacy Lightbar",
          requiredLighting: ["Rear Window Light Stick", "Fog Lights", "Plate Lights", "Grille Lights", "Side Window Lights", "Small Siderunners"],
          optionalLighting: [],
          requiredAccessories: ["Pushbar", "Wraparound Bar", "LED Spotlight"],
          optionalAccessories: ["ALPR (Optional)", "Low Profile Siren 1 / 2 (Optional)", "Passenger Spotlight (Optional)", "Laptop (Optional)", "Cage (Optional)"],
          decals: ["Black Decal"],
          antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"]
        },
        {
          name: "Equipment Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["Black Decal"],
          antennas: ["N/A"]
        },
        {
          name: "Flood Light Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        },
        {
          name: "Speed Radar Trailer",
          cls: "Trailer",
          lightbar: "N/A",
          requiredLighting: ["N/A"],
          optionalLighting: [],
          requiredAccessories: ["N/A"],
          optionalAccessories: ["N/A"],
          decals: ["N/A"],
          antennas: ["N/A"]
        }
      ]
    }
  ];

  var DIVISIONS = [
    { id: "REGULAR", title: "Regular Subdued", intro: "Standard Ghost Unit vehicle guide.", separate: false },
    { id: "HSPU", title: "High Speed Pursuit Unit", intro: "Separate HSPU ranks and vehicle guide.", separate: true },
    { id: "SRT", title: "Special Response Team", intro: "Separate SRT ranks and vehicle guide.", separate: true }
  ];

  var SEPARATE_GUIDES = {
    HSPU: {
      ranks: [
        { name: "Probationary Officer", cars: ["Bullhorn Prancer Pursuit 2015"], lighting: ["Side Window Lights", "Plate Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Pushbar", "Wraparound Bar", "Grappler", "ALPR (optional)", "Reverse Flashers"], decals: ["Black Decal"] },
        { name: "Officer First+", cars: ["Chevlon Amigo ZLR 2011"], lighting: ["Side Window Lights", "Plate Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Pushbar", "Wraparound Bar", "Grappler", "ALPR (optional)", "Reverse Flashers"], decals: ["Black Decal"] },
        { name: "Senior Officer+", cars: ["Bullhorn Prancer Pursuit 2011"], lighting: ["Side Window Lights", "Plate Lights", "Front Bumper Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Pushbar", "Wraparound Bar", "Grappler", "ALPR (optional)", "LED Spotlights", "Flood Lights", "Reverse Flashers"], decals: ["Black Decal"] },
        { name: "Head Officer+", cars: ["Falcon Stallion 350 2015"], lighting: ["Side Window Lights", "Plate Lights", "Front Bumper Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Pushbar", "Wraparound Bar", "Grappler", "ALPR (optional)", "LED Spotlights", "Flood Lights", "Reverse Flashers"], decals: ["Black Decal"] },
        { name: "Director+", cars: ["Bullhorn Prancer Pursuit Widebody 2020"], lighting: ["Side Window Lights", "Plate Lights", "Front Bumper Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Pushbar", "Wraparound Bar", "Grappler", "ALPR (optional)", "LED Spotlights", "Flood Lights", "Reverse Flashers"], decals: ["Black Decal"] },
        { name: "High Command", cars: ["Chevlon Corbeta RZR 2014"], lighting: ["Side Window Lights", "Plate Lights", "Front Bumper Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Pushbar", "Wraparound Bar", "Grappler", "ALPR (optional)", "LED Spotlights", "Flood Lights", "Reverse Flashers"], decals: ["Black Decal", "White Decal", "Grey Decal"] }
      ],
      antennas: ["5G Antenna (Right)", "Long Range Antenna (Center)", "Low Profile Antenna (Front Center)"],
      note: "Grappler: see handbook for use."
    },
    SRT: {
      ranks: [
        { name: "Probationary Operative+", cars: ["2008 Chevlon Camion PPV", "2015 Bullhorn Prancer Pursuit", "Equipment Trailer"], lighting: ["Side Window Lights", "Plate Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Trailer Hitch", "LED Spotlights", "ALPR (optional)", "Low Profile Siren (optional)", "Pushbar"], decals: ["Black Decal"] },
        { name: "Operative+", cars: ["2019 Chevlon Plotoro"], lighting: ["Side Window Lights", "Plate Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Trailer Hitch", "LED Spotlights", "ALPR (optional)", "Low Profile Siren (optional)", "Pushbar"], decals: ["Black Decal"] },
        { name: "Senior Operative+", cars: ["2020 Emergency Services Falcon Advance+", "2011 SWAT Truck"], lighting: ["Side Window Lights", "Plate Lights", "Front Bumper Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Trailer Hitch", "LED Spotlights", "Flood Lights", "ALPR (optional)", "Low Profile Siren (optional)", "Pushbar"], decals: ["Black Decal"] },
        { name: "Head Operative+", cars: ["2024 Falcon Interceptor Utility"], lighting: ["Side Window Lights", "Plate Lights", "Front Bumper Lights", "Fender Lights", "Fog Lights", "Small Siderunners", "Siderunners", "Grill Lights / Grill Lightbar"], accessories: ["Trailer Hitch", "LED Spotlights", "Flood Lights", "ALPR (optional)", "Low Profile Siren (optional)", "Pushbar"], decals: ["Black Decal"] }
      ],
      antennas: ["5G Antenna - Right (Front Right on ES Falcon Advance+)", "Low Profile Antenna - Front Center", "Long Range Antenna - Rear Center/Trunk Center (Rear on ES Falcon Advance+)"],
      note: "2011 SWAT Truck: Senior Operative+ when 4+ SRT units are available, with Chief+ permission."
    }
  };
/* Gallery- each vehicle & configuration has its own picture folder.
     Folder layout:  assets/views/<RANK-SECTION>/<vehicle-slug>/<angle>.png
     Expected files in every folder (order matters for the grid):
       left.png Â· front.png Â· right.png Â· back.png Â· top.png
     Drop the correct screenshots into each folder to populate the gallery.
     A scaffold script generated these folders from the data below.          */
  var GALLERY_ANGLES = [
    { key: "left",  label: "LEFT" },
    { key: "front", label: "FRONT" },
    { key: "right", label: "RIGHT" },
    { key: "back",  label: "BACK" },
    { key: "top",   label: "TOP" }
  ];

  /* Build the picture folder path for a vehicle.
     Normal cars: single set of pictures.
       assets/views/<RANK-SECTION>/<vehicle-slug>/<angle>.png
     LR cars have TWO sets of pictures:
       - "assets/views/LR/<slug>/"           = Low Rank view (selected LR section)
       - "assets/views/LR/<slug>-higher/"    = everyone-else view (any higher rank)
       because higher ranks run a different configuration on the same LR cars.
     Returns { dir, variant } where variant is a short display label of the set. */
  function galleryFolder(viewSectionId, homeSectionId, carName) {
    var slug = String(carName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    var lrSection = getSection("LR");
    var isLrVehicle = lrSection && lrSection.cars && lrSection.cars.some(function (car) {
      return car && car.name === carName;
    });

    if (isLrVehicle) {
      var higher = viewSectionId !== "LR";
      return {
        dir: "assets/views/LR/" + slug + (higher ? "-higher" : ""),
        variant: higher ? "Higher Rank" : "Low Rank"
      };
    }

    var storageSection = RANK_SECTIONS.slice().sort(function (a, b) {
      return a.order - b.order;
    }).filter(function (section) {
      return section.cars.some(function (car) {
        return car && car.name === carName;
      });
    })[0];
    var sectionId = storageSection ? storageSection.id : homeSectionId;
    return { dir: "assets/views/" + sectionId + "/" + slug, variant: sectionId };
  }

  /* =================== RENDER HELPERS =================== */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function getSection(id) {
    for (var i = 0; i < RANK_SECTIONS.length; i++) {
      if (RANK_SECTIONS[i].id === id) return RANK_SECTIONS[i];
    }
    return null;
  }

  /* Accessible cars = this section plus all lower-rank vehicles.
     If a lower-rank vehicle has a specific higher-rank override, that
     higher-rank entry wins and the inherited lower-rank copy is dropped. */
  function accessibleCars(section) {
    var out = [];
    var seen = Object.create(null);
    RANK_SECTIONS.forEach(function (s) {
      if (s.order <= section.order) {
        s.cars.forEach(function (c) {
          var key = (c && c.name ? c.name.trim() : "");
          if (!key) return;
          if (seen[key]) return;
          seen[key] = true;
          out.push({ car: c, section: s });
        });
      }
    });
    return out;
  }

  /* Merge a car onto its tier defaults (car fields win). */
  function resolveCar(section, car) {
    var tier = TIER[section.tier] ? TIER[section.tier] : {};
    var rankConfig = section && section.custom ? section.custom : {};
    var merged = mergeConfig(tier, rankConfig);
    merged = mergeConfig(merged, car || {});
    merged.name = car && car.name ? car.name : merged.name || "";
    merged.cls = car && car.cls ? car.cls : merged.cls || "";
    merged.decals = normalizeList(merged.decals || ["Black Decal"]);
    merged.requiredLighting = normalizeList(merged.requiredLighting || []);
    merged.optionalLighting = normalizeList(merged.optionalLighting || []);
    merged.requiredAccessories = normalizeList(merged.requiredAccessories || []);
    merged.optionalAccessories = normalizeList(merged.optionalAccessories || []);
    merged.antennas = normalizeList(merged.antennas || []);
    merged.notes = normalizeList(merged.notes || []);
    return merged;
  }
/* ============ STEP 3: DETAIL + GALLERY ============ */
  function openDetail(secId, carName, homeSectionId) {
    var sec = getSection(secId);
    if (!sec) return;
    var list = accessibleCars(sec);
    var match = null;
    list.forEach(function (item) {
      if (item.car.name === carName) match = item;
    });
    if (!match) return;
    var data = resolveCar(match.section, match.car);

    var box = document.getElementById("vgDetail");
    box.innerHTML = "";

    var card = el("div", "vg-detail-card");
    var head = el("div", "vg-detail-head");
    head.appendChild(el("h4", "vg-detail-title", data.name));
    if (data.cls) head.appendChild(el("span", "vg-detail-cls", data.cls));
    head.appendChild(el("span", "vg-detail-tier", "Assigned at " + match.section.title));
    card.appendChild(head);

    card.appendChild(el("h5", "vg-block-title", "Lightbar / Main Lights"));
    card.appendChild(el("p", "vg-block-line", data.lightbar));

    function block(label, items) {
      if (!items || !items.length) return;
      var b = el("div", "vg-block");
      b.appendChild(el("h5", "vg-block-title", label));
      var listEl = el("ul", "vg-block-list");
      items.forEach(function (it) {
        var li = el("li", "vg-block-item");
        if (/(optional)/i.test(it)) {
          li.appendChild(el("span", "vg-li-label", it));
          li.appendChild(el("span", "vg-li-note", "Optional"));
        } else {
          li.textContent = it;
        }
        listEl.appendChild(li);
      });
      b.appendChild(listEl);
      card.appendChild(b);
    }

    block("Required Lighting", data.requiredLighting);
    block("Optional Lighting", data.optionalLighting);
    block("Required Accessories", data.requiredAccessories);
    block("Optional Accessories", data.optionalAccessories);
    block("Allowed Decals", data.decals);

    if (data.antennas.length) {
      card.appendChild(el("h5", "vg-block-title", "Antennas"));
      var aul = el("ul", "vg-block-list");
      data.antennas.forEach(function (a) {
        aul.appendChild(el("li", "vg-block-item", a));
      });
      card.appendChild(aul);
    }
    if (data.notes && data.notes.length) {
      card.appendChild(el("h5", "vg-block-title", "Notes"));
      var nnote = el("ul", "vg-block-list");
      data.notes.forEach(function (n) {
        nnote.appendChild(el("li", "vg-block-item", n));
      });
      card.appendChild(nnote);
    }
    box.appendChild(card);

    // Gallery - one folder per vehicle, 5 angled views.
    var folderInfo = galleryFolder(secId, match.section.id, data.name);
    var galleryWrap = el("div", "vg-gallery");
    galleryWrap.appendChild(el("h4", "vg-gallery-title", "Correctly Configured - " + data.name));
    if (match.section.id === "LR") {
      galleryWrap.appendChild(el("span", "vg-gallery-variant", folderInfo.variant + " configuration"));
    }
    var folderRoot = folderInfo.dir;
    var grid = el("div", "vg-gallery-grid");
    GALLERY_ANGLES.forEach(function (angle) {
      var src = folderRoot + "/" + angle.key + ".png";
      var figure = el("figure", "vg-gallery-item");
      figure.setAttribute("data-angle", angle.label);
      figure.setAttribute("tabindex", "0");
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", "Enlarge " + angle.label + " view of " + data.name);

      var placeholder = document.createElement("img");
      placeholder.src = src;
      placeholder.alt = data.name + " - " + angle.label + " view";
      placeholder.loading = "lazy";
      placeholder.classList.add("vg-gallery-img");
      placeholder.addEventListener("error", function () {
        placeholder.classList.add("is-missing");
      });

      var cap = el("figcaption", "vg-gallery-caption", angle.label);
      figure.appendChild(placeholder);
      figure.appendChild(cap);
      figure.addEventListener("click", function () {
        openLightbox(src, data.name + " - " + angle.label, angle.label);
      });
      figure.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(src, data.name + " - " + angle.label, angle.label);
        }
      });
      grid.appendChild(figure);
    });
    galleryWrap.appendChild(grid);
    box.appendChild(galleryWrap);

    goToStep(4);
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ============ STEP 1: RANK SECTION BUTTONS ============ */
  function renderDivisions() {
    var wrap = document.getElementById("vgDivisions");
    wrap.innerHTML = "";
    DIVISIONS.forEach(function (division) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vg-division-btn";
      btn.setAttribute("data-division", division.id);
      btn.appendChild(el("span", "vg-rank-btn-name", division.title));
      btn.appendChild(el("span", "vg-rank-btn-sub", division.intro));
      btn.addEventListener("click", function () { openDivision(division); });
      wrap.appendChild(btn);
    });
  }

  function openDivision(division) {
    if (!division.separate) {
      goToStep(2);
      document.getElementById("vgRankStage").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    document.getElementById("vgSeparateDivisionTitle").textContent = division.title;
    document.getElementById("vgSeparateDivisionMessage").textContent = "Select a " + division.title + " rank to view the vehicles and configuration rules for that division.";
    renderSeparateRanks(division.id);
    goToStep(5);
    document.getElementById("vgSeparateDivisionStage").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderSeparateRanks(divisionId) {
    var guide = SEPARATE_GUIDES[divisionId];
    var wrap = document.getElementById("vgSeparateRanks");
    var detail = document.getElementById("vgSeparateDetail");
    wrap.innerHTML = "";
    detail.innerHTML = "";
    guide.ranks.slice().reverse().forEach(function (rank, displayIndex) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vg-rank-btn";
      btn.appendChild(el("span", "vg-rank-btn-name", rank.name));
      btn.appendChild(el("span", "vg-rank-btn-sub", "Vehicles available at this rank and below."));
      btn.appendChild(el("span", "vg-rank-btn-count", (guide.ranks.length - displayIndex) + " rank vehicle set"));
      btn.addEventListener("click", function () {
        renderSeparateVehicles(guide, guide.ranks.length - displayIndex - 1);
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      wrap.appendChild(btn);
    });
  }

  function renderSeparateVehicles(guide, rankIndex) {
    var detail = document.getElementById("vgSeparateDetail");
    var rank = guide.ranks[rankIndex];
    var allCars = [];
    guide.ranks.slice(0, rankIndex + 1).forEach(function (entry) {
      entry.cars.forEach(function (car) {
        if (allCars.indexOf(car) === -1) allCars.push(car);
      });
    });
    detail.innerHTML = "";
    detail.appendChild(el("h4", "vg-stage-title", rank.name + " vehicles"));
    allCars.forEach(function (car) {
      var card = el("div", "vg-detail-card vg-separate-vehicle-card");
      card.appendChild(el("h4", "vg-detail-title", car));
      card.appendChild(el("p", "vg-detail-tier", "Assigned at " + (guide.ranks.filter(function (entry) { return entry.cars.indexOf(car) !== -1; })[0].name)));
      appendSeparateList(card, "Lightbar / Main Lights", ["Visor Lights", "Legacy Lightbar", "Valor Lightbar"]);
      appendSeparateList(card, "Required Lighting", rank.lighting);
      appendSeparateList(card, "Accessories", rank.accessories);
      appendSeparateList(card, "Allowed Decals", rank.decals);
      appendSeparateList(card, "Antennas", guide.antennas);
      card.appendChild(el("p", "vg-separate-note", guide.note));
      detail.appendChild(card);
    });
  }

  function appendSeparateList(card, label, items) {
    card.appendChild(el("h5", "vg-block-title", label));
    var list = el("ul", "vg-block-list");
    items.forEach(function (item) { list.appendChild(el("li", "vg-block-item", item)); });
    card.appendChild(list);
  }

  function renderRanks() {
    var wrap = document.getElementById("vgRanks");
    wrap.innerHTML = "";
    // Highest first (as shown on Chain of Command).
    RANK_SECTIONS.slice().sort(function (a, b) { return b.order - a.order; }).forEach(function (sec) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vg-rank-btn";
      btn.setAttribute("data-id", sec.id);
      var name = el("span", "vg-rank-btn-name", sec.title);
      var sub = el("span", "vg-rank-btn-sub", sec.intro);
      var count = el("span", "vg-rank-btn-count", accessibleCars(sec).length + " vehicles");
      btn.appendChild(name);
      btn.appendChild(sub);
      btn.appendChild(count);
      btn.addEventListener("click", function () { openVehicles(sec.id); });
      wrap.appendChild(btn);
    });
  }

  /* ============ STEP 2: VEHICLE BUTTONS ============ */
  function openVehicles(secId) {
    var sec = getSection(secId);
    if (!sec) return;
    var list = accessibleCars(sec);
    var stage = document.getElementById("vgVehicleStage");
    var title = document.getElementById("vgVehicleStageTitle");
    var hint = document.getElementById("vgVehicleHint");
    var cars = document.getElementById("vgCars");

    title.textContent = sec.title + " - Vehicles";
    hint.textContent = "All vehicles accessible at this rank section (" + list.length + " total, including lower ranks). Select one to view its guidelines.";
    cars.innerHTML = "";

    list.forEach(function (item) {
      var data = resolveCar(item.section, item.car);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vg-car-btn";
      btn.setAttribute("data-name", data.name);
      var top = document.createElement("span");
      top.className = "vg-car-btn-top";
      var nm = el("span", "vg-car-btn-name", data.name);
      var badge = el("span", "vg-car-btn-badge", item.section.short);
      if (data.cls) badge.textContent += " · " + data.cls;
      top.appendChild(nm);
      top.appendChild(badge);
      btn.appendChild(top);
      btn.appendChild(el("span", "vg-car-btn-btn", "View Guidelines"));
      btn.addEventListener("click", function () { openDetail(sec.id, data.name, item.section.id); });
      cars.appendChild(btn);
    });

    goToStep(3);
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ============ LIGHTBOX (enlarge on click) ============ */
  function openLightbox(src, caption) {
    var lb = document.getElementById("vgLightbox");
    if (!lb) return;
    var img = document.getElementById("vgLightboxImg");
    var cap = document.getElementById("vgLightboxCaption");
    if (img) img.src = src;
    if (cap) cap.textContent = caption;
    lb.classList.remove("is-hidden");
    document.body.classList.add("vg-lb-open");
  }

  function closeLightbox() {
    var lb = document.getElementById("vgLightbox");
    if (!lb) return;
    lb.classList.add("is-hidden");
    document.body.classList.remove("vg-lb-open");
    var img = document.getElementById("vgLightboxImg");
    if (img) img.src = "";
  }

  /* ============ STEP NAVIGATION ============ */
  var STEP_STAGES = {
    1: "vgDivisionStage",
    2: "vgRankStage",
    3: "vgVehicleStage",
    4: "vgDetailStage",
    5: "vgSeparateDivisionStage"
  };
  function goToStep(step) {
    Object.keys(STEP_STAGES).forEach(function (k) {
      var s = document.getElementById(STEP_STAGES[k]);
      if (s) s.classList.toggle("is-hidden", Number(k) !== step);
    });
    var stepper = document.getElementById("vgStepper");
    if (stepper) {
      stepper.querySelectorAll(".vg-step-item").forEach(function (it) {
        it.classList.toggle("is-active", Number(it.getAttribute("data-vg-step")) === step);
      });
    }
  }

  /* ============ INIT ============ */
  function runInit() {
    if (!document.getElementById("vgRanks")) return; // not on this page
    renderDivisions();
    renderRanks();
    document.getElementById("vgBackToDivisions").addEventListener("click", function () {
      goToStep(1);
      document.getElementById("vgDivisionStage").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.getElementById("vgBackToDivisionsFromSeparate").addEventListener("click", function () {
      goToStep(1);
      document.getElementById("vgDivisionStage").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.getElementById("vgBackToRanks").addEventListener("click", function () {
      goToStep(1);
      document.getElementById("vgRankStage").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.getElementById("vgBackToVehicles").addEventListener("click", function () {
      goToStep(2);
      document.getElementById("vgVehicleStage").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    var lb = document.getElementById("vgLightbox");
    if (lb) {
      var closeBtn = document.getElementById("vgLightboxClose");
      if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
      lb.addEventListener("click", function (e) {
        if (e.target === lb) closeLightbox(); // click on backdrop
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeLightbox();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
})();

