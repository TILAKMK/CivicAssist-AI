import { MUNICIPAL_SERVICES } from '../data/servicesData';
import { MYSURU_WARDS, MYSURU_ZONES } from '../data/wardsData';
import { HELPLINES } from '../data/helplinesData';
import { KNOWLEDGE_SOURCES } from '../data/sourcesData';

// Delay helper to emulate network/RAG processing
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Intelligent RAG Mock Engine for Mysuru Municipal Knowledge Base
 */
export async function sendChatMessage({ message, conversation_id = 'default', location = { city: 'Mysuru' }, history = [] }) {
  // Simulate network & retrieval latency
  await delay(650);

  const cleanQuery = (message || '').trim().toLowerCase();

  // Find previous context if any from message history
  let lastTopic = null;
  if (history && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.role === 'assistant' && msg.category && msg.category !== 'Unknown' && msg.category !== 'Fallback') {
        lastTopic = msg.context_topic || msg.category;
        break;
      }
    }
  }

  // --- Check Context Continuation Keywords ---
  const isFollowUp = /^(what about|and the|how about|tell me about the|how much|what are the fees|how long|what is the cost|fees\??|cost\??|duration\??|time limit\??|who to contact\??|where to submit\??)/i.test(cleanQuery);

  // 1. BUILDING LICENSE & FOLLOW-UPS
  if (
    cleanQuery.includes('building license') ||
    cleanQuery.includes('building plan') ||
    cleanQuery.includes('building permit') ||
    cleanQuery.includes('sanction plan') ||
    (isFollowUp && (lastTopic === 'Building License' || lastTopic === 'Building'))
  ) {
    const isFeeQuestion = cleanQuery.includes('fee') || cleanQuery.includes('cost') || cleanQuery.includes('charge') || cleanQuery.includes('rate');
    const isTimelineQuestion = cleanQuery.includes('time') || cleanQuery.includes('day') || cleanQuery.includes('long') || cleanQuery.includes('sakala');

    if (isFeeQuestion) {
      return {
        answer: "For a Building License in Mysuru City Corporation (MCC), fees are calculated by the Town Planning Department based on the total built-up square footage, building category (residential vs. commercial), and road width. This includes a plan scrutiny fee, ground rent, a mandatory 1% labor welfare cess on estimated construction cost, and a refundable debris security deposit.",
        key_info: {
          department: "Town Planning Department, MCC",
          fees: "Scrutiny Fee + 1% Labor Cess + Debris Deposit (computed upon plan verification)",
          timelines: "30 working days under Karnataka Sakala Services Act (GSC-TP-01)",
          notes: "Fee demand notice is issued directly to applicant's Sakala portal after site inspection by Assistant Executive Engineer."
        },
        sources: [
          {
            id: "mcc-application-procedures",
            title: "MCC Application Procedures & Citizen Charter",
            category: "Building License",
            relevance: "High (Official Schedule)",
            excerpt: "Karnataka Municipal Corporations Act & Town Planning Schedule of Scrutiny and Sanction Charges."
          }
        ],
        category: "Building License",
        context_used: Boolean(lastTopic && lastTopic.toLowerCase().includes('building')),
        context_topic: "Building License",
        safe_fallback: false
      };
    }

    if (isTimelineQuestion) {
      return {
        answer: "Under the Karnataka Sakala Guaranteed Services Act (GSC-TP-01), the statutory timeline for processing and sanctioning a Building License by Mysuru City Corporation is 30 working days from the date of complete document submission.",
        key_info: {
          department: "Town Planning Department, MCC",
          timelines: "Guaranteed 30 Days via Sakala Mission",
          notes: "If no objections are received and setbacks conform to zoning regulations, sanction is delivered with digital signature."
        },
        sources: [
          {
            id: "mcc-application-procedures",
            title: "MCC Application Procedures & Citizen Charter",
            category: "Building License",
            relevance: "High",
            excerpt: "Sakala Service Mission Guarantee - Town Planning Services Chapter 4."
          }
        ],
        category: "Building License",
        context_used: Boolean(lastTopic && lastTopic.toLowerCase().includes('building')),
        context_topic: "Building License",
        safe_fallback: false
      };
    }

    // Default Building License query (documents / procedure)
    return {
      answer: "According to the municipal application information, a building license application in Mysuru requires submitting property ownership proof, architectural drawings, and statutory clearances through the MCC Citizen Service Center or the Sakala portal.",
      key_info: {
        department: "Town Planning Department, Mysuru City Corporation",
        documents: [
          "Latest paid Property Tax Receipt",
          "Title Deed / Registered Sale Deed / Khata Certificate",
          "Latest Encumbrance Certificate (Form 15 & 16)",
          "Detailed Building Architectural Plan with elevations (signed by registered architect/engineer)",
          "Architect / Engineer Registration License Copy",
          "Structural Stability Certificate (for G+2 and above)",
          "NOC from Fire and Emergency Services (if high-rise or commercial)",
          "NOC from MUDA (if within designated peripheral scheme)"
        ],
        procedure: [
          "Submit application through Sakala online portal or MCC Citizen Service Center",
          "Town Planning Officer & Assistant Executive Engineer conduct site inspection",
          "Verification of setbacks, FAR, road width, and zoning regulations",
          "Calculation of license fee, scrutiny fee, and building cess",
          "Online fee payment by applicant upon demand notice",
          "Issuance of sanctioned Building License and plan seal"
        ],
        timelines: "30 working days under Sakala Services Act"
      },
      sources: [
        {
          id: "mcc-application-procedures",
          title: "MCC Application Procedures & Citizen Charter",
          category: "Building License",
          relevance: "Direct Match",
          excerpt: "Town Planning Building Plan Sanction Regulations - Section 12 Prerequisite Checklist."
        }
      ],
      category: "Building License",
      context_used: false,
      context_topic: "Building License",
      safe_fallback: false
    };
  }

  // 2. EMERGENCY HELPLINES & FIRE / POLICE / AMBULANCE
  if (
    cleanQuery.includes('fire') ||
    cleanQuery.includes('emergency') ||
    cleanQuery.includes('police') ||
    cleanQuery.includes('ambulance') ||
    cleanQuery.includes('helpline') ||
    cleanQuery.includes('women helpline') ||
    cleanQuery.includes('child helpline') ||
    cleanQuery.includes('dc office') ||
    cleanQuery.includes('control room')
  ) {
    if (cleanQuery.includes('fire')) {
      return {
        answer: "The Fire Emergency number for Mysuru is 101. For direct regional emergency station assistance, you can also reach the Mysuru Fire Control Room at 0821-2423333. Major stations operate 24/7 at Saraswathipuram, Bannimantap, and Hebbal Industrial Suburb.",
        key_info: {
          department: "Karnataka State Fire and Emergency Services (Mysuru Region)",
          contactNumber: "101 (Emergency) / 0821-2423333 (Control Room)",
          notes: "Toll-free emergency line with 24x7 active dispatch units."
        },
        sources: [
          {
            id: "mcc-helpline-info",
            title: "MCC Helpline & Emergency Services Directory",
            category: "Emergency",
            relevance: "Direct Match",
            excerpt: "Mysuru District Disaster Management & Emergency Services Index."
          }
        ],
        category: "Emergency & Helplines",
        context_used: false,
        context_topic: "Helplines",
        safe_fallback: false
      };
    }

    if (cleanQuery.includes('police')) {
      return {
        answer: "The Police Emergency helpline for Mysuru City is 100 or Unified Emergency 112. The Mysuru City Police Commissionerate control room can also be contacted for immediate distress response.",
        key_info: {
          department: "Mysuru City Police Commissionerate",
          contactNumber: "100 or 112 (Emergency)",
          notes: "GPS-enabled patrol vehicles dispatched to caller location across all 65 wards."
        },
        sources: [
          {
            id: "mcc-helpline-info",
            title: "MCC Helpline & Emergency Services Directory",
            category: "Emergency",
            relevance: "Direct Match",
            excerpt: "Mysuru City Police Emergency Directory."
          }
        ],
        category: "Emergency & Helplines",
        context_used: false,
        context_topic: "Helplines",
        safe_fallback: false
      };
    }

    if (cleanQuery.includes('ambulance') || cleanQuery.includes('medical')) {
      return {
        answer: "For medical emergencies and ambulance dispatch in Mysuru, call 108 (Arogya Kavacha - Emergency Ambulance) or 102 (Janani Shishu Suraksha). Trauma care coordination is linked with KR Hospital and district healthcare centers.",
        key_info: {
          department: "Govt. of Karnataka Health Department & 108 Emergency",
          contactNumber: "108 (Toll Free)",
          notes: "Equipped with Basic and Advanced Life Support ambulances across Mysuru."
        },
        sources: [
          {
            id: "mcc-helpline-info",
            title: "MCC Helpline & Emergency Services Directory",
            category: "Emergency",
            relevance: "Direct Match",
            excerpt: "Mysuru District Health & Emergency Directory."
          }
        ],
        category: "Emergency & Helplines",
        context_used: false,
        context_topic: "Helplines",
        safe_fallback: false
      };
    }

    // General Helplines Overview
    return {
      answer: "Mysuru City Corporation and District Administration provide dedicated 24x7 helplines for civic and emergency needs. Key numbers include: Police (100 / 112), Fire (101), Ambulance (108), Women Helpline (1091), Childline (1098), DC Office Disaster Cell (1077), and MCC Central Control Room (0821-2418800).",
      key_info: {
        department: "Mysuru District Emergency & Civic Control",
        notes: "All emergency numbers (100, 101, 108, 112, 1091, 1098, 1077) are toll-free and operate 24/7."
      },
      sources: [
        {
          id: "mcc-helpline-info",
          title: "MCC Helpline & Emergency Services Directory",
          category: "Emergency",
          relevance: "Direct Match",
          excerpt: "Mysuru Emergency Helpline Directory."
        }
      ],
      category: "Emergency & Helplines",
      context_used: false,
      context_topic: "Helplines",
      safe_fallback: false
    };
  }

  // 3. PROPERTY TAX & PID & SAS
  if (
    cleanQuery.includes('property tax') ||
    cleanQuery.includes('pid') ||
    cleanQuery.includes('sas') ||
    cleanQuery.includes('khata') ||
    cleanQuery.includes('property search') ||
    (isFollowUp && (lastTopic === 'Property Tax' || lastTopic === 'Property'))
  ) {
    if (cleanQuery.includes('pid') || cleanQuery.includes('property number') || cleanQuery.includes('what is pid')) {
      return {
        answer: "A Property Identification Number (PID) is a unique 15-digit or alphanumeric identifier assigned by Mysuru City Corporation (MCC) to each registered municipal property. It combines your Zone Number, Ward Number, and specific Property Assessment Sequence. The PID is required for paying property tax online, downloading Khata certificates, and obtaining building licenses.",
        key_info: {
          department: "Revenue Department, MCC",
          notes: "You can find your PID printed at the top of your previous year's MCC Property Tax receipt or Khata certificate. Please note: For privacy, public searches display only tax demand calculations, not personal ownership details."
        },
        sources: [
          {
            id: "mcc-property-tax-manual",
            title: "MCC Property Tax User Manual & SAS Guidelines",
            category: "Property Tax",
            relevance: "High (Glossary & Index)",
            excerpt: "Self-Assessment Scheme (SAS) - Chapter 2 PID Structure."
          }
        ],
        category: "Property Tax",
        context_used: Boolean(lastTopic && lastTopic.toLowerCase().includes('property')),
        context_topic: "Property Tax",
        safe_fallback: false
      };
    }

    if (cleanQuery.includes('how do i pay') || cleanQuery.includes('online payment') || cleanQuery.includes('pay property tax') || cleanQuery.includes('procedure')) {
      return {
        answer: "To pay your Mysuru Property Tax online through the MCC Self-Assessment Scheme (SAS) portal: 1) Visit the official MCC Property Tax portal (mysurucitycorporation.co.in or Karnataka Municipal SAS portal); 2) Enter your 15-digit PID or Old Assessment Number & Ward Number; 3) Verify property classification and auto-calculated tax demand; 4) Select payment gateway (Net Banking / UPI / Debit Card); 5) Download the digitally signed SAS Form & Tax Paid Receipt.",
        key_info: {
          department: "Revenue Department, MCC",
          procedure: [
            "Visit the MCC Property Tax SAS portal",
            "Enter PID (Property Identification Number) or Ward and Assessment No.",
            "Review calculated tax demand (including cess, solid waste cess, and rebate if paid before April 30th)",
            "Pay via UPI, Netbanking, or Debit/Credit card",
            "Download and save the official MCC e-Receipt"
          ],
          notes: "Early bird rebate of 5% is traditionally offered for payments made during the first month of the financial year (April)."
        },
        sources: [
          {
            id: "mcc-property-tax-manual",
            title: "MCC Property Tax User Manual & SAS Guidelines",
            category: "Property Tax",
            relevance: "Direct Match",
            excerpt: "MCC Online Citizen Services - SAS Property Tax Payment Manual."
          }
        ],
        category: "Property Tax",
        context_used: Boolean(lastTopic && lastTopic.toLowerCase().includes('property')),
        context_topic: "Property Tax",
        safe_fallback: false
      };
    }

    // General Property Tax info
    return {
      answer: "Property Tax in Mysuru is levied under the Self-Assessment Scheme (SAS) governed by the Karnataka Municipal Corporations Act. Property owners must calculate tax based on built-up area, usage (residential/commercial/vacant), zone classification, and construction type.",
      key_info: {
        department: "Revenue Department, Mysuru City Corporation",
        documents: [
          "PID (Property Identification Number)",
          "Previous year's Tax Paid Receipt",
          "Khata Certificate / Assessment Extract"
        ],
        notes: "Properties without PID can obtain new registration by submitting registered sale deed and layout sanction at the respective MCC Zonal Office."
      },
      sources: [
        {
          id: "mcc-property-tax-manual",
          title: "MCC Property Tax User Manual & SAS Guidelines",
          category: "Property Tax",
          relevance: "High",
          excerpt: "MCC Property Tax Assessment Rules & Classification Criteria."
        }
      ],
      category: "Property Tax",
      context_used: false,
      context_topic: "Property Tax",
      safe_fallback: false
    };
  }

  // 4. TRADE LICENSE & COMMERCE
  if (
    cleanQuery.includes('trade license') ||
    cleanQuery.includes('trade permit') ||
    cleanQuery.includes('shop license') ||
    cleanQuery.includes('commercial license') ||
    (isFollowUp && (lastTopic === 'Trade License' || lastTopic === 'Licenses'))
  ) {
    return {
      answer: "A Trade License is mandatory for any commercial, retail, manufacturing, or service business operating within Mysuru City Corporation limits. Applications are processed through the MCC Health and Revenue departments under Sakala (GSC-HD-04) within 15 working days.",
      key_info: {
        department: "Health & Revenue Department, MCC",
        documents: [
          "PID or Property Tax Receipt of the business premises",
          "Rental/Lease Agreement or Owner NOC if rented",
          "Identity & Address Proof of Applicant (Aadhaar / PAN)",
          "Partnership Deed / Incorporation Certificate (for companies)",
          "Fire Department NOC (for hotels, marriage halls, hazardous trades)",
          "Pollution Control Board NOC (for industrial / chemical / auto workshops)",
          "FSSAI Food License / Health NOC (for food & beverage establishments)"
        ],
        procedure: [
          "Submit application online via Sakala / MCC portal with firm details and trade category",
          "MCC Health Inspector conducts physical premise inspection",
          "Fee determination based on square footage, power usage (HP), and trade classification",
          "Online payment upon verification",
          "Issuance of Digital Trade License valid for 1 financial year"
        ],
        timelines: "15 working days under Sakala Services Act"
      },
      sources: [
        {
          id: "mcc-trade-license-info",
          title: "MCC Trade License Information & Schedule",
          category: "Trade License",
          relevance: "Direct Match",
          excerpt: "Mysuru City Corporation Trade Schedule Rates and Inspection Guidelines."
        }
      ],
      category: "Trade License",
      context_used: Boolean(lastTopic && lastTopic.toLowerCase().includes('trade')),
      context_topic: "Trade License",
      safe_fallback: false
    };
  }

  // 5. SOLID WASTE MANAGEMENT
  if (
    cleanQuery.includes('waste') ||
    cleanQuery.includes('garbage') ||
    cleanQuery.includes('segregation') ||
    cleanQuery.includes('collection') ||
    cleanQuery.includes('dustbin') ||
    cleanQuery.includes('compost') ||
    (isFollowUp && (lastTopic === 'Waste Management' || lastTopic === 'Waste'))
  ) {
    const isScheduleQuery = cleanQuery.includes('schedule') || cleanQuery.includes('when is') || cleanQuery.includes('time') || cleanQuery.includes('truck');

    if (isScheduleQuery) {
      return {
        answer: "Mysuru City Corporation conducts morning door-to-door waste collection across residential wards using motorized auto-tippers and push-carts. However, specific vehicle arrival timings vary by street and ward route.",
        key_info: {
          department: "Solid Waste Management (SWM) Cell, MCC",
          notes: "Current area-specific live truck schedule is not available in the connected municipal knowledge base. Morning door-to-door collection typically operates between 6:30 AM and 11:30 AM."
        },
        sources: [
          {
            id: "mysuru-waste-management-info",
            title: "Mysuru Solid Waste Management Guidelines",
            category: "Waste Management",
            relevance: "Medium",
            excerpt: "MCC Solid Waste Door-to-Door Protocol and Civic Collection Standards."
          }
        ],
        category: "Waste Management",
        context_used: false,
        context_topic: "Waste Management",
        safe_fallback: false
      };
    }

    return {
      answer: "Mysuru's Clean City Solid Waste Management system mandates strict 3-way source segregation at households and commercial units: 1) Wet Waste (Green Bin) for composting, 2) Dry Waste (Blue Bin) for recycling, and 3) Domestic Hazardous & Sanitary Waste (Red Bin / wrapped).",
      key_info: {
        department: "Solid Waste Management (SWM) Cell, MCC",
        procedure: [
          "Segregate kitchen/organic waste in Green Bin",
          "Segregate plastic, paper, metal, and dry packaging in Blue Bin",
          "Wrap sanitary and hazardous waste separately in marked bags",
          "Hand over directly to MCC door-to-door collection tipper staff",
          "Do not dump or burn waste in open plots or storm drains (strictly punishable under MCC bylaws)"
        ],
        notes: "Mysuru operates 9 Zero Waste Management (ZWM) plants and the centralized Vidyaranyapuram Compost Plant."
      },
      sources: [
        {
          id: "mysuru-waste-management-info",
          title: "Mysuru Solid Waste Management Guidelines",
          category: "Waste Management",
          relevance: "Direct Match",
          excerpt: "Mysuru Municipal SWM Bylaws - Source Segregation & Processing Guidelines."
        }
      ],
      category: "Waste Management",
      context_used: false,
      context_topic: "Waste Management",
      safe_fallback: false
    };
  }

  // 6. WARDS & ZONAL QUERIES
  if (
    cleanQuery.includes('ward') ||
    cleanQuery.includes('corporator') ||
    cleanQuery.includes('gokulam') ||
    cleanQuery.includes('jayalakshmipuram') ||
    cleanQuery.includes('saraswathipuram') ||
    cleanQuery.includes('kuvempunagar') ||
    cleanQuery.includes('vijayanagar') ||
    cleanQuery.includes('mandi mohalla')
  ) {
    // Find matching ward if named
    const matchedWard = MYSURU_WARDS.find(w =>
      cleanQuery.includes(w.name.toLowerCase()) ||
      cleanQuery.includes(`ward ${w.wardNumber}`) ||
      cleanQuery.includes(`ward no ${w.wardNumber}`) ||
      w.keyStreets.some(st => cleanQuery.includes(st.toLowerCase()))
    ) || MYSURU_WARDS[2]; // Default to Ward 12 if generic

    return {
      answer: `Mysuru City Corporation comprises 65 administrative wards organized under 9 Zonal Offices. For ${matchedWard.name} (Ward ${matchedWard.wardNumber}), public civic services and revenue matters are administered under ${matchedWard.zoneName}.`,
      key_info: {
        department: `MCC Zonal Office ${matchedWard.zone} (${matchedWard.zoneName})`,
        documents: [
          `Ward Number: ${matchedWard.wardNumber}`,
          `Area: ${matchedWard.area}`,
          `Population: ~${matchedWard.population.toLocaleString()}`,
          `Total Registered Streets: ${matchedWard.streetsCount}`,
          `Representative Office: ${matchedWard.corporator.officeLocation}`,
          `Zonal Helpdesk: ${matchedWard.corporator.contact}`
        ],
        notes: "Ward citizens can submit local civic requests and property documentation directly at their respective Zonal Citizen Service Center."
      },
      sources: [
        {
          id: "mysuru-ward-info",
          title: "Mysuru Ward Information & Zonal Demographics",
          category: "Ward Explorer",
          relevance: "High (Demographic Match)",
          excerpt: `MCC Ward ${matchedWard.wardNumber} Boundary & Demographics Register.`
        }
      ],
      category: "Ward Information",
      context_used: false,
      context_topic: "Ward Information",
      safe_fallback: false
    };
  }

  // 7. WATER & UGD CONNECTION
  if (cleanQuery.includes('water') || cleanQuery.includes('tap') || cleanQuery.includes('ugd') || cleanQuery.includes('drainage') || cleanQuery.includes('sewage')) {
    const isUgd = cleanQuery.includes('ugd') || cleanQuery.includes('drainage') || cleanQuery.includes('sewage');
    const service = isUgd ? MUNICIPAL_SERVICES.find(s => s.id === 'ugd-connection') : MUNICIPAL_SERVICES.find(s => s.id === 'water-tap-connection');

    return {
      answer: `For ${service.title} in Mysuru City Corporation, applications are administered through ${service.department} under Sakala (${service.sakalaGSCNo}) with a statutory completion guarantee of ${service.timeLimitDays} working days.`,
      key_info: {
        department: service.department,
        documents: service.requiredDocuments,
        procedure: service.procedure,
        timelines: `${service.timeLimitDays} days under Sakala Guarantee`
      },
      sources: [
        {
          id: "mcc-application-procedures",
          title: "MCC Application Procedures & Citizen Charter",
          category: "Municipal Services",
          relevance: "Direct Match",
          excerpt: `${service.title} Procedure Manual - Vani Vilas Water Works.`
        }
      ],
      category: "Water & UGD",
      context_used: false,
      context_topic: "Water & UGD",
      safe_fallback: false
    };
  }

  // 8. CERTIFICATES (BIRTH / DEATH)
  if (cleanQuery.includes('birth') || cleanQuery.includes('death') || cleanQuery.includes('certificate')) {
    const service = MUNICIPAL_SERVICES.find(s => s.id === 'birth-death-modification');
    return {
      answer: "Modifications, spelling corrections, or name inclusions in Birth and Death certificates are processed by the MCC Statistics and Health Department under the Registration of Births and Deaths Act (Sakala GSC-HD-02).",
      key_info: {
        department: "Statistics & Health Department, MCC",
        documents: service.requiredDocuments,
        procedure: service.procedure,
        timelines: "14 working days via Sakala"
      },
      sources: [
        {
          id: "mcc-application-procedures",
          title: "MCC Application Procedures & Citizen Charter",
          category: "Certificates",
          relevance: "Direct Match",
          excerpt: "Vital Statistics Registration and Correction Regulations."
        }
      ],
      category: "Certificates",
      context_used: false,
      context_topic: "Certificates",
      safe_fallback: false
    };
  }

  // 9. OUT-OF-SCOPE / UNKNOWN QUESTION -> SAFE FALLBACK
  return {
    answer: "I don't have enough verified information in the current Mysuru municipal knowledge base to answer this reliably. Rather than guessing, please contact the relevant municipal department or check our emergency helplines directory.",
    key_info: null,
    sources: [],
    category: "Fallback",
    context_used: false,
    context_topic: null,
    safe_fallback: true
  };
}

export async function getServices() {
  await delay(100);
  return MUNICIPAL_SERVICES;
}

export async function getService(id) {
  await delay(100);
  return MUNICIPAL_SERVICES.find((s) => s.id === id) || null;
}

export async function getWards() {
  await delay(100);
  return { wards: MYSURU_WARDS, zones: MYSURU_ZONES };
}

export async function getWard(wardNumber) {
  await delay(100);
  return MYSURU_WARDS.find((w) => w.wardNumber === Number(wardNumber)) || null;
}

export async function getHelplines() {
  await delay(100);
  return HELPLINES;
}

export async function getSources() {
  await delay(100);
  return KNOWLEDGE_SOURCES;
}

export async function getSource(id) {
  await delay(100);
  return KNOWLEDGE_SOURCES.find((s) => s.id === id) || null;
}
