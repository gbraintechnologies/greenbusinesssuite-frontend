import authApi from "../meshAuthClient";
import authNoTenantApi from "../meshAuthNoTenantClient"

export const getMediaByType = (type: "BLOGS" | "VIDEOS" | "ADS", page: number, size: number) => {
    return () => authApi.get(`/media/filter-media/${type}/${page}/${size}`).then((res) => res.data);
    }

    export const getFilteredMedia = (search: string) => {
    return () => authApi.get(`/media/search/${search}`).then((res) => res.data);
    }