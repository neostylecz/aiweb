import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const sizes = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-12 px-7 text-base",
};

const variants = {
  primary: "bg-gradient-accent text-white shadow-sm hover:brightness-110 hover:shadow-md",
  secondary:
    "bg-foreground text-background hover:opacity-90",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

export interface ButtonBaseProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  ComponentProps<"button"> & { href?: undefined };
type ButtonAsLink = ButtonBaseProps &
  ComponentProps<typeof Link> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return <Link href={href} className={classes} {...linkProps} />;
  }

  return <button className={classes} {...(rest as ComponentProps<"button">)} />;
}
