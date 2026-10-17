export const SPONSORSHIP_TYPES = ["scholarship", "self-sponsor"] as const;
export type SponsorshipType = (typeof SPONSORSHIP_TYPES)[number];

export const APPLICATION_FEE = 500;

export const STUDY_PLANS: Record<
  SponsorshipType,
  { label: string; balance: number }
> = {
  scholarship: { label: "Scholarship", balance: 1300 },
  "self-sponsor": { label: "Self Sponsor", balance: 800 },
};

export const formatUSD = (amount: number) =>
  `$${amount.toLocaleString("en-US")}`;

export function isSponsorshipType(value: unknown): value is SponsorshipType {
  return (
    typeof value === "string" &&
    (SPONSORSHIP_TYPES as readonly string[]).includes(value)
  );
}
