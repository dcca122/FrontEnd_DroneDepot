// config/plans.js
export const plans = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 199,
    creditsPerMonth: 1,
    rollover: true,
    features: [
      "FAA-certified pilots",
      "48-hour delivery",
      "Priority scheduling"
    ],
    notes: "1 credit ≈ photo-only standard shoot"
  },
  {
    id: "professional",
    name: "Professional",
    priceMonthly: 399,
    creditsPerMonth: 3,
    rollover: true,
    features: [
      "FAA-certified pilots",
      "24-hour delivery",
      "Priority scheduling",
      "Video editing included",
      "Drone mapping"
    ],
    notes: "3 credits ≈ 3 photo shoots or 1 video + 1 photo shoot"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 799,
    creditsPerMonth: 8,
    rollover: true,
    features: [
      "FAA-certified pilots",
      "Same-day delivery available",
      "Priority scheduling",
      "Video editing included",
      "Drone mapping",
      "Custom branding",
      "Dedicated account manager"
    ],
    notes: "8 credits ≈ 8 photo shoots or 2 videos + 2 photo shoots"
  }
];

