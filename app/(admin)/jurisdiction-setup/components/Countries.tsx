import Country from "./Country";

const Countries = () => {
  return Country;
};

const Countrie = (itm: string) => {
  let country = Country.filter((cnt) => cnt.cca2 === itm);
  return country.length > 0 ? country[0] : null;
};

export default Countries;
export { Countrie };
