import Image from "next/image";

export default function CtaSection() {
  return (
    <section className="py-16 relative  overflow-hidden">
      <div className="w-[203px] h-[331px] bg-[#f8f8fd] absolute p-4 top-[-140px] left-[50px] z-20 rotate-50" />

      <div className="mx-[122px] bg-[#4640de] px-[70px] pt-[50px] pb-[30px] flex items-center justify-between">
        <div className="space-y-5 text-white">
          <h3 className="text-[48px] font-bold leading-[50px]">
            Start applying for <br /> jobs today
          </h3>

          <p className="text-[16px] font-medium">
            In a simple ai-powered dashboard
          </p>

          <button className="px-[24px] py-[12px] bg-white text-[#4640de] font-bold transition-all hover:bg-[#d6d5fd]">
            Sign Up For Free
          </button>
        </div>

        <div className="relative">
          <Image
            src="/images/screenshots/dashboard.png"
            alt="Dashboard Screenshot"
            className="relative bottom-[-40px]"
            width={600}
            height={600}
          />
        </div>
      </div>

      <div className="w-[203px] h-[331px] bg-[#f8f8fd] absolute p-4 bottom-[-140px] right-[50px] z-20 rotate-50" />
    </section>
  );
}
