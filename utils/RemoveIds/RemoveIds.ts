// @ts-ignore
export default function removeIds(data: any) {
  if (Array.isArray(data)) {
    // @ts-ignore
    return data.map((item: any) => removeIds(item));
  }

  if (typeof data === "object" && data !== null) {
    const newData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key !== "id") {
          // @ts-ignore
          newData[key] = removeIds(data[key]);
        }
      }
    }
    return newData;
  }

  return data;
}
