const UserIcon = ({ fill, width, height }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "16"}
      height={height ?? "16"}
      viewBox="0 0 16 16"
      fill="none"
    >
      <ellipse
        cx="7.99967"
        cy="4.00016"
        rx="2.66667"
        ry="2.66667"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <path
        d="M13.3337 11.6665C13.3337 13.3234 13.3337 14.6665 8.00033 14.6665C2.66699 14.6665 2.66699 13.3234 2.66699 11.6665C2.66699 10.0096 5.05481 8.6665 8.00033 8.6665C10.9458 8.6665 13.3337 10.0096 13.3337 11.6665Z"
        stroke="#475569"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default UserIcon;
