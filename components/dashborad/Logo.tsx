import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      src="/assets/images/logo.svg"
      alt="logo"
      height={130}
      width={130}
      className="object-contain"
    />
  );
};

export default Logo;
