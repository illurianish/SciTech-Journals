import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex mr-3 logo-link" aria-label="AriesView">
      <Image 
        src="/ariesview-logo.svg" 
        alt="AriesView Logo" 
        width={96}
        height={32}
        priority
      />
    </Link>
  );
}
