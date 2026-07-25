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

export const getPaymentSummaryByTimeline = (timeline: TimelineType = "ALL") => {
  return () =>
    authApi.get(`/payments/revenue/${timeline}`).then((res) => res.data);
};

export const getPaymentById = (id: string | number) => {
  return () => authApi.get(`/payments/${id}`).then((res) => res.data);
};

export const getInvoiceById = (id: string | number) => {
  return () => authApi.get(`/invoices/${id}`).then((res) => res.data);
};

export const getInvoiceByNumber = (invoiceNumber: string) => {
  return () =>
    authApi.get(`/invoices/number/${invoiceNumber}`).then((res) => res.data);
};

export const getBillById = (id: string | number) => {
  return () => authApi.get(`/bills/${id}`).then((res) => res.data);
};

export const getPaymentsByService = (serviceName: string) => {
  return () =>
    authApi.get(`/payments/service/${serviceName}`).then((res) => res.data);
};

export const getPaymentsByMethod = (paymentMethod: string) => {
  return () =>
    authApi
      .get(`/payments/method/${paymentMethod}`)
      .then((res) => res.data);
};

export const getPaymentsByCustomer = (customerName: string) => {
  return () =>
    authApi.get(`/payments/customer/${customerName}`).then((res) => res.data);
};
