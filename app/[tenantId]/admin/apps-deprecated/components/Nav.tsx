import React from "react";

type Props = {
  headerLeft?: React.ReactElement<any>;
  headerRight?: React.ReactElement<any>;
  headerLeftTitle?: string;

};
const Nav: React.FC<Props> = ({ headerLeft, headerRight, headerLeftTitle }) => {
  return (
    <div className="flex justify-between items-center">
      {headerLeft ? headerLeft : <div className="text-xl font-semibold">{headerLeftTitle}</div>}
        {headerRight ? headerRight : <div></div>}
    </div>
  );
};

export default Nav;
