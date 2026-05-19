import { researchHero } from "../assets/images";

/** md+ hero overlay: left band uses this alpha (0–1). Right uses gradient at full `HERO_COLOR_OVERLAY_RIGHT` alpha. Mobile uses solid `bg-primary` instead. */
const HERO_COLOR_OVERLAY_LEFT = 0.8;
const HERO_COLOR_OVERLAY_RIGHT = 1;

export default function LandingPage() {
  return (
    <main className="">
      <section
        id="home"
        className="relative flex min-h-[calc(100svh-2.75rem)] flex-col justify-center overflow-hidden scroll-mt-20 px-6 pt-12 pb-10 sm:px-10 sm:pt-14 md:min-h-[calc(100dvh-2.75rem)] md:px-14 md:pt-14 md:pb-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 -scale-x-100 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Background.webp')",
          }}
        />
        {/* Mobile: single solid tint (full opacity). md+: gradient configuration */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-primary md:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
          style={{
            background: `linear-gradient(90deg,
              rgb(30 27 128 / ${HERO_COLOR_OVERLAY_LEFT}) 0%,
              rgb(30 27 128 / ${HERO_COLOR_OVERLAY_LEFT}) 42%,
              rgb(30 27 128 / ${HERO_COLOR_OVERLAY_RIGHT}) 50%,
              rgb(24 21 104 / ${HERO_COLOR_OVERLAY_RIGHT}) 70%,
              rgb(14 12 58 / ${HERO_COLOR_OVERLAY_RIGHT}) 100%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1.5 bg-[#EAB126] sm:h-2"
        />
        <div className="relative z-10 w-full">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-x-8 gap-y-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:max-w-7xl lg:gap-x-12">
            <div className="order-2 flex min-w-0 flex-col justify-center md:order-1">
              <h2 className="font-poppins pb-3 text-center text-4xl font-bold uppercase text-white md:text-left">
                Empowering Faculty, Enriching Lives: Research Excellence at Leyte
                Normal University
              </h2>
              <p className="mx-auto max-w-xl font-open-sans text-lg text-justify text-white md:mx-0 md:max-w-none">
                Leyte Normal University (LNU) fosters a vibrant research culture,
                where our esteemed faculty members are actively engaged in creating
                and sharing knowledge that addresses real-world challenges. We
                believe that faculty involvement in research is not only crucial
                for their own professional development but also vital for enriching
                the learning experience of our students and contributing to the
                advancement of society.
              </p>
            </div>
            <div className="order-1 flex min-w-0 justify-center md:order-2 md:justify-center">
              <img
                src={researchHero}
                alt="Hero"
                className="h-auto w-full max-w-md rounded-2xl object-contain md:rounded-3xl lg:max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section
        id="vision-mission"
        className="scroll-mt-20 px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-12"
        aria-labelledby="vision-mission-heading"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 flex flex-col items-center md:mb-12">
            <img
              src="/images/LNU%20LOGO.png"
              alt="Leyte Normal University official seal"
              className="h-auto w-48 object-contain drop-shadow-md sm:w-60 md:w-72 lg:w-80"
              width={320}
              height={320}
              decoding="async"
            />
            <h2
              id="vision-mission-heading"
              className="-mt-4 text-center text-3xl font-bold tracking-tight text-[#070367] md:-mt-7 md:text-4xl"
            >
              Vision and Mission
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
            <article className="flex h-full flex-col rounded-[2.5rem] bg-gradient-to-br from-[#002D72] to-[#0099CC] p-6 shadow-custom sm:p-8">
              <h3 className="mb-4 text-2xl font-bold text-white md:mb-5 md:text-3xl">
                Vision
              </h3>
              <blockquote className="mt-auto border-l-4 border-white/80 pl-5 text-base leading-relaxed text-justify text-white md:text-lg">
                “A globally recognized university of education, management, arts
                and sciences geared towards the inclusive growth and
                sustainability of society.”
              </blockquote>
            </article>
            <article className="flex h-full flex-col rounded-[2.5rem] bg-gradient-to-br from-[#002D72] to-[#0099CC] p-6 shadow-custom sm:p-8">
              <h3 className="mb-4 text-2xl font-bold text-white md:mb-5 md:text-3xl">
                Mission
              </h3>
              <blockquote className="mt-auto border-l-4 border-white/80 pl-5 text-base leading-relaxed text-justify text-white md:text-lg">
                “To produce globally recognized human capital along teacher
                education, management, arts and sciences responsive to the
                development needs of the society.”
              </blockquote>
            </article>
          </div>
        </div>
      </section>

      {/* About: title banner + content */}
      <section
        id="about"
        className="scroll-mt-0"
        aria-labelledby="about-heading"
      >
        <div className="relative flex min-h-[11rem] w-full items-center justify-start overflow-hidden px-6 py-12 sm:px-10 md:min-h-[13rem] md:py-16 md:px-14">
          <div
            aria-hidden
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/Background.webp')",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a1931]/80 via-[#0a1931]/88 to-[#060d1a]/90"
          />
          <div className="relative z-10 flex w-full max-w-6xl flex-col items-start text-left">
            <h2
              id="about-heading"
              className="font-poppins text-3xl font-semibold tracking-tight text-white md:text-4xl"
            >
              About ORI
            </h2>
            <span
              className="mt-4 block h-0.5 w-16 rounded-full bg-[#EAB126] md:mt-5 md:w-20"
              aria-hidden
            />
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center px-6 pt-8 pb-10 sm:px-10 md:items-center md:px-14 md:pt-10">
          <div className="w-full rounded-3xl bg-gray-50 p-4 text-lg shadow-custom md:w-auto">
            <p className="text-justify">
              <span className="font-bold">
                The Office of Research and Innovation
              </span>{" "}
              is under the umbrella of the Office of Research, Innovation, and
              Extension, whose function is to uphold the status of excellence in
              research and development. Consistent with the University&apos;s Vision
              and Mission, and cognizant of UNESCO&apos;s thrust for Education for
              Sustainable Development and Lifelong Learning, the research endeavor
              of the university aims for the integration of knowledge and praxis
              of sustainable development in education, arts and sciences, and
              management and entrepreneurship.
            </p>
            <p className="mb-5 mt-4 text-justify">
              All research endeavors move towards addressing socio-political,
              economic, cultural, and environmental issues of the 21st century. In
              addition, the office aims to establish a research culture whereby
              faculty, staff, and students undertake quality research.
              Specifically, the office is mandated:
            </p>
            <ol className="list-decimal list-outside space-y-2 rounded-lg pl-5 text-justify">
              <li className="pl-2">
                To provide a venue for faculty, students, and researchers for
                convergence.
              </li>
              <li className="pl-2">
                To act as a research coordinating center for various programs,
                projects, and activities for the university and community.
              </li>
              <li className="pl-2">
                To network, partner, and collaborate with other similar-minded
                organizations.
              </li>
              <li className="pl-2">
                To initiate creative and empowering activities that will increase
                capability, participation, and deepen awareness in research among
                faculty, students, and the community as the basis for instructing,
                forming, nurturing, and coaching young people for sustainable
                development.
              </li>
              <li className="pl-2">
                To raise the level of appreciation and understanding of the
                faculty, students, and stakeholders on issues, problems, and
                initiatives confronting their communities.
              </li>
              <li className="pl-2">
                To harness the participation and involvement of young people in
                research and community development initiatives by providing them
                venues for actual exposure to research situations.
              </li>
              <li className="pl-2">
                To build a sense of responsibility, vigilance, stewardship, and
                intellectual integrity to research.
              </li>
              <li className="pl-2">
                To link critical development issues important to target
                communities with the university&apos;s research, instruction, personal
                expertise, and external sources.
              </li>
              <li className="pl-2">
                To conduct regular monitoring and assessment of the activities
                implemented per school year.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-center text-sm leading-snug text-gray-700 sm:px-10 sm:py-4 sm:text-base md:px-14">
        <p>
          ORI v1.0 - Copyright © 2026 Leyte Normal University. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
