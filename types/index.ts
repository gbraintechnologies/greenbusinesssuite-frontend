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
  company_admin_id?: number;
  primary_currency: string;
  id?: number;
  status?: string;
  custom_fields?: CustomField[];
}

export interface CustomField {
  custom_profile_item_id: number;
  value: string;
}

export interface CompanyObject {
  company_data: CompanyInfo;
  custom_fields: CustomField[];
}
