import React from "react";

import { BeatLoader } from "react-spinners";

function Loader({ size = 10, color = "#16A34A" }) {
  return <BeatLoader size={size} margin={2} color={color} />;
}

export default Loader;
