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

export interface ICompany {
  companyName: string;
  companyDescription: string;
  industry: string;
  jurisdiction: string;
  companyLogo: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
}