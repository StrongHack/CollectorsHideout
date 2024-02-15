import Image from "next/image";

export default function ComingSoon() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image
        src="/images/comingSoon.png"
        alt="Descrição da imagem"
        width={3000}
        height={300}
      />
    </div>
  );
}