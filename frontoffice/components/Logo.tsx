import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Logo() {
  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 && window.innerWidth < 768) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);
  }, []);

  return (
    <>
      <Link href="/" style={{ display: showButton ? "none" : "block" }}>
        <Image
          src= "/images/logo.png"
          alt="Logo"
          width= {50}
          height={25}
          className="rounded-full"
        />
      </Link>
      <div
        style={{
          display: showButton ? "block" : "none",
        }}
      >
        Button
      </div>
    </>
  );
}