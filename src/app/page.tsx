import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Professors from "@/components/Professors";
import Facilities from "@/components/Facilities";
import TopStudents from "@/components/TopStudents";
import AnnouncementSection from "@/components/AnnouncementSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Professors />
        <Facilities />
        <TopStudents />
        <AnnouncementSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
