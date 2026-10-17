export const SPONSORSHIP_TYPES = ["scholarship", "self-sponsor"] as const;
export type SponsorshipType = (typeof SPONSORSHIP_TYPES)[number];

export const SPONSORSHIP_LABELS: Record<SponsorshipType, string> = {
  scholarship: "Scholarship",
  "self-sponsor": "Self Sponsor",
};

export type StudyPricing = {
  applicationFee: number;
  scholarshipBalance: number;
  selfSponsorBalance: number;
};

export function getBalance(pricing: StudyPricing, type: SponsorshipType) {
  return type === "scholarship"
    ? pricing.scholarshipBalance
    : pricing.selfSponsorBalance;
}

export const formatUSD = (amount: number) =>
  `$${amount.toLocaleString("en-US")}`;

export function isSponsorshipType(value: unknown): value is SponsorshipType {
  return (
    typeof value === "string" &&
    (SPONSORSHIP_TYPES as readonly string[]).includes(value)
  );
}
