import authApi from "../meshAuthClient";

export const allCurrencies = (pageNumber: number, pageSize: number) => {
  return () =>
    authApi
      .get(`/forms/currency-setup/existing/${pageNumber}/${pageSize}`)
      .then((res) => res.data);
};

export const createCurrency = (data: any) => {
  return authApi.post("/forms/currency-setup", data);
};

export const getCurrencyByCountryName = (countryName: string) => {
  return authApi.get(`/forms/currency-setup/by-country/${countryName}`).then((res) => res.data);
};

export const deleteCurrencyByID = (id: any) => {
  return authApi.delete(`/forms/currency-setup/hard-delete/${id}`);
};

export const getCurrencyByID = (id: number) => {
  return () =>
    authApi.get(`/forms/currency-setup/${id}`).then((res) => res.data);
};

export const updateCurrency = (data: any) => {
  return authApi.put("/forms/currency-setup/update", data);
};