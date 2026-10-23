import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { Brands } from "@/components/sections/Brands";
import { LensBand } from "@/components/sections/LensBand";
import { Services } from "@/components/sections/Services";
import { Booking } from "@/components/sections/Booking";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <About />
      <Gallery />
      <Services />
      <LensBand />
      <Booking />
      <Visit />
    </>
  );
}
