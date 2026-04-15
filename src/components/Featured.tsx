const supplements = [
  {
    name: "Протеин",
    tag: "Для роста мышц",
    desc: "Строительный материал для мышц. Принимается после тренировки для восстановления и роста мышечной ткани. Подходит всем, кто занимается силовыми тренировками.",
    color: "bg-blue-500",
  },
  {
    name: "Гейнер",
    tag: "Набор массы",
    desc: "Высококалорийная смесь белков и углеводов. Идеален для эктоморфов и тех, кому сложно набрать вес. Помогает получить необходимый калорийный профицит.",
    color: "bg-orange-500",
  },
  {
    name: "Креатин",
    tag: "Сила и взрывная мощь",
    desc: "Увеличивает силовые показатели и выносливость при интенсивных нагрузках. Один из наиболее изученных и эффективных спортивных суплементов.",
    color: "bg-purple-500",
  },
  {
    name: "BCAA",
    tag: "Восстановление",
    desc: "Незаменимые аминокислоты для защиты мышц от разрушения. Снижают крепатуру и ускоряют восстановление между тренировками.",
    color: "bg-pink-500",
  },
  {
    name: "Предтреники",
    tag: "Энергия и фокус",
    desc: "Комплекс активных компонентов для максимальной концентрации и энергии на тренировке. Идеальны для утренних или вечерних сессий.",
    color: "bg-red-500",
  },
  {
    name: "L-Карнитин",
    tag: "Жиросжигание",
    desc: "Транспортирует жирные кислоты в митохондрии, где они сжигаются как топливо. Лучше всего работает в сочетании с кардио-нагрузками.",
    color: "bg-blue-400",
  },
];

export default function Featured() {
  return (
    <div id="supplements" className="bg-white px-6 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h3 className="uppercase mb-4 text-sm tracking-widest text-neutral-500">Классы добавок</h3>
            <p className="text-3xl lg:text-5xl font-bold text-neutral-900 leading-tight max-w-xl">
              Всё, что нужно знать о спортивном питании
            </p>
          </div>
          <p className="text-neutral-500 max-w-sm text-sm leading-relaxed">
            Каждая добавка решает конкретную задачу. Выбери свою цель — и мы покажем, что тебе нужно.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplements.map((s) => (
            <div
              key={s.name}
              className="border border-neutral-200 p-8 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className={`w-10 h-1 ${s.color} mb-6 group-hover:w-16 transition-all duration-300`} />
              <span className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">{s.tag}</span>
              <h4 className="text-2xl font-bold text-neutral-900 mb-4">{s.name}</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}