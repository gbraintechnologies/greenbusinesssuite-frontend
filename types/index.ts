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
