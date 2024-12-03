import authApi from "../meshAuthClient";

export const getAllModules = () => {
    return authApi.get("/setup/module").then((res) => res.data);
};

export const getAllCategories = () => {
    return authApi.get("/setup/category").then((res) => res.data);
};

export const updateModule = (data: any) => {
    return authApi.put(`/setup/module-update`, data);
};

export const updateCategory = (data: any) => {
    return authApi.put(`/setup/category/update`, data);
};

export const createModule = (data: any) => {
    return authApi.post("/setup/module", data);
};

export const createCategory = (data: any) => {
    return authApi.post("/setup/category", data);
};

export const deleteModuleByID = (id: any) => {
    return authApi.delete(`/setup/module-delete/${id}`);
};

export const deleteCategoryByID = (id: any) => {
    return authApi.delete(`/setup/category-delete/${id}`);
};

export const getCategoryByID = (id: number) => {
    return authApi.get(`/setup/get-category/${id}`).then((res) => res.data);
  };
  
export const getModuleByID = (id: number) => {
    return () =>
        authApi.get(`/setup/get-module/${id}`).then((res) => res.data);
};

export const searchCtegoryBycategoryName = (categoryName: string) => {
    return authApi.get(`/setup/category-name-search/${categoryName}`).then((res) => res.data);
  };