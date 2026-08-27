import Hero from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";
import Gallery from "../components/Gallery";
import AboutSection from "../components/AboutSection";
import BookingCTA from "../components/BookingCTA";

export default function Home() {
  return (
    <>
      <Hero />

      <ServicesPreview />

      <Gallery />

      <AboutSection />

      <BookingCTA />
    </>
  );
}