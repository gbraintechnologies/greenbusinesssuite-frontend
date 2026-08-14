export type NamedValue = { name: string; value: number };

export type ProgramOption = { id: string; label: string };

export const LOAN_GRANT_PROGRAMS: ProgramOption[] = [
  { id: "all", label: "All programs" },
  { id: "green-loan-2024", label: "Green Business Loan 2024" },
  { id: "youth-grant", label: "Youth Enterprise Grant" },
  { id: "women-fund", label: "Women in Business Fund" },
  { id: "climate-adapt", label: "Climate Adaptation Grant" },
];

export const TRAINING_PROGRAMS: ProgramOption[] = [
  { id: "all", label: "All programs" },
  { id: "bookkeeping", label: "Bookkeeping Basics" },
  { id: "digital-skills", label: "Digital Skills for SMEs" },
  { id: "green-ops", label: "Green Operations" },
  { id: "export-readiness", label: "Export Readiness" },
];

const GHANA_REGIONS: NamedValue[] = [
  { name: "Greater Accra", value: 1280 },
  { name: "Ashanti", value: 980 },
  { name: "Western", value: 620 },
  { name: "Central", value: 540 },
  { name: "Eastern", value: 510 },
  { name: "Northern", value: 430 },
  { name: "Volta", value: 390 },
  { name: "Bono", value: 310 },
  { name: "Upper East", value: 220 },
  { name: "Upper West", value: 180 },
];

const SECTORS: NamedValue[] = [
  { name: "Agriculture", value: 920 },
  { name: "Retail", value: 740 },
  { name: "Manufacturing", value: 510 },
  { name: "Services", value: 680 },
  { name: "Energy", value: 290 },
  { name: "Transport", value: 210 },
];

function scale(data: NamedValue[], factor: number): NamedValue[] {
  return data.map((item) => ({
    ...item,
    value: Math.max(1, Math.round(item.value * factor)),
  }));
}

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return (h % 40) / 100 + 0.75;
}

export const generalBusinessMock = {
  kpis: [
    { label: "Total businesses", value: 4820 },
    { label: "Total employees", value: 21450 },
  ],
  registered: [
    { name: "Registered", value: 3120 },
    { name: "Non-registered", value: 1700 },
  ] as NamedValue[],
  gender: [
    { name: "Female", value: 2580 },
    { name: "Male", value: 2100 },
    { name: "Other / undisclosed", value: 140 },
  ] as NamedValue[],
  regions: GHANA_REGIONS,
  sectors: SECTORS,
  disability: [
    { name: "With disability", value: 380 },
    { name: "Without disability", value: 4440 },
  ] as NamedValue[],
  ownershipAge: [
    { name: "18–24", value: 420 },
    { name: "25–34", value: 1480 },
    { name: "35–44", value: 1620 },
    { name: "45–54", value: 890 },
    { name: "55+", value: 410 },
  ] as NamedValue[],
  literacy: [
    { name: "None", value: 310 },
    { name: "Basic", value: 1180 },
    { name: "Secondary", value: 1960 },
    { name: "Tertiary", value: 1370 },
  ] as NamedValue[],
};

export function loansGrantsMock(programId: string = "all") {
  const factor = programId === "all" ? 1 : hashSeed(programId);
  return {
    kpis: [
      {
        label: "Total beneficiaries",
        value: Math.round(3260 * factor),
      },
      {
        label: "Total disbursed",
        value: Math.round(18_400_000 * factor),
        isCurrency: true,
      },
    ],
    registered: scale(
      [
        { name: "Registered", value: 2140 },
        { name: "Non-registered", value: 1120 },
      ],
      factor
    ),
    gender: scale(
      [
        { name: "Female", value: 1780 },
        { name: "Male", value: 1400 },
        { name: "Other / undisclosed", value: 80 },
      ],
      factor
    ),
    regions: scale(GHANA_REGIONS, factor * 0.55),
    sectors: scale(SECTORS, factor * 0.5),
    disability: scale(
      [
        { name: "With disability", value: 260 },
        { name: "Without disability", value: 3000 },
      ],
      factor
    ),
    age: scale(
      [
        { name: "18–24", value: 380 },
        { name: "25–34", value: 1120 },
        { name: "35–44", value: 980 },
        { name: "45–54", value: 520 },
        { name: "55+", value: 260 },
      ],
      factor
    ),
  };
}

export function trainingMock(programId: string = "all") {
  const factor = programId === "all" ? 1 : hashSeed(programId);
  return {
    kpis: [
      {
        label: "Total trainees",
        value: Math.round(5140 * factor),
      },
    ],
    gender: scale(
      [
        { name: "Female", value: 2860 },
        { name: "Male", value: 2180 },
        { name: "Other / undisclosed", value: 100 },
      ],
      factor
    ),
    age: scale(
      [
        { name: "18–24", value: 980 },
        { name: "25–34", value: 1760 },
        { name: "35–44", value: 1420 },
        { name: "45–54", value: 680 },
        { name: "55+", value: 300 },
      ],
      factor
    ),
    regions: scale(GHANA_REGIONS, factor * 0.7),
    sectors: scale(SECTORS, factor * 0.65),
  };
}

export const clientsMock = {
  kpis: [
    { label: "Total clients", value: 12840 },
    { label: "New clients this month", value: 426 },
  ],
  active: [
    { name: "Active", value: 9420 },
    { name: "Non-active", value: 3420 },
  ] as NamedValue[],
  registered: [
    { name: "Registered", value: 10120 },
    { name: "Non-registered", value: 2720 },
  ] as NamedValue[],
  gender: [
    { name: "Female", value: 6840 },
    { name: "Male", value: 5720 },
    { name: "Other / undisclosed", value: 280 },
  ] as NamedValue[],
  age: [
    { name: "18–24", value: 1640 },
    { name: "25–34", value: 3980 },
    { name: "35–44", value: 3520 },
    { name: "45–54", value: 2260 },
    { name: "55+", value: 1440 },
  ] as NamedValue[],
  regions: scale(GHANA_REGIONS, 1.8),
  sectors: scale(SECTORS, 1.6),
  monthwise: [
    { month: "Jan", clients: 280 },
    { month: "Feb", clients: 310 },
    { month: "Mar", clients: 295 },
    { month: "Apr", clients: 340 },
    { month: "May", clients: 365 },
    { month: "Jun", clients: 390 },
    { month: "Jul", clients: 410 },
    { month: "Aug", clients: 426 },
  ],
};
