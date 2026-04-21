import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Building2, Users, Globe, Award } from "lucide-react";

export default function CompaniesPage() {
  const stats = [
    { icon: <Building2 className="w-8 h-8" />, value: "500+", label: "Partner Companies" },
    { icon: <Users className="w-8 h-8" />, value: "10,000+", label: "Candidates Placed" },
    { icon: <Globe className="w-8 h-8" />, value: "15", label: "Countries Served" },
    { icon: <Award className="w-8 h-8" />, value: "98%", label: "Client Satisfaction" },
  ];

  const partners = [
    "TechCorp Africa", "StartupHub Rwanda", "InnovateLab", "Digital Ventures",
    "CloudFirst Solutions", "DataDriven Co.", "NextGen Systems", "SmartHire Ltd"
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-[100px]">
        {/* Hero */}
        <section className="bg-[#f8f8fd] py-20">
          <div className="mx-[122px]">
            <h1 className="text-5xl font-bold text-[#25324B] mb-6">
              Trusted by Leading <span className="text-[#286ef0]">Companies</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Copilot by Umurava partners with innovative companies across Africa 
              to streamline their hiring process and connect them with top talent.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="mx-[122px]">
            <div className="grid grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 border border-gray-100 rounded-lg">
                  <div className="text-[#286ef0] mb-4 flex justify-center">{stat.icon}</div>
                  <p className="text-3xl font-bold text-[#25324B] mb-2">{stat.value}</p>
                  <p className="text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-[#f8f8fd]">
          <div className="mx-[122px]">
            <h2 className="text-3xl font-bold text-[#25324B] mb-10 text-center">
              Our Partners
            </h2>
            <div className="grid grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="font-semibold text-[#25324B]">{partner}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-[122px] text-center">
            <h2 className="text-3xl font-bold text-[#25324B] mb-4">
              Join Our Network
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Partner with us to access pre-screened talent and streamline your hiring process.
            </p>
            <a
              href="/admin/auth/login"
              className="inline-block bg-[#286ef0] hover:bg-[#2566de] text-white px-8 py-4 font-semibold"
            >
              Get Started
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
