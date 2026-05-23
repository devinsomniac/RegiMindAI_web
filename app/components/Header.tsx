import Image from "next/image";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e6e4df] bg-[#faf9f6]/90 backdrop-blur-md">
      <div className="flex h-18 w-full items-center justify-between gap-2 px-3 sm:px-6 sm:p-8 p-8">
        {/* LEFT: logo + name */}
        <a href="/" className="min-w-0">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/regimind_logo.png"
            alt="RegiMind AI"
            width={100}
            height={100}
            className="h-12 w-12 shrink-0 object-contain sm:h-20 sm:w-20"
            priority
          />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-serif text-base font-semibold tracking-tight text-[#22211f] sm:text-lg">
              RegiMind <span className="text-[#d3374a]">AI</span>
            </span>
            <span className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-[#3a3936]/60 sm:text-[10px]">
              V0.1 . Cardiff University policy assistant
            </span>
          </div>
        </div>
        </a>

        {/* RIGHT: status pill */}
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#e6e4df] bg-white px-2.5 py-1.5 sm:px-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d3374a] opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d3374a]" />
          </span>
          <span className="hidden text-xs font-medium text-[#3a3936] sm:inline">
            Grounded in Cardiff policy
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;