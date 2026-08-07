import { useState, useRef } from "react";
import {
  PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle, ArrowLeft, BarChart2, CalendarDays, Car, Check,
  ChevronDown, ChevronRight, CreditCard, Home, MessageCircle,
  Monitor, Music, Phone, Plus, Settings, ShoppingBag,
  TrendingUp, TrendingDown, User, Users, UtensilsCrossed,
  Wallet, DollarSign, Zap, X, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "home" | "borrower" | "settings" | "add-expense" | "projection" | "debtors";

// ─── Static data ──────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "Jan", salary: 5800, expenses: 3200 },
  { month: "Fev", salary: 5800, expenses: 4100 },
  { month: "Mar", salary: 6200, expenses: 2900 },
  { month: "Abr", salary: 5800, expenses: 3800 },
  { month: "Mai", salary: 6500, expenses: 4500 },
  { month: "Jun", salary: 5800, expenses: 3600 },
];

const pieData = [
  { name: "Economizado", value: 2200, color: "#4ade80" },
  { name: "Alimentação", value: 980,  color: "#a855f7" },
  { name: "Transporte",  value: 420,  color: "#60a5fa" },
  { name: "Compras",     value: 650,  color: "#f472b6" },
  { name: "Assinaturas", value: 310,  color: "#fb923c" },
  { name: "Outros",      value: 240,  color: "#7b7a9e" },
];

const CATEGORIES = [
  { id: "food",          label: "Alimentação", icon: UtensilsCrossed, color: "#a855f7" },
  { id: "transport",     label: "Transporte",  icon: Car,             color: "#60a5fa" },
  { id: "shopping",      label: "Compras",     icon: ShoppingBag,     color: "#f472b6" },
  { id: "tech",          label: "Tecnologia",  icon: Monitor,         color: "#22d3ee" },
  { id: "subscriptions", label: "Assinaturas", icon: Music,           color: "#fb923c" },
  { id: "utilities",     label: "Contas",      icon: Zap,             color: "#facc15" },
];

const topExpenses = [
  { name: "Airbnb – Florianópolis", amount: 890, card: "Nubank",   cardColor: "#a855f7", category: "shopping"       },
  { name: "iFood (Jun)",            amount: 342, card: "Inter",    cardColor: "#f97316", category: "food"           },
  { name: "Mercado Livre",          amount: 298, card: "Nubank",   cardColor: "#a855f7", category: "shopping"       },
  { name: "Spotify + Netflix",      amount: 87,  card: "Bradesco", cardColor: "#ef4444", category: "subscriptions"  },
  { name: "Shell – Gasolina",       amount: 210, card: "XP Visa",  cardColor: "#3b82f6", category: "transport"      },
];

const borrowers = [
  { name: "Camila",  owed: 320, initials: "CA", color: "#a855f7", closingDaysLeft: 2  },
  { name: "Rafael",  owed: 145, initials: "RF", color: "#4ade80", closingDaysLeft: 9  },
  { name: "João P.", owed: 80,  initials: "JP", color: "#60a5fa", closingDaysLeft: 15 },
  { name: "Letícia", owed: 210, initials: "LE", color: "#f472b6", closingDaysLeft: 3  },
  { name: "Marcos",  owed: 55,  initials: "MK", color: "#fb923c", closingDaysLeft: 20 },
];

const camilaDebts = [
  {
    card: "Nubank", cardColor: "#a855f7", total: 215,
    items: [
      { name: "Restaurante Rodeio",   category: "food",     total: 150, paid: 2, installments: 5, perInstallment: 30 },
      { name: "Bar do Zé – Split",    category: "food",     total: 65,  paid: 1, installments: 1, perInstallment: 65 },
    ],
  },
  {
    card: "Inter", cardColor: "#f97316", total: 105,
    items: [
      { name: "iFood compartilhado",  category: "food",     total: 45,  paid: 1, installments: 1, perInstallment: 45 },
      { name: "Mercado – Churrasco",  category: "shopping", total: 60,  paid: 1, installments: 3, perInstallment: 20 },
    ],
  },
];

const creditCards = [
  { name: "Nubank",  last4: "4821", limit: 12000, used: 3840, color: "#a855f7", gradient: "from-purple-900 to-purple-600" },
  { name: "Inter",   last4: "9034", limit: 8000,  used: 1920, color: "#f97316", gradient: "from-orange-900 to-orange-600" },
  { name: "XP Visa", last4: "2277", limit: 15000, used: 6200, color: "#3b82f6", gradient: "from-blue-900 to-blue-600"     },
];

const fixedExpenses = [
  { name: "Aluguel",         amount: 1800, active: true  },
  { name: "Internet Vivo",   amount: 120,  active: true  },
  { name: "Plano de Saúde",  amount: 380,  active: true  },
  { name: "Academia Smart Fit", amount: 99, active: false },
];

const friends = [
  { name: "Camila",  initials: "CA", color: "#a855f7" },
  { name: "Rafael",  initials: "RF", color: "#4ade80" },
  { name: "João P.", initials: "JP", color: "#60a5fa" },
  { name: "Letícia", initials: "LE", color: "#f472b6" },
  { name: "Marcos",  initials: "MK", color: "#fb923c" },
];

// Future installments data — indexed by monthOffset from Aug 2025
const futureInstallments = [
  { title: "MacBook Pro M3",       card: "Nubank",   cardColor: "#a855f7", category: "tech",          amount: 650, paid: 1, total: 12, owner: null                                          },
  { title: "Airbnb – Búzios",      card: "XP Visa",  cardColor: "#3b82f6", category: "shopping",      amount: 320, paid: 2, total: 6,  owner: { initials: "CA", color: "#a855f7", name: "Camila"  } },
  { title: "PS5 – Sony",           card: "Inter",    cardColor: "#f97316", category: "tech",          amount: 280, paid: 3, total: 10, owner: { initials: "RF", color: "#4ade80", name: "Rafael"  } },
  { title: "Jantar Outback",       card: "Nubank",   cardColor: "#a855f7", category: "food",          amount: 95,  paid: 1, total: 3,  owner: { initials: "LE", color: "#f472b6", name: "Letícia" } },
  { title: "Plano Academia",       card: "Inter",    cardColor: "#f97316", category: "subscriptions", amount: 99,  paid: 5, total: 12, owner: null                                          },
  { title: "Apple One",            card: "Nubank",   cardColor: "#a855f7", category: "subscriptions", amount: 49,  paid: 2, total: 12, owner: null                                          },
  { title: "Churrasco Condomínio", card: "XP Visa",  cardColor: "#3b82f6", category: "food",          amount: 130, paid: 1, total: 4,  owner: { initials: "JP", color: "#60a5fa", name: "João P." } },
  { title: "Headset Sony WH",      card: "Inter",    cardColor: "#f97316", category: "tech",          amount: 180, paid: 4, total: 8,  owner: { initials: "MK", color: "#fb923c", name: "Marcos"  } },
];

// Debtors list data
const debtorsList = [
  {
    name: "Camila Andrade",    initials: "CA", color: "#a855f7",
    phone: "+55 11 98765-4321", totalOwed: 320, activeDebts: 3,
    status: "pending" as const, lastActivity: "Jun 15",
  },
  {
    name: "Rafael Souza",      initials: "RF", color: "#4ade80",
    phone: "+55 21 99123-4567", totalOwed: 145, activeDebts: 2,
    status: "uptodate" as const, lastActivity: "Jun 10",
  },
  {
    name: "João Pedro Lima",   initials: "JP", color: "#60a5fa",
    phone: "+55 31 97654-3210", totalOwed: 80,  activeDebts: 1,
    status: "uptodate" as const, lastActivity: "Jun 08",
  },
  {
    name: "Letícia Fernandes", initials: "LE", color: "#f472b6",
    phone: "+55 11 96789-0123", totalOwed: 210, activeDebts: 2,
    status: "pending" as const, lastActivity: "Jun 20",
  },
  {
    name: "Marcos Vinícius",   initials: "MK", color: "#fb923c",
    phone: "+55 85 95432-1098", totalOwed: 55,  activeDebts: 1,
    status: "uptodate" as const, lastActivity: "Jun 18",
  },
];

const AVATAR_COLORS = ["#a855f7","#4ade80","#60a5fa","#f472b6","#fb923c","#22d3ee","#facc15","#f43f5e"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function getCategoryMeta(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
function getMonthLabel(offset: number): string {
  const d = new Date(2025, 7 + offset, 1); // Aug 2025 = offset 0
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
    .replace(".", "").replace(/^\w/, (c) => c.toUpperCase());
}

// ─── Shared components ────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative h-6 w-11 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: on ? "#4ade80" : "#2a2a3e" }}
    >
      <span
        className="absolute top-0.5 size-5 rounded-full bg-white transition-all duration-300 shadow-sm"
        style={{ left: on ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  );
}

function CategoryTag({ categoryId }: { categoryId: string }) {
  const cat = getCategoryMeta(categoryId);
  const Icon = cat.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: cat.color + "22", color: cat.color }}
    >
      <Icon size={9} />{cat.label}
    </span>
  );
}

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.32,
        background: `linear-gradient(135deg, ${color}88, ${color})`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const leftItems  = [
    { id: "home" as Screen,       icon: Home,    label: "Home"       },
    { id: "projection" as Screen, icon: Sparkles, label: "Projeção"  },
  ];
  const rightItems = [
    { id: "debtors" as Screen,    icon: Users,   label: "Devedores"  },
    { id: "settings" as Screen,   icon: Settings, label: "Config"    },
  ];

  const NavBtn = ({ id, icon: Icon, label }: { id: Screen; icon: typeof Home; label: string }) => (
    <button
      onClick={() => setScreen(id)}
      className={`flex flex-col items-center gap-0.5 transition-all flex-1 ${screen === id ? "text-primary" : "text-muted-foreground"}`}
    >
      <Icon size={19} strokeWidth={screen === id ? 2.5 : 1.5} />
      <span className="text-[9px] font-medium">{label}</span>
      {screen === id && <span className="h-0.5 w-4 rounded-full bg-primary mt-0.5" />}
    </button>
  );

  return (
    <nav className="flex items-center border-t border-border bg-card px-2 py-2.5">
      {leftItems.map((item) => <NavBtn key={item.id} {...item} />)}

      {/* FAB */}
      <button
        onClick={() => setScreen("add-expense")}
        className="flex-shrink-0 size-12 rounded-full flex items-center justify-center -mt-5 mx-2 transition-transform active:scale-95"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 20px #a855f760" }}
      >
        <Plus size={22} className="text-white" />
      </button>

      {rightItems.map((item) => <NavBtn key={item.id} {...item} />)}
    </nav>
  );
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────

function HomeScreen({ onSelectBorrower }: { onSelectBorrower: () => void }) {
  const [chartMode, setChartMode] = useState<"pie" | "line">("pie");

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl bg-secondary border border-border px-3 py-2 text-xs">
        <p className="font-semibold text-foreground">{payload[0].name ?? payload[0].dataKey}</p>
        <p style={{ color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(payload[0].value)}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 px-4 pb-2 pt-5 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Bom dia, Lucas 👋</p>
          <h1 className="text-2xl font-bold text-foreground leading-tight" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Junho 2025</h1>
        </div>
        <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
          <span className="text-sm font-bold text-primary" style={{ fontFamily: "'Rajdhani', sans-serif" }}>LR</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Salário</p>
          <p className="text-xl font-bold text-accent" style={{ fontFamily: "'Rajdhani', sans-serif" }}>R$ 5.800</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Gastos</p>
          <p className="text-xl font-bold text-primary" style={{ fontFamily: "'Rajdhani', sans-serif" }}>R$ 3.600</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Visão Geral</h2>
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button onClick={() => setChartMode("pie")} className={`px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1 ${chartMode === "pie" ? "bg-primary text-white" : "text-muted-foreground"}`}>
              <BarChart2 size={12} /> Torta
            </button>
            <button onClick={() => setChartMode("line")} className={`px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1 ${chartMode === "line" ? "bg-primary text-white" : "text-muted-foreground"}`}>
              <TrendingUp size={12} /> Linha
            </button>
          </div>
        </div>
        {chartMode === "pie" ? (
          <div className="flex items-center gap-4">
            <PieChart width={130} height={130}>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={34} outerRadius={62} dataKey="value" strokeWidth={0}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div className="flex flex-col gap-1.5 flex-1">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-foreground font-medium text-[10px]">{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: "#7b7a9e", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="salary" stroke="#4ade80" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Maiores Gastos</h2>
        <div className="flex flex-col gap-2">
          {topExpenses.map((exp, i) => {
            const cat = getCategoryMeta(exp.category);
            const CatIcon = cat.icon;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-card border border-border px-3 py-3">
                <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.color + "22" }}>
                  <CatIcon size={16} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{exp.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CategoryTag categoryId={exp.category} />
                    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: exp.cardColor + "22", color: exp.cardColor }}>{exp.card}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground flex-shrink-0" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{fmt(exp.amount)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Devedores do Mês</h2>
          <span className="text-xs text-primary">{fmt(borrowers.reduce((s, b) => s + b.owed, 0))}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {borrowers.map((b) => {
            const urgent = b.closingDaysLeft <= 5;
            return (
              <button key={b.name} onClick={onSelectBorrower}
                className="flex flex-col items-center gap-2 flex-shrink-0 p-3 rounded-2xl bg-card border w-[84px] transition-colors"
                style={{ borderColor: urgent ? "#f43f5e44" : "rgba(168,85,247,0.15)" }}>
                <div className="relative">
                  <Avatar initials={b.initials} color={b.color} size={44} />
                  {urgent && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#f43f5e] flex items-center justify-center">
                      <AlertTriangle size={9} className="text-white" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground font-medium">{b.name}</p>
                <p className="text-xs font-bold" style={{ color: b.color, fontFamily: "'Rajdhani', sans-serif" }}>{fmt(b.owed)}</p>
                <p className={`text-[9px] font-medium ${urgent ? "text-[#f43f5e]" : "text-muted-foreground"}`}>
                  {urgent ? `Fecha em ${b.closingDaysLeft}d ⚠` : `${b.closingDaysLeft}d`}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Borrower Profile ─────────────────────────────────────────────────

function BorrowerScreen({ onBack }: { onBack: () => void }) {
  const totalOwed = camilaDebts.reduce((s, g) => s + g.total, 0);
  return (
    <div className="flex flex-col overflow-y-auto h-full relative">
      <div className="px-4 pt-6 pb-8" style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #0a0a10 60%)" }}>
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground text-sm mb-6"><ArrowLeft size={16} /> Voltar</button>
        <div className="flex items-center gap-4">
          <Avatar initials="CA" color="#a855f7" size={64} />
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Devedor</p>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Camila Andrade</h1>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-white/5 border border-primary/20 p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total em Aberto</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif", color: "#a855f7", textShadow: "0 0 24px #a855f740" }}>{fmt(totalOwed)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4 pt-4 pb-28">
        {camilaDebts.map((group, gi) => (
          <div key={gi} className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border" style={{ background: group.cardColor + "14" }}>
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg flex items-center justify-center" style={{ background: group.cardColor + "30" }}>
                  <CreditCard size={14} style={{ color: group.cardColor }} />
                </div>
                <span className="text-sm font-semibold text-foreground">{group.card}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: group.cardColor, fontFamily: "'Rajdhani', sans-serif" }}>{fmt(group.total)}</span>
            </div>
            {group.items.map((item, ii) => (
              <div key={ii} className={`px-4 py-3 ${ii < group.items.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-foreground">{item.name}</p>
                    <div className="mt-1"><CategoryTag categoryId={item.category} /></div>
                  </div>
                  <p className="text-sm font-bold text-foreground flex-shrink-0" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{fmt(item.total)}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  {item.installments > 1 ? (
                    <>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#a855f722", color: "#a855f7" }}>
                        Parcela {item.paid}/{item.installments} × {fmt(item.perInstallment)}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: item.installments }).map((_, idx) => (
                          <span key={idx} className="size-2 rounded-full" style={{ background: idx < item.paid ? "#a855f7" : "#2a2a3e" }} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#4ade8022", color: "#4ade80" }}>À vista — pago</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-6" style={{ background: "linear-gradient(to top, #0a0a10 70%, transparent)" }}>
        <button className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 text-sm font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 4px 24px #25d36650" }}>
          <MessageCircle size={18} />Lembrar via WhatsApp
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Future Projection ────────────────────────────────────────────────

const TOTAL_MONTHS = 12;
type FilterMode = "all" | "mine" | string; // string = debtor name

function ProjectionScreen() {
  const [monthIdx, setMonthIdx] = useState(0);
  const [filter, setFilter]     = useState<FilterMode>("all");
  const monthScrollRef           = useRef<HTMLDivElement>(null);

  // Simulated per-month variance
  const variance = [0, -80, 120, -40, 200, -60, 90, -110, 50, 180, -30, 70];
  const baseOwed = 810;
  const myShare  = (item: typeof futureInstallments[0]) => item.owner === null;

  const filtered = futureInstallments.filter((item) => {
    if (filter === "all")  return true;
    if (filter === "mine") return myShare(item);
    return item.owner?.name === filter;
  });

  const totalMonth = futureInstallments.reduce((s, i) => s + i.amount, 0) + variance[monthIdx];
  const myTotal    = futureInstallments.filter(myShare).reduce((s, i) => s + i.amount, 0);
  const toReceive  = baseOwed + variance[monthIdx] * 0.3;

  const debtorFilters = [...new Set(futureInstallments.filter((i) => i.owner).map((i) => i.owner!.name))];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: "linear-gradient(160deg, #0d0520 0%, #0a0a10 70%)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-primary" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Inteligência Financeira</p>
        </div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Projeção Futura</h1>

        {/* Month scroll */}
        <div
          ref={monthScrollRef}
          className="flex gap-2 overflow-x-auto mt-4 pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {Array.from({ length: TOTAL_MONTHS }).map((_, i) => {
            const active = i === monthIdx;
            return (
              <button
                key={i}
                onClick={() => setMonthIdx(i)}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: active ? "#a855f7" : "#1a1a28",
                  color: active ? "#fff" : "#7b7a9e",
                  boxShadow: active ? "0 0 16px #a855f750" : "none",
                  border: active ? "1px solid #a855f7" : "1px solid rgba(168,85,247,0.12)",
                }}
              >
                {getMonthLabel(i)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-4">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-3">
          {/* Total */}
          <div className="rounded-2xl p-4 border relative overflow-hidden" style={{ background: "#12121c", borderColor: "rgba(168,85,247,0.2)" }}>
            <div className="absolute -right-6 -top-6 size-24 rounded-full opacity-10" style={{ background: "#a855f7" }} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total Estimado</p>
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{fmt(totalMonth)}</p>
              </div>
              <div className="size-11 rounded-2xl bg-primary/15 flex items-center justify-center">
                <TrendingDown size={20} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* My share */}
            <div className="rounded-2xl p-4 border" style={{ background: "#0d1a12", borderColor: "rgba(74,222,128,0.2)" }}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Minha Parte</p>
              <p className="text-xl font-bold text-accent" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{fmt(myTotal)}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{Math.round((myTotal / totalMonth) * 100)}% do total</p>
            </div>
            {/* To receive */}
            <div className="rounded-2xl p-4 border" style={{ background: "#1a1020", borderColor: "rgba(168,85,247,0.2)" }}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">A Receber</p>
              <p className="text-xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif", color: "#c084fc" }}>{fmt(toReceive)}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{debtors} devedores ativos</p>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {["all", "mine", ...debtorFilters].map((f) => {
            const label = f === "all" ? "Todos" : f === "mine" ? "Minhas" : f;
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  background: active ? "#a855f722" : "transparent",
                  color: active ? "#a855f7" : "#7b7a9e",
                  borderColor: active ? "#a855f766" : "rgba(168,85,247,0.15)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Installments list */}
        <div className="flex flex-col gap-2">
          {filtered.map((item, i) => {
            const cat = getCategoryMeta(item.category);
            const CatIcon = cat.icon;
            const paidInMonth = item.paid + monthIdx;
            const currentInstall = Math.min(paidInMonth + 1, item.total);
            return (
              <div key={i} className="rounded-xl bg-card border border-border px-3 py-3 flex items-center gap-3">
                <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.color + "20" }}>
                  <CatIcon size={15} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate font-medium">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {/* Installment badge */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#a855f722", color: "#a855f7" }}>
                      {currentInstall}/{item.total}
                    </span>
                    {/* Card tag */}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ background: item.cardColor + "22", color: item.cardColor }}>
                      <CreditCard size={8} />{item.card}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <p className="text-sm font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{fmt(item.amount)}</p>
                  {item.owner ? (
                    <Avatar initials={item.owner.initials} color={item.owner.color} size={22} />
                  ) : (
                    <div className="size-[22px] rounded-full bg-accent/20 flex items-center justify-center">
                      <User size={11} className="text-accent" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl bg-card border border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma parcela neste filtro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// helper used inside ProjectionScreen JSX
const debtors = debtorsList.length;

// ─── Screen: Debtors Management ───────────────────────────────────────────────

function DebtorsScreen() {
  const [showAdd, setShowAdd]           = useState(false);
  const [newName, setNewName]           = useState("");
  const [newPhone, setNewPhone]         = useState("");
  const [newColor, setNewColor]         = useState(AVATAR_COLORS[0]);
  const [list, setList]                 = useState(debtorsList);
  const [expandedIdx, setExpandedIdx]   = useState<number | null>(null);

  const totalReceivable = list.reduce((s, d) => s + d.totalOwed, 0);

  function addDebtor() {
    if (!newName.trim()) return;
    const initials = newName.trim().split(" ").slice(0, 2).map((w) => w[0].toUpperCase()).join("");
    setList((prev) => [...prev, {
      name: newName.trim(),
      initials,
      color: newColor,
      phone: newPhone || "—",
      totalOwed: 0,
      activeDebts: 0,
      status: "uptodate" as const,
      lastActivity: "Agora",
    }]);
    setNewName(""); setNewPhone(""); setNewColor(AVATAR_COLORS[0]); setShowAdd(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: "linear-gradient(160deg, #0d0520 0%, #0a0a10 70%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Gestão</p>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Devedores</h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 12px #a855f750" }}
          >
            <Plus size={13} /> Adicionar
          </button>
        </div>

        {/* Total receivable card */}
        <div className="rounded-2xl border p-4 relative overflow-hidden" style={{ background: "#12121c", borderColor: "rgba(74,222,128,0.25)" }}>
          <div className="absolute -right-8 -bottom-8 size-28 rounded-full opacity-10" style={{ background: "#4ade80" }} />
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total a Receber</p>
          <p className="text-3xl font-bold text-accent" style={{ fontFamily: "'Rajdhani', sans-serif", textShadow: "0 0 20px #4ade8040" }}>
            {fmt(totalReceivable)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{list.length} devedores · {list.filter((d) => d.status === "pending").length} com pendências</p>
        </div>
      </div>

      {/* Add debtor overlay */}
      {showAdd && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-t-3xl bg-card border-t border-border px-4 pt-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Novo Devedor</h2>
              <button onClick={() => setShowAdd(false)} className="size-8 rounded-full bg-secondary flex items-center justify-center">
                <X size={15} className="text-muted-foreground" />
              </button>
            </div>

            {/* Avatar color picker */}
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Cor do Avatar</p>
            <div className="flex gap-2 mb-4">
              {AVATAR_COLORS.map((c) => (
                <button key={c} onClick={() => setNewColor(c)}
                  className="size-8 rounded-full transition-all"
                  style={{ background: c, outline: newColor === c ? `2px solid ${c}` : "none", outlineOffset: 2 }}
                >
                  {newColor === c && <Check size={12} className="text-white m-auto" />}
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 mb-5 px-3 py-3 rounded-xl bg-secondary border border-border">
              <Avatar
                initials={newName.trim().split(" ").slice(0,2).map((w) => w[0]?.toUpperCase() ?? "?").join("") || "?"}
                color={newColor}
                size={40}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{newName || "Nome do Devedor"}</p>
                <p className="text-xs text-muted-foreground">{newPhone || "Telefone"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text" placeholder="Nome completo" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl bg-secondary border border-border pl-9 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel" placeholder="WhatsApp / Telefone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-xl bg-secondary border border-border pl-9 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                onClick={addDebtor}
                className="w-full rounded-xl py-3.5 text-sm font-bold text-white mt-1 transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 16px #a855f750" }}
              >
                Adicionar Devedor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debtor list */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        {list.map((d, i) => {
          const expanded = expandedIdx === i;
          const isPending = d.status === "pending";
          return (
            <div key={i} className="rounded-2xl bg-card border overflow-hidden transition-all"
              style={{ borderColor: isPending ? "rgba(244,63,94,0.25)" : "rgba(168,85,247,0.15)" }}>
              {/* Main row */}
              <button className="w-full flex items-center gap-3 px-4 py-4" onClick={() => setExpandedIdx(expanded ? null : i)}>
                <Avatar initials={d.initials} color={d.color} size={44} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{d.name}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isPending ? "text-[#f43f5e]" : "text-accent"}`}
                      style={{ background: isPending ? "#f43f5e18" : "#4ade8018" }}>
                      {isPending ? "Pendente" : "Em dia"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Phone size={10} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{d.phone}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold" style={{ color: d.color, fontFamily: "'Rajdhani', sans-serif" }}>{fmt(d.totalOwed)}</p>
                  <p className="text-[10px] text-muted-foreground">{d.activeDebts} dívida{d.activeDebts !== 1 ? "s" : ""}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 ml-1 transition-transform" style={{ transform: expanded ? "rotate(90deg)" : "none" }} />
              </button>

              {/* Expanded actions */}
              {expanded && (
                <div className="border-t border-border px-4 py-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Última atividade: {d.lastActivity}</span>
                    <span>{d.activeDebts} dívida{d.activeDebts !== 1 ? "s" : ""} ativa{d.activeDebts !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl text-xs font-semibold border border-primary/30 text-primary bg-primary/10 transition-all active:scale-95">
                      Ver Detalhes
                    </button>
                    <button className="flex-1 py-2 rounded-xl text-xs font-semibold border border-accent/30 text-accent bg-accent/10 transition-all active:scale-95">
                      + Débito
                    </button>
                  </div>
                  <button className="w-full py-2 rounded-xl text-xs font-semibold border border-[#4ade80]/20 text-[#4ade80] bg-[#4ade80]/10 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                    <Check size={12} /> Marcar como Pago
                  </button>
                  <button className="w-full py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    style={{ background: "#25d36618", color: "#25d366", border: "1px solid #25d36630" }}>
                    <MessageCircle size={12} /> WhatsApp
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Screen: Add Expense ──────────────────────────────────────────────────────

function AddExpenseScreen({ onBack }: { onBack: () => void }) {
  const [amount, setAmount]               = useState("");
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [date, setDate]                   = useState("2025-06-18");
  const [selectedCard, setSelectedCard]   = useState(0);
  const [splitOn, setSplitOn]             = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [installments, setInstallments]   = useState("1");
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [showInstallDropdown, setShowInstallDropdown] = useState(false);

  const toggleFriend = (i: number) =>
    setSelectedFriends((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const numAmount  = parseFloat(amount.replace(",", ".")) || 0;
  const splitCount = selectedFriends.length + 1;
  const perPerson  = splitCount > 1 ? numAmount / splitCount : 0;
  const installOpts = ["1","2","3","4","5","6","10","12"];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #0a0a10 70%)" }}>
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground text-sm mb-4"><ArrowLeft size={16} /> Voltar</button>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Nova Despesa</h1>
        <div className="mt-4 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>R$</span>
          <input type="text" inputMode="decimal" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-2xl bg-white/5 border border-primary/20 pl-14 pr-4 py-4 text-3xl font-bold text-foreground outline-none focus:border-primary transition-colors"
            style={{ fontFamily: "'Rajdhani', sans-serif" }} />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Categoria</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-center gap-1.5 rounded-xl py-3 border transition-all"
                  style={{ background: active ? cat.color + "22" : "#12121c", borderColor: active ? cat.color + "88" : "rgba(168,85,247,0.15)" }}>
                  <Icon size={18} style={{ color: active ? cat.color : "#7b7a9e" }} />
                  <span className="text-[10px] font-medium" style={{ color: active ? cat.color : "#7b7a9e" }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Data</p>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl bg-secondary border border-border pl-9 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
              style={{ colorScheme: "dark" }} />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Cartão de Crédito</p>
          <div className="relative">
            <button onClick={() => setShowCardDropdown(!showCardDropdown)}
              className="w-full flex items-center gap-3 rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground">
              <div className="size-6 rounded-md flex items-center justify-center" style={{ background: creditCards[selectedCard].color + "30" }}>
                <CreditCard size={13} style={{ color: creditCards[selectedCard].color }} />
              </div>
              <span className="flex-1 text-left">{creditCards[selectedCard].name} •••• {creditCards[selectedCard].last4}</span>
              <ChevronDown size={15} className="text-muted-foreground" />
            </button>
            {showCardDropdown && (
              <div className="absolute top-full mt-1 left-0 right-0 rounded-xl bg-secondary border border-border overflow-hidden z-10">
                {creditCards.map((card, i) => (
                  <button key={i} onClick={() => { setSelectedCard(i); setShowCardDropdown(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm hover:bg-white/5 transition-colors border-b border-border last:border-0">
                    <div className="size-6 rounded-md flex items-center justify-center" style={{ background: card.color + "30" }}>
                      <CreditCard size={13} style={{ color: card.color }} />
                    </div>
                    <span className="flex-1 text-left text-foreground">{card.name} •••• {card.last4}</span>
                    {i === selectedCard && <Check size={14} style={{ color: "#4ade80" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Dividir com amigos?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Selecione quem vai rachar</p>
            </div>
            <Toggle on={splitOn} onToggle={() => { setSplitOn(!splitOn); setSelectedFriends([]); }} />
          </div>
          {splitOn && (
            <div className="mt-4">
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {friends.map((f, i) => {
                  const selected = selectedFriends.includes(i);
                  return (
                    <button key={i} onClick={() => toggleFriend(i)} className="flex flex-col items-center gap-1.5 flex-shrink-0 relative">
                      <div className="transition-all" style={{ outline: selected ? `2px solid ${f.color}` : "2px solid transparent", outlineOffset: 2, borderRadius: "50%" }}>
                        <Avatar initials={f.initials} color={selected ? f.color : "#2a2a3e"} size={44} />
                      </div>
                      {selected && (
                        <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-accent flex items-center justify-center">
                          <Check size={9} className="text-black" />
                        </span>
                      )}
                      <p className="text-[10px] text-muted-foreground">{f.name.split(" ")[0]}</p>
                    </button>
                  );
                })}
              </div>
              {selectedFriends.length > 0 && (
                <div className="mt-4 rounded-xl bg-accent/10 border border-accent/20 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Valor por pessoa</p>
                    <p className="text-xs text-accent mt-0.5">{splitCount} pessoas (você + {selectedFriends.length})</p>
                  </div>
                  <p className="text-xl font-bold text-accent" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {perPerson > 0 ? fmt(perPerson) : "—"}
                  </p>
                </div>
              )}
              <div className="mt-3 relative">
                <p className="text-xs text-muted-foreground mb-2">Número de parcelas</p>
                <button onClick={() => setShowInstallDropdown(!showInstallDropdown)}
                  className="w-full flex items-center justify-between rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground">
                  <span>{installments === "1" ? "À vista (1×)" : `${installments}× de ${perPerson > 0 ? fmt(perPerson / parseInt(installments)) : "—"}`}</span>
                  <ChevronDown size={15} className="text-muted-foreground" />
                </button>
                {showInstallDropdown && (
                  <div className="absolute top-full mt-1 left-0 right-0 rounded-xl bg-secondary border border-border overflow-hidden z-10">
                    {installOpts.map((opt) => (
                      <button key={opt} onClick={() => { setInstallments(opt); setShowInstallDropdown(false); }}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-white/5 transition-colors border-b border-border last:border-0">
                        <span className="text-foreground">{opt === "1" ? "À vista" : `${opt}× parcelas`}</span>
                        {opt === installments && <Check size={14} style={{ color: "#4ade80" }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="w-full rounded-2xl py-4 text-sm font-bold text-white transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 20px #a855f750" }}>
          Salvar Despesa
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────

function SettingsScreen() {
  const [salary, setSalary]   = useState("5800");
  const [toggles, setToggles] = useState(fixedExpenses.map((e) => e.active));

  return (
    <div className="flex flex-col gap-5 px-4 pb-4 pt-5 overflow-y-auto h-full">
      <div>
        <p className="text-xs text-muted-foreground">Gerenciamento</p>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Configurações</h1>
      </div>
      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-8 rounded-xl bg-accent/15 flex items-center justify-center"><DollarSign size={15} className="text-accent" /></div>
          <h2 className="text-sm font-semibold text-foreground">Salário Mensal</h2>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>R$</span>
          <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)}
            className="w-full rounded-xl bg-secondary border border-border pl-10 pr-4 py-3 text-foreground text-sm outline-none focus:border-primary transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center"><Wallet size={15} className="text-primary" /></div>
            <h2 className="text-sm font-semibold text-foreground">Meus Cartões</h2>
          </div>
          <button className="flex items-center gap-1 text-xs text-primary font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10"><Plus size={11} /> Adicionar</button>
        </div>
        <div className="flex flex-col gap-3">
          {creditCards.map((card) => {
            const usedPct = (card.used / card.limit) * 100;
            return (
              <div key={card.name} className={`rounded-2xl p-4 bg-gradient-to-br ${card.gradient} border border-white/10`} style={{ boxShadow: `0 4px 20px ${card.color}30` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><CreditCard size={16} className="text-white/80" /><span className="text-sm font-semibold text-white">{card.name}</span></div>
                  <span className="text-xs text-white/60 tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>•••• {card.last4}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1.5"><span>Usado: {fmt(card.used)}</span><span>Limite: {fmt(card.limit)}</span></div>
                  <div className="h-1.5 rounded-full bg-white/15"><div className="h-full rounded-full" style={{ width: `${usedPct}%`, background: "rgba(255,255,255,0.7)" }} /></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="size-8 rounded-xl bg-accent/15 flex items-center justify-center"><ChevronRight size={15} className="text-accent" /></div>
          <h2 className="text-sm font-semibold text-foreground">Gastos Fixos</h2>
        </div>
        <div className="flex flex-col gap-2">
          {fixedExpenses.map((exp, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-card border border-border px-4 py-3">
              <div>
                <p className="text-sm text-foreground">{exp.name}</p>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(exp.amount)}/mês</p>
              </div>
              <Toggle on={toggles[i]} onToggle={() => setToggles((prev) => prev.map((v, j) => (j === i ? !v : v)))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [prevScreen, setPrevScreen] = useState<Screen>("home");

  function navigate(s: Screen) {
    setPrevScreen(screen);
    setScreen(s);
  }

  const hideNav = screen === "add-expense" || screen === "borrower";

  return (
    <div className="size-full flex items-center justify-center bg-black" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div
        className="relative flex flex-col overflow-hidden bg-background"
        style={{
          width: "min(390px, 100vw)",
          height: "min(844px, 100vh)",
          borderRadius: "clamp(0px, (100vw - 390px) * 999, 40px)",
          boxShadow: "0 0 0 1px rgba(168,85,247,0.2), 0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 flex-shrink-0">
          <span className="text-[11px] font-semibold text-foreground">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[3, 5, 7, 9].map((h, i) => <span key={i} className="w-0.5 bg-foreground rounded-sm" style={{ height: h }} />)}
            </div>
            <svg width="15" height="10" viewBox="0 0 15 10" className="text-foreground">
              <rect x="0" y="3" width="13" height="7" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="13.5" y="4.5" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4" />
              <rect x="1" y="4" width="9" height="5" rx="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Screens */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          {screen === "home"        && <HomeScreen onSelectBorrower={() => navigate("borrower")} />}
          {screen === "borrower"    && <BorrowerScreen onBack={() => navigate(prevScreen === "borrower" ? "home" : prevScreen)} />}
          {screen === "projection"  && <ProjectionScreen />}
          {screen === "debtors"     && <DebtorsScreen />}
          {screen === "add-expense" && <AddExpenseScreen onBack={() => navigate(prevScreen === "add-expense" ? "home" : prevScreen)} />}
          {screen === "settings"    && <SettingsScreen />}
        </div>

        {!hideNav && <BottomNav screen={screen} setScreen={navigate} />}

        <div className="flex justify-center py-1.5 flex-shrink-0">
          <div className="h-1 w-24 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
