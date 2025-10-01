import Image from "next/image";
import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {
  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-6 pt-0 md:pb-8 md:pt-2">
          {/* Section header */}
          <div className="pb-6 text-center md:pb-8">
            <h1
              className="mb-4 text-5xl font-bold md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Private AI for Real Estate <span className="inline-block">Investment Management</span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-6 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Inspired by Aries, the Zodiac sign of courageous leadership, AriesView empowers real estate investors to make confident and informed real estate decisions
              </p>
              <div className="relative">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 inline-block w-full rounded-lg bg-[#001A41] px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:bg-[#0e2b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001A41] sm:mb-0 sm:w-auto"
                    href="/signup"
                  >
                    <span className="relative inline-flex items-center">
                      Start a Free Trial{" "}
                      <span className="ml-2 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                  <a
                    className="btn group inline-block w-full rounded-lg bg-[#001A41] px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:bg-[#0e2b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001A41] sm:ml-4 sm:w-auto"
                    href="/contact"
                  >
                    <span className="relative inline-flex items-center">
                      Contact Sales{" "}
                      <span className="ml-2 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
