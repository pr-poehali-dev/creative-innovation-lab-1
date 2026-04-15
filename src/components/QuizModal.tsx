import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: "goal",
    text: "Какова твоя основная цель?",
    options: [
      { value: "mass", label: "Набрать мышечную массу", icon: "Dumbbell" },
      { value: "fat", label: "Сжечь жир", icon: "Flame" },
      { value: "strength", label: "Увеличить силу", icon: "Zap" },
      { value: "endurance", label: "Улучшить выносливость", icon: "Wind" },
    ],
  },
  {
    id: "level",
    text: "Как давно ты тренируешься?",
    options: [
      { value: "beginner", label: "Менее 6 месяцев", icon: "Sprout" },
      { value: "middle", label: "От 6 месяцев до 2 лет", icon: "TrendingUp" },
      { value: "advanced", label: "Более 2 лет", icon: "Trophy" },
    ],
  },
  {
    id: "intensity",
    text: "Сколько раз в неделю ты тренируешься?",
    options: [
      { value: "low", label: "1–2 раза", icon: "Calendar" },
      { value: "medium", label: "3–4 раза", icon: "CalendarCheck" },
      { value: "high", label: "5+ раз", icon: "Activity" },
    ],
  },
];

const recommendations: Record<string, { name: string; desc: string; color: string; icon: string }[]> = {
  mass: [
    { name: "Гейнер", desc: "Обеспечит необходимый калорийный профицит для набора массы", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: "TrendingUp" },
    { name: "Протеин", desc: "Поддержит рост мышц после каждой тренировки", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "Dumbbell" },
    { name: "Креатин", desc: "Увеличит силу и позволит прогрессировать быстрее", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: "Zap" },
  ],
  fat: [
    { name: "L-Карнитин", desc: "Запустит процесс жиросжигания при кардио-нагрузках", color: "bg-blue-400/10 text-blue-300 border-blue-400/20", icon: "Flame" },
    { name: "Протеин", desc: "Сохранит мышцы при дефиците калорий", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "Dumbbell" },
    { name: "BCAA", desc: "Защитит мышцы от разрушения во время сушки", color: "bg-pink-500/10 text-pink-400 border-pink-500/20", icon: "Activity" },
  ],
  strength: [
    { name: "Креатин", desc: "Ключевой инструмент для роста силовых показателей", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: "Zap" },
    { name: "Протеин", desc: "Обеспечит восстановление и рост силы", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "Dumbbell" },
    { name: "Предтреники", desc: "Дадут концентрацию и мощь на тяжёлых тренировках", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: "Target" },
  ],
  endurance: [
    { name: "BCAA", desc: "Обеспечат энергию и замедлят усталость при длительных нагрузках", color: "bg-pink-500/10 text-pink-400 border-pink-500/20", icon: "Activity" },
    { name: "L-Карнитин", desc: "Улучшит использование жира как источника энергии", color: "bg-blue-400/10 text-blue-300 border-blue-400/20", icon: "Flame" },
    { name: "Предтреники", desc: "Поднимут выносливость и отсрочат наступление усталости", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: "Wind" },
  ],
};

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  const result = recommendations[answers.goal] ?? recommendations.mass;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg relative overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors z-10"
            >
              <Icon name="X" size={20} />
            </button>

            {!done ? (
              <div className="p-8">
                {/* Прогресс */}
                <div className="flex gap-2 mb-8">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-blue-400" : "bg-neutral-700"}`}
                    />
                  ))}
                </div>

                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                  Вопрос {step + 1} из {questions.length}
                </p>
                <h2 className="text-xl font-bold text-white mb-6">
                  {questions[step].text}
                </h2>

                <div className="flex flex-col gap-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className="flex items-center gap-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-blue-400/50 p-4 rounded-xl text-left transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-neutral-700 group-hover:bg-blue-400/20 border border-neutral-600 group-hover:border-blue-400/40 flex items-center justify-center flex-shrink-0 transition-all">
                        <Icon name={opt.icon as "Home"} size={18} className="text-neutral-400 group-hover:text-blue-300 transition-colors" />
                      </div>
                      <span className="font-medium text-white text-sm">{opt.label}</span>
                      <Icon name="ChevronRight" size={16} className="text-neutral-600 group-hover:text-blue-300 transition-colors ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                    <Icon name="CheckCheck" size={20} className="text-blue-300" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-500">Результат</p>
                    <h2 className="text-xl font-bold text-white">Твои добавки подобраны!</h2>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-8">
                  {result.map((r) => (
                    <div key={r.name} className="flex items-start gap-4 bg-neutral-800 border border-neutral-700 rounded-xl p-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${r.color}`}>
                        <Icon name={r.icon as "Home"} size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{r.name}</p>
                        <p className="text-sm text-neutral-400 mt-0.5">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white py-3 rounded-xl transition-colors text-sm font-medium"
                  >
                    Пройти снова
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-blue-400 hover:bg-blue-300 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Отлично!
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}