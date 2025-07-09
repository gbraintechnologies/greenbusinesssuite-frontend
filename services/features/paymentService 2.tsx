import { TimelineType } from "@/types";
import authApi from "../meshAuthClient";

export const getAllBills = (
  pageNumber: number,
  pageSize: number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/bills/all/${pageNumber}/${pageSize}/${timeLine}`)
      .then((res) => res.data);
};

export const createBill = (data: any) => {
  return authApi.post("/bills", data);
};

export const submitPaymentRequest = (data: any) => {
  return authApi.post("/payments", data);
};

export const getBillByFormId = (id: any) => {
  return () =>
    authApi.get(`/bills/find-by-form_id/${id}`).then((res) => res.data);
};

export const deleteBill = (id: any) => {
  return authApi.delete(`/bills/${id}`);
};

export const updateBill = (data: any) => {
  return authApi.put(`/bills/update-bill`, data);
};

export const getAllRecurringBills = () => {
  return () =>
    authApi.get(`/bills/by-type/RECURRING_BILL`).then((res) => res.data);
};

export const getAllOneOffBill = () => {
  return () =>
    authApi.get(`/bills/by-type/ONE_OFF_BILL`).then((res) => res.data);
};

export const applyDiscount = (id: any, data: any) => {
  return authApi.post(`/discounts/apply-discount/${id}`, data);
};

export const deleteDiscount = (id: any) => {
  return authApi.delete(`/discounts/${id}`);
};

export const getAllDiscounts = (
  pageNumber: number,
  pageSize: number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/discounts/service-data/${pageNumber}/${pageSize}/${timeLine}`)
      .then((res) => res.data);
};

export const updateDiscount = (data: any) => {
  return authApi.put(`/discounts/update`, data);
};

export const getAllPayments = (
  pageNumber: number,
  pageSize: number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/payments/all/${pageNumber}/${pageSize}/${timeLine}`)
      .then((res) => res.data);
};

export const getAllInvoices = (
  pageNumber: number,
  pageSize: number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/invoices/all/${pageNumber}/${pageSize}/${timeLine}`)
      .then((res) => res.data);
};

export const getPaymentSummary = () => {
  return () => authApi.get(`/payments/revenue`).then((res) => res.data);
};
