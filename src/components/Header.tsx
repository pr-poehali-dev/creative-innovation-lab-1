interface HeaderProps {
  className?: string;
  onQuizOpen?: () => void;
  onBMIOpen?: () => void;
}

export default function Header({ className, onQuizOpen, onBMIOpen }: HeaderProps) {
  return (
    <header className={`absolute top-0 left-0 right-0 z-10 p-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <div className="text-white text-sm uppercase tracking-widest font-bold">SPORT<span className="text-green-400">FUEL</span></div>
        <nav className="flex gap-3 items-center">
          <a
            href="#supplements"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm mr-5"
          >
            Добавки
          </a>
          <button
            onClick={onQuizOpen}
            className="bg-green-500 text-black hover:bg-green-400 transition-colors duration-300 uppercase text-sm px-4 py-2 font-bold rounded-xl"
          >
            Быстрый подбор
          </button>
          <button
            onClick={onBMIOpen}
            className="bg-green-500 text-black hover:bg-green-400 transition-colors duration-300 uppercase text-sm px-4 py-2 font-bold rounded-xl"
          >
            Детальный подбор
          </button>
        </nav>
      </div>
    </header>
  );
}
