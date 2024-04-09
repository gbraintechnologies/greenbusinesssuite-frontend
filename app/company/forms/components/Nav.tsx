import React from "react";

type Props = {
  headerLeft?: React.ReactElement;
  headerRight?: React.ReactElement;
  headerLeftTitle?: string;
};
const Nav: React.FC<Props> = ({ headerLeft, headerRight, headerLeftTitle }) => {
  return (
    <div className="flex justify-between items-center mb-7">
      {headerLeft ? headerLeft : <div className="text-xl font-semibold">{headerLeftTitle}</div>}
        {headerRight ? headerRight : <div>header right</div>}
    </div>
  );
};

export default Nav;
