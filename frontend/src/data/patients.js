export const initialPatients = [
  {
    id: "P-001",
    name: "Rohan Mehta",
    age: 24,
    gender: "Male",
    lastSession: "Sep 23, 2026",
    sessions: 8,
    avgIntensity: 2.6,
    status: "Ready",
    history: [
      {
        date: "Sep 23, 2026",
        duration: "05:34",
        intensity: "2.8 mA",
      },
      {
        date: "Sep 20, 2026",
        duration: "04:52",
        intensity: "2.7 mA",
      },
      {
        date: "Sep 17, 2026",
        duration: "06:10",
        intensity: "2.5 mA",
      },
      {
        date: "Sep 14, 2026",
        duration: "05:21",
        intensity: "2.6 mA",
      },
    ],
    telemetry: {
      baseline: 2.4,
      min: 1.8,
      max: 3.0,
      variation: 0.12,
    },
  },

  {
    id: "P-002",
    name: "Anita Rao",
    age: 31,
    gender: "Female",
    lastSession: "Sep 23, 2026",
    sessions: 6,
    avgIntensity: 2.4,
    status: "Ready",
    history: [
      {
        date: "Sep 23, 2026",
        duration: "04:52",
        intensity: "2.7 mA",
      },
      {
        date: "Sep 19, 2026",
        duration: "05:12",
        intensity: "2.4 mA",
      },
      {
        date: "Sep 15, 2026",
        duration: "04:40",
        intensity: "2.2 mA",
      },
    ],
    telemetry: {
      baseline: 2.7,
      min: 2.0,
      max: 3.4,
      variation: 0.18,
    },
  },

  {
    id: "P-003",
    name: "Vikram Naik",
    age: 29,
    gender: "Male",
    lastSession: "Sep 22, 2026",
    sessions: 5,
    avgIntensity: 2.3,
    status: "Ready",
    history: [
      {
        date: "Sep 22, 2026",
        duration: "06:10",
        intensity: "2.5 mA",
      },
      {
        date: "Sep 18, 2026",
        duration: "05:48",
        intensity: "2.3 mA",
      },
      {
        date: "Sep 13, 2026",
        duration: "05:02",
        intensity: "2.1 mA",
      },
    ],
    telemetry: {
      baseline: 2.2,
      min: 1.7,
      max: 2.8,
      variation: 0.10,
    },
  },

  {
    id: "P-004",
    name: "Asha Singh",
    age: 27,
    gender: "Female",
    lastSession: "Sep 22, 2026",
    sessions: 4,
    avgIntensity: 2.5,
    status: "Ready",
    history: [
      {
        date: "Sep 22, 2026",
        duration: "05:21",
        intensity: "2.6 mA",
      },
      {
        date: "Sep 16, 2026",
        duration: "04:55",
        intensity: "2.4 mA",
      },
    ],
    telemetry: {
      baseline: 2.5,
      min: 1.9,
      max: 3.1,
      variation: 0.15,
    },
  },
];