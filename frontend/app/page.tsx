import CategorySection from "./components/CategorySection";
import CtaSection from "./components/CtaSection";
import FeaturedJobsSection from "./components/FeaturedJobsSection";
import Footer from "./components/Footer";
import GoogleOneTap from "./components/GoogleOneTap";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";

export default function page() {
  return (
    <>
      <GoogleOneTap />
      <Header />
      <HeroSection />
      <CategorySection />
      <CtaSection />
      <FeaturedJobsSection />
      <Footer />
    </>
  );
}
