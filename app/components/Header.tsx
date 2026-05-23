import Image from "next/image";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e6e4df] bg-[#faf9f6]/90 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-6 p-8">
        {/* LEFT: logo + name */}
        <div className="flex items-center gap-3">
          <Image
            src="/regimind_logo.png"
            alt="RegiMind AI"
            width={100}
            height={100}
            className="h-20 w-20 object-contain"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold tracking-tight text-[#22211f]">
              RegiMind <span className="text-[#d3374a]">AI</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#3a3936]/60">
              V0.1 . Cardiff University policy assistant
            </span>
          </div>
        </div>

        {/* RIGHT: status pill */}
        <div className="flex items-center gap-2 rounded-full border border-[#e6e4df] bg-white px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d3374a] opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d3374a]" />
          </span>
          <span className="text-xs font-medium text-[#3a3936]">
            Grounded in Cardiff policy
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;