/** Single operating company for Green Business Suite. */
export const BUSINESS_SUITE_IDENTIFIER = "busi88056";
export const BUSINESS_SUITE_NAME = "BusinessSuite";

export const SERVICE_CATEGORIES = [
  "General",
  "Financial",
  "Non-government",
  "Training",
  "Compliance",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
