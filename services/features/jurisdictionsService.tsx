import authApi from "../axiosAuthClient";


export const allJurisdictions = () => {
    return () => authApi.get("/jurisdictions/").then((res) => res.data);
};

export const SearchJurisdictions = (filter_word: any) => {
    return () =>
        authApi.get(`/jurisdictions-by-filter/${filter_word}`).then((res) => res.data);
};

export const JurisdictionsID = (id: any) => {
    return () => authApi.get(`/jurisdictions/${id}`).then((res) => res.data);
};

export const createJurisdictions = (data: any) => {
    return authApi.post("/jurisdictions/", data);
};

export const createAddressScheme = (data: any) => {
    return authApi.post("/addresses/create_addressing_scheme/", data);
};

export const createAddressLevel = (data: any) => {
    return authApi.post("/addresses/create_address_level/", data);
};

export const allCurrencies = () => {
    return () => authApi.get("/currencies/").then((res) => res.data);
};

export const createCurrency = (data: any) => {
    return authApi.post("/currencies/", data);
};