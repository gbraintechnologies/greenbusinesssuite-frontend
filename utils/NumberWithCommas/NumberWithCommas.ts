function NumberWithCommas(x: any) {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (x === 0) {
    return 0;
  }
}

export default NumberWithCommas;
