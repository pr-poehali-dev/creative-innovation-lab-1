import { useState } from "react";
import Icon from "@/components/ui/icon";

type BMICategory = "deficit" | "normal" | "overweight" | "obese";

interface Recommendation {
  title: string;
  desc: string;
  products: { name: string; icon: string; color: string; why: string }[];
}

const QUIZ: Record<BMICategory, { question: string; options: { label: string; key: string }[] }> = {
  deficit: {
    question: "Чего ты хочешь достичь?",
    options: [
      { label: "Набрать мышечную массу", key: "muscle" },
      { label: "Набрать вес в целом (жировую и мышечную)", key: "bulk" },
      { label: "Просто стать здоровее", key: "health" },
    ],
  },
  normal: {
    question: "Какова твоя главная цель?",
    options: [
      { label: "Нарастить мышцы и рельеф", key: "muscle" },
      { label: "Повысить выносливость", key: "endurance" },
      { label: "Поддержать текущую форму", key: "maintain" },
    ],
  },
  overweight: {
    question: "Что для тебя важнее?",
    options: [
      { label: "Похудеть и сжечь жир", key: "cut" },
      { label: "Похудеть, но сохранить мышцы", key: "recomp" },
      { label: "Улучшить общее самочувствие", key: "health" },
    ],
  },
  obese: {
    question: "С чего хочешь начать?",
    options: [
      { label: "Активно сбросить вес", key: "cut" },
      { label: "Начать двигаться и войти в режим", key: "health" },
      { label: "Заменить вредную еду на полезную", key: "diet" },
    ],
  },
};

const RECOMMENDATIONS: Record<string, Recommendation> = {
  muscle: {
    title: "Курс на мышечную массу",
    desc: "Тебе нужен качественный белок и поддержка восстановления. Вот что поможет:",
    products: [
      { name: "Протеин (Whey)", icon: "Dumbbell", color: "green", why: "Строительный материал для мышц. 25–30 г после тренировки." },
      { name: "Креатин", icon: "Zap", color: "blue", why: "Увеличивает силу и объём мышц. 5 г в день." },
      { name: "BCAA", icon: "Activity", color: "purple", why: "Защищает мышцы от разрушения во время тренировок." },
    ],
  },
  bulk: {
    title: "Набор общей массы",
    desc: "При дефиците нужен калорийный профицит — гейнер поможет быстро добрать калории и белок:",
    products: [
      { name: "Гейнер", icon: "TrendingUp", color: "yellow", why: "Высококалорийный коктейль — белок + углеводы. Идеально для набора." },
      { name: "Протеин (Whey)", icon: "Dumbbell", color: "green", why: "Дополнительный белок на ночь или между приёмами пищи." },
      { name: "Омега-3", icon: "Heart", color: "red", why: "Поддерживает гормональный фон и суставы при росте массы." },
    ],
  },
  endurance: {
    title: "Рост выносливости",
    desc: "Для марафонов, велосипеда и кардио — тело должно восстанавливаться быстро:",
    products: [
      { name: "Изотоник", icon: "Droplets", color: "cyan", why: "Восполняет электролиты и энергию во время длительных нагрузок." },
      { name: "L-карнитин", icon: "Flame", color: "orange", why: "Помогает использовать жир как топливо для энергии." },
      { name: "Витаминный комплекс", icon: "Pill", color: "indigo", why: "При высоких нагрузках потребность в витаминах возрастает." },
    ],
  },
  maintain: {
    title: "Поддержание формы",
    desc: "У тебя хорошая база — задача не потерять. Минимальная, но эффективная поддержка:",
    products: [
      { name: "Протеин", icon: "Dumbbell", color: "green", why: "Помогает не терять мышцы при стрессе или нерегулярном питании." },
      { name: "Омега-3", icon: "Heart", color: "red", why: "Базовое здоровье сердца, суставов и иммунитета." },
      { name: "Мультивитамины", icon: "Pill", color: "indigo", why: "Закрывают дефициты при несбалансированном рационе." },
    ],
  },
  cut: {
    title: "Сжигание жира",
    desc: "Главное — создать дефицит калорий и сохранить мышечный тонус:",
    products: [
      { name: "Протеин (изолят)", icon: "Dumbbell", color: "green", why: "Много белка, минимум калорий — сохраняет мышцы при похудении." },
      { name: "L-карнитин", icon: "Flame", color: "orange", why: "Транспортирует жиры в клетки для сжигания в энергию." },
      { name: "Клетчатка / Псиллиум", icon: "Leaf", color: "teal", why: "Даёт ощущение сытости, улучшает пищеварение." },
    ],
  },
  recomp: {
    title: "Рекомпозиция тела",
    desc: "Сжигать жир и растить мышцы одновременно — амбициозно, но реально:",
    products: [
      { name: "Протеин (Whey / Casein)", icon: "Dumbbell", color: "green", why: "Whey — после тренировки, казеин — на ночь. Постоянный синтез белка." },
      { name: "Креатин", icon: "Zap", color: "blue", why: "Поддерживает силу даже в условиях дефицита калорий." },
      { name: "CLA", icon: "Target", color: "pink", why: "Помогает снижать жировую массу при сохранении мышц." },
    ],
  },
  health: {
    title: "Здоровье и самочувствие",
    desc: "Базовая забота о теле — основа любого прогресса:",
    products: [
      { name: "Омега-3", icon: "Heart", color: "red", why: "Сердце, суставы, мозг — омега-3 нужна всем." },
      { name: "Витамин D3 + K2", icon: "Sun", color: "yellow", why: "Большинство людей испытывают дефицит D3, особенно зимой." },
      { name: "Магний", icon: "Moon", color: "indigo", why: "Улучшает сон, снижает стресс, поддерживает нервную систему." },
    ],
  },
  diet: {
    title: "Замена вредных привычек",
    desc: "Начни с малого — замени вредные перекусы на полезные альтернативы:",
    products: [
      { name: "Протеиновые батончики", icon: "Cookie", color: "amber", why: "Вкусно и сыто — без сахара и вредных жиров." },
      { name: "Клетчатка", icon: "Leaf", color: "green", why: "Улучшает пищеварение и помогает контролировать аппетит." },
      { name: "Омега-3", icon: "Heart", color: "red", why: "Снижает воспаление и тягу к жирной пище." },
    ],
  },
};

const colorMap: Record<string, string> = {
  green: "bg-blue-400/10 text-blue-300 border-blue-400/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return "deficit";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

const categoryInfo: Record<BMICategory, { label: string; desc: string; color: string; bar: string }> = {
  deficit: { label: "Дефицит массы тела", desc: "ИМТ ниже 18.5", color: "text-blue-400", bar: "bg-blue-500" },
  normal: { label: "Норма", desc: "ИМТ 18.5 — 24.9", color: "text-blue-300", bar: "bg-blue-400" },
  overweight: { label: "Избыточный вес", desc: "ИМТ 25 — 29.9", color: "text-yellow-400", bar: "bg-yellow-500" },
  obese: { label: "Ожирение", desc: "ИМТ 30 и выше", color: "text-red-400", bar: "bg-red-500" },
};

function BMIBar({ bmi }: { bmi: number }) {
  const clamped = Math.min(Math.max(bmi, 10), 40);
  const pct = ((clamped - 10) / 30) * 100;
  return (
    <div className="relative mt-4">
      <div className="h-3 rounded-full overflow-hidden flex">
        <div className="flex-1 bg-blue-500/70" />
        <div className="flex-1 bg-blue-400/70" />
        <div className="flex-1 bg-yellow-500/70" />
        <div className="flex-1 bg-red-500/70" />
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-neutral-900 shadow-lg transition-all duration-700"
        style={{ left: `${pct}%` }}
      />
      <div className="flex justify-between text-neutral-500 text-xs mt-1">
        <span>10</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40+</span>
      </div>
    </div>
  );
}

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<BMICategory | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [step, setStep] = useState<"calc" | "result" | "quiz" | "rec">("calc");

  const calculate = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;
    const val = w / (h * h);
    setBmi(Math.round(val * 10) / 10);
    setCategory(getBMICategory(val));
    setQuizAnswer(null);
    setStep("result");
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory(null);
    setQuizAnswer(null);
    setStep("calc");
  };

  return (
    <section className="bg-neutral-950 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <h3 className="uppercase text-xs tracking-widest text-neutral-500 mb-2">Твой результат</h3>
        <p className="text-2xl lg:text-3xl font-bold text-white mb-10">Калькулятор ИМТ и подбор добавок</p>

        {/* Калькулятор */}
        {step === "calc" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <p className="text-neutral-400 mb-6 text-sm">Введи свои параметры — и мы подберём спортпит именно под твою цель.</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wider mb-2 block">Рост (см)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="175"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wider mb-2 block">Вес (кг)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={calculate}
              disabled={!height || !weight}
              className="w-full bg-blue-400 hover:bg-blue-300 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold py-4 rounded-xl transition-colors text-base"
            >
              Рассчитать ИМТ
            </button>
          </div>
        )}

        {/* Результат ИМТ */}
        {step === "result" && bmi && category && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm mb-1">Твой индекс массы тела</p>
                <p className={`text-5xl font-bold ${categoryInfo[category].color}`}>{bmi}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${categoryInfo[category].color}`}>{categoryInfo[category].label}</p>
                <p className="text-neutral-500 text-sm">{categoryInfo[category].desc}</p>
              </div>
            </div>
            <BMIBar bmi={bmi} />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep("quiz")} className="flex-1 bg-blue-400 hover:bg-blue-300 text-white font-bold py-3 rounded-xl transition-colors">
                Подобрать добавки →
              </button>
              <button onClick={reset} className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors">
                <Icon name="RotateCcw" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Мини-тест */}
        {step === "quiz" && category && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                category === "deficit" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                category === "normal" ? "bg-blue-400/10 text-blue-300 border-blue-400/20" :
                category === "overweight" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                ИМТ {bmi} · {categoryInfo[category].label}
              </span>
            </div>
            <p className="text-white font-bold text-xl mb-6">{QUIZ[category].question}</p>
            <div className="space-y-3">
              {QUIZ[category].options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setQuizAnswer(opt.key); setStep("rec"); }}
                  className="w-full text-left px-5 py-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-blue-400/50 text-white rounded-xl transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <Icon name="ChevronRight" size={16} className="text-neutral-500 group-hover:text-blue-300 transition-colors" />
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep("result")} className="mt-4 text-neutral-500 hover:text-white text-sm transition-colors flex items-center gap-1">
              <Icon name="ArrowLeft" size={14} /> Назад
            </button>
          </div>
        )}

        {/* Рекомендации */}
        {step === "rec" && quizAnswer && category && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <p className="text-neutral-400 text-sm mb-1">Наша рекомендация</p>
              <p className="text-white font-bold text-2xl mb-2">{RECOMMENDATIONS[quizAnswer].title}</p>
              <p className="text-neutral-400 text-sm">{RECOMMENDATIONS[quizAnswer].desc}</p>
            </div>

            <div className="grid gap-4">
              {RECOMMENDATIONS[quizAnswer].products.map((p, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colorMap[p.color]}`}>
                    <Icon name={p.icon} size={22} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg mb-1">{p.name}</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">{p.why}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 bg-blue-400 hover:bg-blue-300 text-white font-bold py-4 rounded-xl transition-colors">
                Рассчитать снова
              </button>
              <button onClick={() => setStep("quiz")} className="px-5 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors">
                <Icon name="ArrowLeft" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}