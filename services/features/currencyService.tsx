import authApi from "../meshAuthClient";

export const allCurrencies = () => {
  return () => authApi.get("/forms/currency-setup").then((res) => res.data);
};

export const createCurrency = (data: any) => {
  return authApi.post("/forms/currency-setup", data);
};

export const deleteCurrencyByID = (id: any) => {
  return authApi.delete(`/forms/currency-setup/hard-delete/${id}`);
};
