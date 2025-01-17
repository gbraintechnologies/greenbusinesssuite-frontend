import authApi from "../meshAuthClient";

export const getAllSpecificCategories = () => {
  return authApi.get("/specific-category-module/all").then((res) => res.data);
};

export const updateSpecificCategory = (data: any) => {
  return authApi.put(`/specific-category-module/update`, data);
};

export const createSpecificCategory = (data: any) => {
  return authApi.post("/specific-category-module/create", data);
};

export const deleteSpecificCategoryByID = (id: number) => {
  return authApi.delete(`/specific-category-module/category-delete/${id}`);
};

export const deleteSpecificModuleFromCategory = (
  categoryID: number,
  moduleID: number
) => {
  return authApi.delete(
    `/specific-category-module/delete-specific-module/${categoryID}/${moduleID}`
  );
};

export const getSpecificCategoryByID = (id: number) => {
  return authApi
    .get(`/specific-category-module/get-category/${id}`)
    .then((res) => res.data);
};

export const getCategoryByCategorySpecificModuleId = (
  categorySpecificModuleId: string
) => {
  return () =>
    authApi
      .get(
        `/specific-category-module/retrieve/by-module-id/${categorySpecificModuleId}`
      )
      .then((res) => res.data);
};

export const getAllSpecificModuleCategoryByID = (id: number) => {
  return authApi
    .get(`/specific-category-module/get-all-modules/${id}`)
    .then((res) => res.data);
};

export const searchSpecificCategoryByName = (categoryName: string) => {
  return authApi
    .get(`/specific-category-module/category-name-search/${categoryName}`)
    .then((res) => res.data);
};

export const createCategorySpecificModule = (categoryID: number, data: any) => {
  return authApi
    .post(`/specific-category-module/add-module/${categoryID}`, data)
    .then((res) => res.data);
};
