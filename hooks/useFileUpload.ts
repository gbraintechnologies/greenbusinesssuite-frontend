import axios from "axios";
import { useState } from "react";

import { meshBaseURL } from "@/lib/api";
import { getToken } from "@/services/localService";

const useFileUpload = () => {
  const [loadingFile, setLoadingFile] = useState(false);
  // const [error, setError] = useState(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoadingFile(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios({
        baseURL: meshBaseURL,
        url: `/s3/resource/upload/${file?.name}`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFile(false);
    }
  };

  return { handleFileUpload, loadingFile };
};

export default useFileUpload;
