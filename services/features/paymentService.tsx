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
    authApi
      .get(`/invoices/number/${encodeURIComponent(invoiceNumber)}`)
      .then((res) => res.data);
};

export const getBillById = (id: string | number) => {
  return () => authApi.get(`/bills/${id}`).then((res) => res.data);
};

export const getPaymentsByService = (serviceName: string) => {
  return () =>
    authApi
      .get(`/payments/service/${encodeURIComponent(serviceName)}`)
      .then((res) => res.data);
};

export const getPaymentsByMethod = (paymentMethod: string) => {
  return () =>
    authApi
      .get(`/payments/method/${paymentMethod}`)
      .then((res) => res.data);
};

export const getPaymentsByCustomer = (customerName: string) => {
  return () =>
    authApi
      .get(`/payments/customer/${encodeURIComponent(customerName)}`)
      .then((res) => res.data);
};

/** POST /payments/trigger/callback */
export const triggerPaymentCallback = (data: any = {}) => {
  return authApi.post("/payments/trigger/callback", data);
};

/** GET /bills/by-status/{status} */
export const getBillsByStatus = (status: string) => {
  return () =>
    authApi.get(`/bills/by-status/${status}`).then((res) => res.data);
};

/** GET /bills/find-by/{serviceName} */
export const getBillsByServiceName = (serviceName: string) => {
  return () =>
    authApi
      .get(`/bills/find-by/${encodeURIComponent(serviceName)}`)
      .then((res) => res.data);
};

/** DELETE /bills/delete-by-form_id/{formId} */
export const deleteBillByFormId = (formId: string | number) => {
  return authApi.delete(`/bills/delete-by-form_id/${formId}`);
};

/** GET /discounts/{id} */
export const getDiscountById = (id: string | number) => {
  return () => authApi.get(`/discounts/${id}`).then((res) => res.data);
};

/** GET /discounts/service-data/by-id/{id} */
export const getDiscountedServiceById = (id: string | number) => {
  return () =>
    authApi.get(`/discounts/service-data/by-id/${id}`).then((res) => res.data);
};

/** GET /discounts/by-status/{isActive} */
export const getDiscountsByStatus = (isActive: boolean) => {
  return () =>
    authApi.get(`/discounts/by-status/${isActive}`).then((res) => res.data);
};

/** GET /discounts/all/{page}/{size}/{timeline} */
export const getAllDiscountRecords = (
  pageNumber: number,
  pageSize: number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/discounts/all/${pageNumber}/${pageSize}/${timeLine}`)
      .then((res) => res.data);
};

/** PUT /discounts/deactivate/{id} */
export const deactivateDiscount = (id: string | number) => {
  return authApi.put(`/discounts/deactivate/${id}`);
};

/**
 * GET /discounts/create — Swagger lists this as GET (unusual).
 * Prefer backend confirming POST; wrapper matches current OpenAPI.
 */
export const createDiscount = (params?: Record<string, any>) => {
  return authApi.get("/discounts/create", { params }).then((res) => res.data);
};
