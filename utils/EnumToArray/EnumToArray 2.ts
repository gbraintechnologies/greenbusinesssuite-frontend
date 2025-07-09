export const enumToArray = (enumToConvert: any) => {
  return Object.values(enumToConvert).map((title) => ({
    key: title,
    value: title,
  }));
};
