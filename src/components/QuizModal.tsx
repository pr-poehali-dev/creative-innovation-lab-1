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

const recommendations: Record<string, { name: string; desc: string; color: string }[]> = {
  mass: [
    { name: "Гейнер", desc: "Обеспечит необходимый калорийный профицит для набора массы", color: "bg-orange-500" },
    { name: "Протеин", desc: "Поддержит рост мышц после каждой тренировки", color: "bg-blue-500" },
    { name: "Креатин", desc: "Увеличит силу и позволит прогрессировать быстрее", color: "bg-purple-500" },
  ],
  fat: [
    { name: "L-Карнитин", desc: "Запустит процесс жиросжигания при кардио-нагрузках", color: "bg-green-500" },
    { name: "Протеин", desc: "Сохранит мышцы при дефиците калорий", color: "bg-blue-500" },
    { name: "BCAA", desc: "Защитит мышцы от разрушения во время сушки", color: "bg-pink-500" },
  ],
  strength: [
    { name: "Креатин", desc: "Ключевой инструмент для роста силовых показателей", color: "bg-purple-500" },
    { name: "Протеин", desc: "Обеспечит восстановление и рост силы", color: "bg-blue-500" },
    { name: "Предтреники", desc: "Дадут концентрацию и мощь на тяжёлых тренировках", color: "bg-red-500" },
  ],
  endurance: [
    { name: "BCAA", desc: "Обеспечат энергию и замедлят усталость при длительных нагрузках", color: "bg-pink-500" },
    { name: "L-Карнитин", desc: "Улучшит использование жира как источника энергии", color: "bg-green-500" },
    { name: "Предтреники", desc: "Поднимут выносливость и отсрочат наступление усталости", color: "bg-red-500" },
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-lg relative overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors z-10"
            >
              <Icon name="X" size={20} />
            </button>

            {!done ? (
              <div className="p-8">
                <div className="flex gap-1 mb-8">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 transition-all duration-300 ${i <= step ? "bg-green-500" : "bg-neutral-200"}`}
                    />
                  ))}
                </div>
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
                  Вопрос {step + 1} из {questions.length}
                </p>
                <h2 className="text-2xl font-bold text-neutral-900 mb-8">
                  {questions[step].text}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className="flex items-center gap-4 border border-neutral-200 p-4 text-left hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-neutral-100 group-hover:bg-green-500 transition-colors duration-200 flex items-center justify-center flex-shrink-0">
                        <Icon name={opt.icon as "Home"} size={18} className="text-neutral-600 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <span className="font-medium text-neutral-800">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 flex items-center justify-center">
                    <Icon name="CheckCheck" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400">Результат</p>
                    <h2 className="text-xl font-bold text-neutral-900">Твои добавки подобраны!</h2>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mb-8">
                  {result.map((r) => (
                    <div key={r.name} className="flex items-start gap-4 border border-neutral-100 p-4">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${r.color}`} />
                      <div>
                        <p className="font-bold text-neutral-900">{r.name}</p>
                        <p className="text-sm text-neutral-500">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 border border-neutral-200 text-neutral-700 uppercase tracking-widest text-xs py-3 hover:bg-neutral-50 transition-colors"
                  >
                    Пройти снова
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-green-500 text-white uppercase tracking-widest text-xs py-3 hover:bg-green-400 transition-colors font-semibold"
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
