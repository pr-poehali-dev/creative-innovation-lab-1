import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

interface HeroProps {
  onQuizOpen?: () => void;
  onBMIOpen?: () => void;
}

export default function Hero({ onQuizOpen, onBMIOpen }: HeroProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://cdn.poehali.dev/projects/6225ff66-cd65-4fb5-b5e6-cdac321acb3b/files/c1075f8a-30f3-47a6-8274-5b83f42ea802.jpg"
          alt="Спортсмен на вершине"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <div className="relative z-10 text-center text-white px-6">
        <p className="uppercase tracking-widest text-green-400 text-sm mb-4 font-semibold">Спортивное питание</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
          ДОСТИГАЙ<br/>МАКСИМУМА
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-10">
          Правильные добавки для твоих целей — сила, масса, выносливость или восстановление
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onQuizOpen}
            className="bg-green-500 hover:bg-green-400 text-black uppercase tracking-widest text-sm px-8 py-4 font-bold transition-all duration-300 hover:scale-105 rounded-xl"
          >
            Быстрый подбор
          </button>
          <button
            onClick={onBMIOpen}
            className="bg-green-500 hover:bg-green-400 text-black uppercase tracking-widest text-sm px-8 py-4 font-bold transition-all duration-300 hover:scale-105 rounded-xl"
          >
            Детальный подбор
          </button>
        </div>
      </div>
    </div>
  );
}