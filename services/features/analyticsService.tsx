import authApi from "../axiosAuthClient";

export type NamedValue = { name: string; value: number };

export type AnalyticsProgram = { id: string; label: string };

export type AnalyticsResponse = {
  programs?: AnalyticsProgram[];
  kpis: { label: string; value: number; isCurrency?: boolean }[];
  registered?: NamedValue[];
  gender?: NamedValue[];
  regions?: NamedValue[];
  sectors?: NamedValue[];
  disability?: NamedValue[];
  ownershipAge?: NamedValue[];
  age?: NamedValue[];
  literacy?: NamedValue[];
  active?: NamedValue[];
  monthwise?: { month: string; clients: number }[];
};

export const getGeneralBusinessAnalytics = () =>
  authApi
    .get<AnalyticsResponse>("/analytics/general-business")
    .then((res) => res.data);

export const getLoansGrantsAnalytics = (programId = "all") =>
  authApi
    .get<AnalyticsResponse>("/analytics/loans-grants", { params: { programId } })
    .then((res) => res.data);

export const getTrainingAnalytics = (programId = "all") =>
  authApi
    .get<AnalyticsResponse>("/analytics/training", { params: { programId } })
    .then((res) => res.data);

export const getClientsAnalytics = () =>
  authApi.get<AnalyticsResponse>("/analytics/clients").then((res) => res.data);
