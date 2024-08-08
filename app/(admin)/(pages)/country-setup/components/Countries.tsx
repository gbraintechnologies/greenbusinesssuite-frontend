import Country from './Country';


const Countries = () => {
    return Country.sort((a, b) => a.name.common.localeCompare(b.name.common));
};

const Countrie = (itm: string) => {
    let country = Country.filter(cnt => cnt.name.common === itm);
    return (country.length > 0) ? country[0] : null;
};

export default Countries;
export { Countrie }