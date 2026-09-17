import {
  Code,
  Gauge,
  Gem,
  Layers,
  Palette,
  Sparkles,
  TrendingUp,
  type LucideIcon,
  Rocket,
  ShieldCheck,
  Target,
  Zap,
  Globe,
  BarChart3,
  MessageCircle,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  code: Code,
  sparkles: Sparkles,
  palette: Palette,
  "trending-up": TrendingUp,
  gem: Gem,
  layers: Layers,
  gauge: Gauge,
  rocket: Rocket,
  shield: ShieldCheck,
  target: Target,
  zap: Zap,
  globe: Globe,
  chart: BarChart3,
  chat: MessageCircle,
};

export function Icon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Cmp = (name && registry[name]) || Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}
