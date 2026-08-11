interface CustomProfileValue {
  id: number;
  user_id: number;
  custom_profile_item_id: number;
  value: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  mobile_phone_number: string;
  user_status: null | string;
  otherNames: string;
  created_on: string;
  gender: string;
  profiles: any[];
  user_kycs: any[];
  custom_profile_values: CustomProfileValue[];
}

export interface CompanyInfo {
  company_name: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone_number: string;
  company_logo: string;
  industry: string;
  company_address: string;
  company_admin_id?: number;
  primary_currency: string;
  company_code: string;
  id?: number;
  status?: string;
  company_custom_values?: CustomField[];
  company_sms_sender_id?: string;
}

export interface Company {
  id?: number;
  companyName: string;
  status: "ACTIVE" | "INACTIVE";
  description: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhoneNumber: string;
  companyLogo: string;
  companyAddress: string;
  companyDigitalAddress?: string;
  industry: string;
  companyMerchantMomoNumber?: string;
  companyBankName?: string;
  taxId?: string;
  startOfDayTime?: Date;
  endOfDayTime?: Date;
  primaryCurrency?: string;
  secondaryCurrency?: string[];
  companyAdminId?: number;
  companyCode?: string;
  buildStatus?: string;
  driverName?: string;
  dbUrl?: string;
  companyIdentifier?: string;
  assignedFormIds?: number[];
  tenantId?: string | number;
}

export interface CustomField {
  custom_profile_item_id: number;
  value: string;
}

export interface CompanyObject {
  company_data: CompanyInfo;
  custom_fields: CustomField[];
}

export interface IFilter {
  id: number;
  name: string;
  value: string;
}

export interface IModal {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title?: string;
  children: any;
  showTitle?: boolean;
  hideClose?: boolean;
  size?: "small" | "big";
}

export type TimelineType =
  | "ALL"
  | "TODAY"
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "THIS_YEAR";

export type TimelineValues =
  | "All time"
  | "Today"
  | "This week"
  | "This month"
  | "This year";

export interface CompanyType {
  id: number;
  description: string;
  companyName: string;
  status: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhoneNumber: string;
  companyLogo: string;
  companyAddress: string;
  companyDigitalAddress: string;
  industry: string;
  companyMerchantMomoNumber: string;
  companyBankName: string;
  taxId: string;
  startOfDayTime: null;
  endOfDayTime: null;
  primaryCurrency: string;
  secondaryCurrency: any[];
  companyAdminId: number;
  companyCode: null;
  buildStatus: string;
  driverName: string;
  dbUrl: string;
  companyIdentifier: string;
  assignedFormIds: any[];
}

export interface Payment {
  id: string;
  billId: string;
  transactionId: string;
  paymentMethod: string;
  customerName: string;
  datePaid: string;
  serviceName: string;
  amountPaid: number;
  status: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  transactionId?: string;
  customerName: string;
  createdOn: string | Date;
  serviceName: string;
  amount: number;
}

export interface Bill {
  amount: number;
  createdOn: Date | string;
  updatedOn: Date | string;
  currency: string;
  id: string;
  serviceName: string;
  paymentMethods: string[];
  billingType: string;
  formId: number;
  status: string;
}

export interface CompanyBranding {
  id: number;
  tenancyId: string;
  companyId: number;
  companyName: string;
  logo: string;
  color: string;
  modules?: any[];
  categorySpecificModules?: any[];
  moduleIds?: (string | number)[];
  categorySpecificModuleIds?: (string | number)[];
}

export interface CompanyBrandingPayload {
  id?: string | number;
  tenancyId: string;
  companyId: string | number;
  logo: string;
  color: string;
  companyName: string;
  moduleIds?: (string | number)[];
  categorySpecificModuleIds?: (string | number)[];
}
