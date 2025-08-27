"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Card, formatCardDisplay } from "~/lib/card-deck";

interface CardDisplayProps {
  card: Card;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CardDisplay({
  card,
  size = "md",
  className,
}: CardDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono font-bold",
        sizeClasses[size],
        card.color === "red" ? "text-red-600" : "text-black",
        className
      )}
      title={card.displayName}
    >
      {formatCardDisplay(card)}
    </span>
  );
}

interface CardListDisplayProps {
  cards: Card[];
  separator?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CardListDisplay({
  cards,
  separator = " ",
  size = "md",
  className,
}: CardListDisplayProps) {
  if (cards.length === 0) {
    return <span className="text-muted-foreground">No cards selected</span>;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {cards.map((card, index) => (
        <React.Fragment key={card.id}>
          <CardDisplay card={card} size={size} />
          {index < cards.length - 1 && (
            <span className="text-muted-foreground">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
