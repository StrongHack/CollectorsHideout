import Image from "next/image";

export default function Custom404() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image
        src="/images/comingSoon.png"
        alt="Descrição da imagem"
        width={2000}
        height={500}
      />
    </div>
  );
}
