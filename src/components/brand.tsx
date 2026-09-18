import Image from "next/image";
export function Brand({ hero = false }: { hero?: boolean }) {
  return (
    <Image
      src="/brand/logo.svg"
      width={986}
      height={480}
      alt="BEYBE"
      className={hero ? "brand brand-hero" : "brand"}
      priority={hero}
      loading="eager"
    />
  );
}
