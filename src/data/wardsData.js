export const MYSURU_ZONES = [
  { id: 1, name: "Zone 1 - Main Office, New Sayyaji Rao Road", office: "Old Council Hall, MCC", wards: [1, 2, 3, 4, 5, 6, 7] },
  { id: 2, name: "Zone 2 - Krishnamurthypuram", office: "Behind Old RTO, Krishnamurthypuram", wards: [8, 9, 10, 11, 12, 13, 14] },
  { id: 3, name: "Zone 3 - Gokulam", office: "3rd Stage, Gokulam", wards: [15, 16, 17, 18, 19, 20, 21, 22] },
  { id: 4, name: "Zone 4 - Yadavagiri / N.R. Mohalla", office: "Near Shivaji Park, N.R. Mohalla", wards: [23, 24, 25, 26, 27, 28, 29] },
  { id: 5, name: "Zone 5 - Mandi Mohalla", office: "Near Mandi Market, Mandi Mohalla", wards: [30, 31, 32, 33, 34, 35, 36] },
  { id: 6, name: "Zone 6 - Nazarbad", office: "Near Karanji Lake / Zoo Road, Nazarbad", wards: [37, 38, 39, 40, 41, 42, 43] },
  { id: 7, name: "Zone 7 - Chamundipuram / Vidyaranyapuram", office: "Near Industrial Suburb, Vidyaranyapuram", wards: [44, 45, 46, 47, 48, 49, 50] },
  { id: 8, name: "Zone 8 - Kuvempunagar", office: "Near Complex, Kuvempunagar", wards: [51, 52, 53, 54, 55, 56, 57] },
  { id: 9, name: "Zone 9 - Ramakrishnanagar / Dattagalli", office: "Near Ring Road Junction, Ramakrishnanagar", wards: [58, 59, 60, 61, 62, 63, 64, 65] }
];

export const MYSURU_WARDS = [
  {
    wardNumber: 1,
    name: "Hebbal 1st Stage / Subhash Nagar",
    zone: 3,
    zoneName: "Zone 3 - Gokulam",
    area: "Hebbal Industrial Area & Residential Subhash Nagar",
    population: 16840,
    streetsCount: 38,
    keyStreets: ["Hebbal Ring Road", "Kalyani Road", "Subhash Nagar Main Road", "Basaveshwara Temple Street", "KRS Road Cross"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 1)",
      officeLocation: "Hebbal Community Hall, MCC Ward 1 Office",
      contact: "MCC Zonal Helpdesk Zone 3: 0821-2515865"
    },
    coordinates: [12.3556, 76.6180]
  },
  {
    wardNumber: 7,
    name: "Gokulam 2nd & 3rd Stage",
    zone: 3,
    zoneName: "Zone 3 - Gokulam",
    area: "Gokulam Cultural & Yoga Hub",
    population: 18450,
    streetsCount: 46,
    keyStreets: ["8th Main Gokulam", "3rd Stage Main Road", "Temple Road Gokulam", "VV Mohalla Link Road", "Contour Road"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 7)",
      officeLocation: "MCC Zonal Office 3, Gokulam 3rd Stage",
      contact: "MCC Zonal Helpdesk Zone 3: 0821-2515865"
    },
    coordinates: [12.3325, 76.6268]
  },
  {
    wardNumber: 12,
    name: "Jayalakshmipuram / V.V. Mohalla",
    zone: 2,
    zoneName: "Zone 2 - Krishnamurthypuram",
    area: "Central Western Residential & Educational Sector",
    population: 17200,
    streetsCount: 42,
    keyStreets: ["Kalidasa Road", "Vishvamanava Double Road (North)", "Kantharaj Urs Road", "Panchamantra Road", "Temple Road VV Mohalla"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 12)",
      officeLocation: "V.V. Mohalla Public Library Complex",
      contact: "MCC Zonal Helpdesk Zone 2: 0821-2331520"
    },
    coordinates: [12.3210, 76.6345]
  },
  {
    wardNumber: 18,
    name: "Saraswathipuram",
    zone: 2,
    zoneName: "Zone 2 - Krishnamurthypuram",
    area: "University Colony & Saraswathipuram Educational Hub",
    population: 19120,
    streetsCount: 52,
    keyStreets: ["Kukkarahalli Lake Road", "1st to 14th Main Saraswathipuram", "Maruthi Temple Road", "Fire Brigade Circle Road"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 18)",
      officeLocation: "Saraswathipuram Park Pavilion, Ward 18",
      contact: "MCC Zonal Helpdesk Zone 2: 0821-2331520"
    },
    coordinates: [12.3082, 76.6330]
  },
  {
    wardNumber: 24,
    name: "Yadavagiri / CFTRI Sector",
    zone: 4,
    zoneName: "Zone 4 - Yadavagiri / N.R. Mohalla",
    area: "Yadavagiri Heights & Medar's Block",
    population: 15300,
    streetsCount: 34,
    keyStreets: ["Vani Vilasa Road", "Yadavagiri Industrial Estate Road", "Princess Road", "Railway Colony Road"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 24)",
      officeLocation: "Yadavagiri Community Centre",
      contact: "MCC Zonal Helpdesk Zone 4: 0821-2495311"
    },
    coordinates: [12.3280, 76.6432]
  },
  {
    wardNumber: 31,
    name: "Mandi Mohalla / Tilak Nagar",
    zone: 5,
    zoneName: "Zone 5 - Mandi Mohalla",
    area: "Heritage Market & Traditional Commercial Core",
    population: 22600,
    streetsCount: 58,
    keyStreets: ["Ashoka Road", "Sawday Road", "Pulikeshi Road", "Mandi Market Circle", "Ekalavya Road"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 31)",
      officeLocation: "Mandi Mohalla Market Complex, Ward 31",
      contact: "MCC Zonal Helpdesk Zone 5: 0821-2498221"
    },
    coordinates: [12.3195, 76.6570]
  },
  {
    wardNumber: 38,
    name: "Nazarbad & Chamundi Hill Foot",
    zone: 6,
    zoneName: "Zone 6 - Nazarbad",
    area: "Palace Environs, Karanji Lake & Nazarbad",
    population: 16900,
    streetsCount: 40,
    keyStreets: ["Male Mahadeshwara Road", "Zoo Road", "Shalivahana Road", "Karanji Lake Bund Road", "Ittigegud Cross"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 38)",
      officeLocation: "Nazarbad Public Dispensary Building",
      contact: "MCC Zonal Helpdesk Zone 6: 0821-2442318"
    },
    coordinates: [12.3025, 76.6690]
  },
  {
    wardNumber: 45,
    name: "Chamundipuram & Sunnadakeri",
    zone: 7,
    zoneName: "Zone 7 - Chamundipuram / Vidyaranyapuram",
    area: "South Central Heritage Settlement",
    population: 20400,
    streetsCount: 48,
    keyStreets: ["Chamundipuram Main Circle", "Sunnadakeri 1st to 8th Cross", "Ramanuja Road", "Vanivilas Market Road"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 45)",
      officeLocation: "Chamundipuram Silk Factory Road Ward Office",
      contact: "MCC Zonal Helpdesk Zone 7: 0821-2483120"
    },
    coordinates: [12.2920, 76.6530]
  },
  {
    wardNumber: 52,
    name: "Kuvempunagar M-Block / Navodaya",
    zone: 8,
    zoneName: "Zone 8 - Kuvempunagar",
    area: "Southwest Residential Township",
    population: 21800,
    streetsCount: 55,
    keyStreets: ["Udayaravi Road", "Vishvamanava Double Road", "Kuvempunagar Complex Road", "Navodaya 1st Cross", "Pramathi School Cross"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 52)",
      officeLocation: "Kuvempunagar M-Block Citizen Service Hall",
      contact: "MCC Zonal Helpdesk Zone 8: 0821-2544200"
    },
    coordinates: [12.2855, 76.6295]
  },
  {
    wardNumber: 59,
    name: "Vijayanagar 2nd Stage & Hootagalli Border",
    zone: 9,
    zoneName: "Zone 9 - Ramakrishnanagar / Dattagalli",
    area: "Western High-Growth Residential Zone",
    population: 24100,
    streetsCount: 62,
    keyStreets: ["Vijayanagar Water Tank Road", "Club Road", "High Tension Line Road", "Outer Ring Road Vijayanagar Junction"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 59)",
      officeLocation: "Vijayanagar 2nd Stage CA Site Park Office",
      contact: "MCC Zonal Helpdesk Zone 9: 0821-2566710"
    },
    coordinates: [12.3385, 76.5980]
  },
  {
    wardNumber: 62,
    name: "Ramakrishnanagar & Dattagalli E & F Block",
    zone: 9,
    zoneName: "Zone 9 - Ramakrishnanagar / Dattagalli",
    area: "Southwest Peripheral Growth Corridor",
    population: 23500,
    streetsCount: 50,
    keyStreets: ["Ring Road Dattagalli Signal", "Kanaka Dasa Circle", "E & F Block Main Boulevard", "Gnanaganga Road"],
    corporator: {
      name: "Public Ward Representative Office",
      designation: "Corporator (Ward 62)",
      officeLocation: "Ramakrishnanagar Citizen Help Hall",
      contact: "MCC Zonal Helpdesk Zone 9: 0821-2566710"
    },
    coordinates: [12.2740, 76.6120]
  }
];
