import {
  Archive, ArrowRight, ArrowUp, BadgeCheck, BookA, Brain, CalendarDays, Check, ChevronDown, ChevronRight, CircleAlert,
  CircleCheckBig, CircleHelp, Clock, Command, Cookie, Copy, Eye, FileText, Flame, Gauge, GraduationCap, Grid3x3, Hash, Info,
  Globe, Infinity as InfinityIcon, Keyboard, Layers, LetterText, Lightbulb, List, ListChecks, LoaderCircle, Lock, Mail, Medal,
  Menu, Microscope, Monitor, Moon, MousePointerClick, Newspaper, PanelLeftClose, PanelLeftOpen, PartyPopper, Puzzle, Quote, RotateCcw, Route, Scale, Search,
  Share2, ShieldCheck, Shuffle, Smartphone, Sparkles, SpellCheck, Star, Sun, Target, TextSearch, Trash2, TriangleAlert,
  Trophy, UserRound, Users, WandSparkles, X, Zap, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Archive, ArrowRight, ArrowUp, BadgeCheck, BookA, Brain, CalendarDays, Check, ChevronDown, ChevronRight, CircleAlert,
  CircleCheckBig, CircleHelp, Clock, Command, Cookie, Copy, Eye, FileText, Flame, Gauge, GraduationCap, Grid3x3, Hash, Info,
  Globe, Infinity: InfinityIcon, Keyboard, Layers, LetterText, Lightbulb, List, ListChecks, LoaderCircle, Lock, Mail, Medal,
  Menu, Microscope, Monitor, Moon, MousePointerClick, Newspaper, PanelLeftClose, PanelLeftOpen, PartyPopper, Puzzle, Quote, RotateCcw, Route, Scale, Search,
  Share2, ShieldCheck, Shuffle, Smartphone, Sparkles, SpellCheck, Star, Sun, Target, TextSearch, Trash2, TriangleAlert,
  Trophy, UserRound, Users, WandSparkles, X, Zap,
};

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20, className, label }: { name: string; size?: number; className?: string; label?: string }) {
  const C = ICONS[name] ?? Sparkles;
  return <C size={size} className={className} aria-hidden={label ? undefined : true} aria-label={label} role={label ? "img" : undefined} strokeWidth={2} />;
}
