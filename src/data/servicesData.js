export const MUNICIPAL_SERVICES = [
  {
    id: "building-license",
    title: "Building License",
    icon: "Building2",
    category: "Building",
    department: "Town Planning Department, MCC",
    description: "Sanction of building plans, license issuance for residential and commercial constructions, and NOC requirements.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-TP-01",
    timeLimitDays: 30,
    requiredDocuments: [
      "Property Tax Receipt (latest paid receipt)",
      "Title Deed / Registered Sale Deed / Khata Certificate",
      "Latest Encumbrance Certificate (Form 15 & 16)",
      "Detailed Building Architectural Plan with site elevations (signed by registered engineer/architect)",
      "Architect/Engineer Registration License Copy",
      "Structural Stability Certificate (for G+2 and above)",
      "NOC from Fire and Emergency Services (if applicable)",
      "NOC from Mysuru Urban Development Authority (MUDA) if in peripheral layout"
    ],
    procedure: [
      "Submit application through Sakala online portal or MCC Citizen Service Center",
      "Town Planning Officer & Assistant Executive Engineer conduct site inspection",
      "Verification of setbacks, Floor Area Ratio (FAR), road width, and zoning regulations",
      "Calculation of license fee, scrutiny fee, and building cess",
      "Online fee payment by applicant upon demand notice",
      "Issuance of sanctioned Building License and plan seal"
    ],
    fees: "Scrutiny fee based on built-up square footage, ground rent, labor cess (1% of estimated construction cost), and security deposit.",
    sourceTitle: "MCC Application Procedures & Karnataka Municipal Corporations Act",
    sourceCategory: "Municipal Services"
  },
  {
    id: "trade-license",
    title: "Trade License",
    icon: "Store",
    category: "Licenses",
    department: "Health & Revenue Department, MCC",
    description: "Issuance and renewal of licenses for commercial establishments, shops, restaurants, and industrial trades operating within MCC limits.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-HD-04",
    timeLimitDays: 15,
    requiredDocuments: [
      "PID (Property Identification Number) or Property Tax Receipt of premise",
      "Rent Agreement / Lease Deed or Owner NOC if rented",
      "Identity & Address Proof of Applicant (Aadhaar / Voter ID / PAN)",
      "Partnership Deed / Certificate of Incorporation (if firm/company)",
      "Fire NOC (for hotels, marriage halls, hazardous trades)",
      "Pollution Control Board NOC (for manufacturing / chemical / automobile workshops)",
      "Health & Sanitation NOC for food establishments / FSSAI License"
    ],
    procedure: [
      "Fill online Trade License application with firm name, trade category, and area in sq. ft.",
      "MCC Health Inspector conducts physical premise inspection",
      "Verification of trade categorization (Green/Orange/Red) and safety norms",
      "Fee payment based on trade classification and power/horsepower usage",
      "Approval by MCC Health Officer and digital license issuance"
    ],
    fees: "Structured by trade schedule: General retail, Food & Beverage, Automobile, Lodging, and Industrial categories based on square footage and machinery capacity.",
    sourceTitle: "MCC Trade License Regulations & Schedule of Rates",
    sourceCategory: "Trade License"
  },
  {
    id: "property-registration-khata",
    title: "Property Registration & Khata",
    icon: "FileCheck",
    category: "Property",
    department: "Revenue Department, MCC",
    description: "New Khata registration, Khata transfer (Khata Badalaavane), and bifurcation for properties in Mysuru municipal limits.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-RD-02",
    timeLimitDays: 30,
    requiredDocuments: [
      "Registered Sale Deed / Title Document / Gift Deed",
      "Previous Khata Certificate and Extract",
      "Latest Up-to-date Property Tax Paid Receipt",
      "Encumbrance Certificate (EC) from Sub-Registrar for last 13-30 years",
      "Layout approval copy / MUDA sanction order",
      "Aadhaar Card of the property owner(s)"
    ],
    procedure: [
      "Citizen applies online via Sakala or visits MCC Zonal Office Revenue counter",
      "Revenue Inspector verifies documents against MCC master property register",
      "Site inspection to match physical measurements with title deed",
      "Public notice period if required for title verification",
      "Payment of 2% Khata registration/transfer fee based on stamp duty value",
      "Generation of new PID and issuance of Khata Certificate (A-Khata)"
    ],
    fees: "2% of the registered stamp duty valuation for transfer; nominal fixed fee for Khata extract copy.",
    sourceTitle: "MCC Property Tax User Manual & Revenue Guidelines",
    sourceCategory: "Property Tax"
  },
  {
    id: "mutation",
    title: "Mutation (Khata Transfer)",
    icon: "RefreshCw",
    category: "Property",
    department: "Revenue Department, MCC",
    description: "Transfer of property ownership records in municipal books following sale, gift, inheritance, or court decree.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-RD-03",
    timeLimitDays: 30,
    requiredDocuments: [
      "Registered Transfer Deed (Sale / Gift / Partition / Release Deed)",
      "In case of inheritance: Death Certificate, Family Tree Certificate (Vamshavruksha), Affidavit of legal heirs",
      "Existing Khata Certificate of the deceased/previous owner",
      "Latest Property Tax receipt showing no outstanding dues",
      "Applicant identity proofs"
    ],
    procedure: [
      "File online Sakala application with deed registration number and PID",
      "Verification by Revenue Assessor and publication of notice",
      "30-day objection window (standard statutory period)",
      "Approval by Assistant Revenue Officer (ARO)",
      "Issuance of updated Khata in transferee's name"
    ],
    fees: "2% transfer fee on guideline value, plus administrative document charges.",
    sourceTitle: "MCC Property Tax User Manual",
    sourceCategory: "Property Tax"
  },
  {
    id: "property-amalgamation",
    title: "Property Amalgamation",
    icon: "Layers",
    category: "Property",
    department: "Town Planning & Revenue, MCC",
    description: "Combining two or more adjacent registered property sites/plots into a single municipal parcel with a unified PID.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-TP-06",
    timeLimitDays: 45,
    requiredDocuments: [
      "Sale deeds of all adjacent plots belonging to the same owner(s)",
      "Individual Khata certificates for all constituent plots",
      "Latest property tax receipts for all plots",
      "Combined boundary survey sketch prepared by licensed surveyor",
      "MUDA layout approval plan showing adjacent plots"
    ],
    procedure: [
      "Submit joint amalgamation application to MCC Town Planning Cell",
      "Joint site inspection by Assistant Director of Town Planning & Revenue Inspector",
      "Confirmation that combined plot conforms to minimum road width and frontage rules",
      "Calculation of amalgamation cess and administrative charges",
      "Council/Commissioner approval and assignment of merged single PID"
    ],
    fees: "Amalgamation fee per square meter plus updated Khata consolidation charges.",
    sourceTitle: "MCC Application Procedures & Town Planning Guidelines",
    sourceCategory: "Municipal Services"
  },
  {
    id: "birth-death-modification",
    title: "Birth & Death Certificate Modification",
    icon: "FileText",
    category: "Certificates",
    department: "Statistics & Health Department, MCC",
    description: "Correction of name, spelling, date of event, parent names, or inclusion of child name in municipal vital records.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-HD-02",
    timeLimitDays: 14,
    requiredDocuments: [
      "Original Birth/Death Certificate issued by MCC",
      "Hospital Discharge Summary / Form 1/2 from medical institution",
      "School Marks Card / Transfer Certificate / SSLC Certificate (for spelling proofs)",
      "Aadhaar card of parents / applicant",
      "Affidavit on Rs. 50/100 e-stamp paper sworn before a Notary explaining the error",
      "Gazette notification copy (for formal major name change)"
    ],
    procedure: [
      "Submit correction form at MCC Central Health Office or Zonal Citizen Center",
      "Verification against original hospital birth/death register records",
      "Scrutiny by District Registrar / Health Officer",
      "Endorsement of correction in vital statistics database",
      "Issuance of amended certificate with QR-code authentication"
    ],
    fees: "Statutory late fee / correction fee of Rs. 50 to Rs. 200 depending on elapsed period from event date.",
    sourceTitle: "Registration of Births and Deaths Act & MCC Procedures",
    sourceCategory: "Certificates"
  },
  {
    id: "water-tap-connection",
    title: "New Water Tap Connection",
    icon: "Droplets",
    category: "Water",
    department: "Vani Vilas Water Works (VVWW), MCC",
    description: "Sanction of fresh domestic, non-domestic, or commercial piped potable water supply connection from MCC mains.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-WW-01",
    timeLimitDays: 21,
    requiredDocuments: [
      "Sanctioned Building License copy or verified Khata certificate",
      "Latest Property Tax Paid Receipt",
      "Plumbing layout drawing signed by MCC licensed plumber",
      "Ownership document & Aadhaar copy",
      "Road cutting permission from MCC Engineering department"
    ],
    procedure: [
      "Submit water supply application at VVWW Zonal subdivision office",
      "Junior Engineer inspection to check main line pressure and connection distance",
      "Estimation of road restoration charges, meter security, and connection deposit",
      "Payment of prescribed charges through MCC gateway",
      "Execution of tap connection by licensed plumber under MCC supervision",
      "Installation of calibrated water meter and water ledger account opening"
    ],
    fees: "Connection deposit based on pipe diameter (1/2\", 3/4\", 1\"), plus road cutting and restoration charges.",
    sourceTitle: "Vani Vilas Water Works (VVWW) Citizen Charter",
    sourceCategory: "Municipal Services"
  },
  {
    id: "ugd-connection",
    title: "UGD (Underground Drainage) Connection",
    icon: "Pipette",
    category: "Water",
    department: "Underground Drainage (UGD) Cell, MCC",
    description: "Connection of household or commercial sanitary sewer line to the municipal underground drainage network.",
    sakalaApplicable: true,
    sakalaGSCNo: "GSC-WW-02",
    timeLimitDays: 21,
    requiredDocuments: [
      "Building plan sanction copy showing internal sanitary layout",
      "Latest MCC Property Tax Paid receipt",
      "Existing Water Connection Consumer ID (if available)",
      "Applicant ID and premise possession proof"
    ],
    procedure: [
      "Apply through Sakala or MCC Zonal Engineering office",
      "UGD engineer assesses nearest municipal sewer manhole invert level",
      "Estimate road cutting and inspection chamber junction charges",
      "Citizen deposits statutory supervision and connection fee",
      "Junction execution and issuance of UGD completion certificate"
    ],
    fees: "Inspection fee, connection deposit according to building category (residential/commercial), and PWD road restoration cost.",
    sourceTitle: "MCC Underground Drainage Cell Guidelines",
    sourceCategory: "Municipal Services"
  }
];
