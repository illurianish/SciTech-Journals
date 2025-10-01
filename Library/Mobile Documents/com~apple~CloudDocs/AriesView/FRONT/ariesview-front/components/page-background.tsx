import Image from "next/image";

import Stripes from "@/public/images/stripes.svg";
import StripesDark from "@/public/images/stripes-dark.svg";
import AuthBg from "@/public/images/auth-bg.svg";

export default function PageBackground() {
  return (
    <>
      {/* Stripes illustration */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={Stripes}
          width={768}
          height={420}
          alt="Stripes"
          priority
        />
      </div>
      
      {/* Auth background */}
      <div
        className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
        aria-hidden="true"
      >
        <Image
          src={AuthBg}
          alt="Auth background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-[0.03]"
          priority
        />
      </div>
      
      {/* Dark stripes */}
      <div
        className="pointer-events-none absolute left-1/2 bottom-0 -z-10 -translate-x-1/2 transform"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={StripesDark}
          width={768}
          height={420}
          alt="Stripes Dark"
          priority
        />
      </div>
      
      {/* Circles - decorative gradient effects */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 ml-[580px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-linear-to-tr from-blue-500 opacity-50 blur-[160px]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[420px] ml-[380px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-linear-to-tr from-blue-500 to-gray-900 opacity-50 blur-[160px]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[640px] -ml-[300px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-linear-to-tr from-blue-500 to-gray-900 opacity-50 blur-[160px]" />
      </div>
    </>
  );
} 