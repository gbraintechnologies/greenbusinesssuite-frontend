import authApi from "../meshAuthClient";


export const allJurisdictions = () => {
    return () =>
        authApi.get("/jurisdictions/list").then((res) => res.data);
};

export const createJurisdictions = (data: any) => {
    return authApi.post("/jurisdictions/create", data);
};