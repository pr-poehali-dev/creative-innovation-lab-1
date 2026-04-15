interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={`absolute top-0 left-0 right-0 z-10 p-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <div className="text-white text-sm uppercase tracking-widest font-bold">SPORT<span className="text-blue-300">FUEL</span></div>
        <nav className="flex gap-8 items-center">
          <a
            href="#supplements"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
          >
            Добавки
          </a>
        </nav>
      </div>
    </header>
  );
}