import { type PackageType } from "@prisma/client";

export interface PokerPackage {
  id: PackageType;
  name: string;
  description: string;
  price: number; // in cents
  credits: number;
  features: string[];
}

export const pokerPackages: PokerPackage[] = [
  {
    id: "SHORT",
    name: "Short Clip",
    description: "Perfect for social media highlights and quick hand reviews",
    price: 10000, // $100
    credits: 1,
    features: [
      "30-60 second edited clip",
      "Professional transitions",
      "Custom graphics",
      "Social media optimized",
      "Delivery within 3-5 days",
    ],
  },
  {
    id: "FULL",
    name: "Full Project + Shorts",
    description: "Complete hand analysis with multiple social media clips",
    price: 50000, // $500
    credits: 5,
    features: [
      "Full hand analysis video (5-10 minutes)",
      "3-5 social media shorts",
      "Professional graphics and animations",
      "Voiceover included",
      "Delivery within 7-10 days",
    ],
  },
  {
    id: "CREDITS",
    name: "Credits Package",
    description: "Best value for regular players - $2,000 for $2,500 value",
    price: 200000, // $2,000
    credits: 25,
    features: [
      "25 credits (worth $2,500)",
      "Use for any package type",
      "Never expires",
      "Priority support",
      "Bulk discount applied",
    ],
  },
];

export const getPackageById = (id: PackageType): PokerPackage | undefined => {
  return pokerPackages.find((pkg) => pkg.id === id);
};

export const getPackagePrice = (id: PackageType): number => {
  const pkg = getPackageById(id);
  return pkg?.price || 0;
};
