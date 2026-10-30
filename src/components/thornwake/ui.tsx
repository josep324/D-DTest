import type { ReactNode } from "react";
import { clsx } from "clsx";
import type { Character } from "@/lib/game/types";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        fill="currentColor"
        d="M24 7c1.2 5.2.6 8.4-1.2 12.2-3.2 1.2-6.6 4.2-7.2 8.2 4.6-1.6 8.2-1.2 12.6.6-1.4-4.8-1.2-7.2-6.2-9.4C24.6 14 25.2 11 24 7z"
      />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Ornate({
  children,
  variant = "dark",
  className,
}: {
  children: ReactNode;
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={clsx("ornate", variant === "dark" ? "ornate-dark" : "ornate-light", className)}>
      <span className="ornate-mark tl" />
      <span className="ornate-mark tr" />
      <span className="ornate-mark bl" />
      <span className="ornate-mark br" />
      {children}
    </div>
  );
}

export function Portrait({ person, className }: { person: Character; className?: string }) {
  if (person.portrait) {
    return <img src={person.portrait} alt="" className={clsx("size-full object-cover", className)} />;
  }
  const vesper = person.cameo !== "holt";
  return (
    <svg viewBox="0 0 80 80" className={clsx("size-full", className)} aria-hidden>
      <defs>
        <radialGradient id={`${person.id}-bg`} cx="35%" cy="30%">
          <stop offset="0%" stopColor={vesper ? "#3d4e73" : "#4a3428"} />
          <stop offset="100%" stopColor="#120e0b" />
        </radialGradient>
      </defs>
      <rect width="80" height="80" fill={`url(#${person.id}-bg)`} />
      {vesper ? (
        <path
          fill="#ead9b4"
          d="M48 18c6 2 10 10 9 18-4 1-6 4-6 8 4 3 6 8 4 14-8 3-16 2-22-2 2-6 1-10-2-14 3-6 2-12 1-16 5-6 11-10 16-8z"
        />
      ) : (
        <path
          fill="#ead9b4"
          d="M26 20c8-6 18-4 22 4 2 6-1 10-1 14 5 2 8 8 7 14-9 4-18 3-26-1 1-5 0-9-3-13 2-4 4-10 1-18z"
        />
      )}
      <path
        d={vesper ? "M30 16c8-8 24-4 28 6-8 0-12 2-16 8-4-6-8-10-12-14z" : "M24 16c6-4 16-6 22-2-6 2-8 6-8 10-6-2-10-4-14-8z"}
        fill={vesper ? "#d5d8e4" : "#1a120e"}
      />
    </svg>
  );
}

export function TextButton({
  children,
  onClick,
  disabled,
  tone = "ghost",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "ghost" | "solid" | "ember";
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "min-h-11 w-full px-3 text-center font-sans text-sm tracking-wide transition disabled:opacity-40",
        tone === "ghost" && "border border-gold/40 bg-ink/40 text-gold-bright hover:border-gold hover:bg-gold/10",
        tone === "solid" && "border border-gold/70 bg-gold/10 text-gold-bright hover:bg-gold/20",
        tone === "ember" && "border border-ember/80 bg-ember text-parchment hover:bg-ember/90",
      )}
    >
      {children}
    </button>
  );
}
