import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Logo() {
  const [showButton, setShowButton] = useState(false);

  /**
   * Changes navigation button according to inner width
   */
  const changeNavButton = () => {
    try {
      if (window.scrollY >= 400 && window.innerWidth < 768) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (error) {
      toast.error("Error changing nav button!");
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
          width={60}
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
};