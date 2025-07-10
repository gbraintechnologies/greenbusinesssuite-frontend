import authApi from "../meshAuthClient";

export const createCoreModule = (data: any) => {
    return authApi.post("/core-modules/create", data);
}

export const updateCoreModule = (data: any) => {
    return authApi.put(`/core-modules/update`, data);
} 

export const searchCoreModuleByName = (moduleName: string) => {
    return authApi.get(`/core-modules/module-name-search/${moduleName}`).then((res) => res.data);
}

export const getAllCoreModules = () => {
    return () =>  authApi.get("/core-modules/get-modules").then((res) => res.data);
}

export const getCoreModuleByID = (id: number) => {
    return () => authApi.get(`/core-modules/get-module/${id}`).then((res) => res.data);
}

export const deleteCoreModuleByID = (id: any) => {
    return authApi.delete(`/core-modules/delete/${id}`);
}