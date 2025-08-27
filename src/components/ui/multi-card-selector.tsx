"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import { Card, formatCardDisplay, getAvailableCards } from "~/lib/card-deck";

interface MultiCardSelectorProps {
  selectedCards: Card[];
  onCardsChange: (cards: Card[]) => void;
  maxCards?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiCardSelector({
  selectedCards,
  onCardsChange,
  maxCards = 5,
  placeholder = "Select cards...",
  disabled = false,
  className,
}: MultiCardSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const availableCards = getAvailableCards(selectedCards);

  const handleCardSelect = (card: Card) => {
    if (selectedCards.length < maxCards) {
      onCardsChange([...selectedCards, card]);
    }
  };

  const handleCardRemove = (cardId: string) => {
    onCardsChange(selectedCards.filter((card) => card.id !== cardId));
  };

  const isMaxReached = selectedCards.length >= maxCards;

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || isMaxReached}
          >
            {selectedCards.length === 0
              ? placeholder
              : `${selectedCards.length} card${selectedCards.length !== 1 ? "s" : ""} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search cards..." />
            <CommandList>
              <CommandEmpty>No card found.</CommandEmpty>
              {Object.entries(
                availableCards.reduce(
                  (acc, card) => {
                    const suit = card.suit;
                    if (!acc[suit]) acc[suit] = [];
                    acc[suit].push(card);
                    return acc;
                  },
                  {} as Record<string, Card[]>
                )
              ).map(([suit, cards]) => (
                <CommandGroup key={suit} heading={suit}>
                  {cards.map((card) => (
                    <CommandItem
                      key={card.id}
                      value={`${card.value} ${card.suit} ${card.displayName}`}
                      onSelect={() => {
                        handleCardSelect(card);
                        setOpen(false);
                      }}
                      disabled={isMaxReached}
                    >
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      <span
                        className={cn(
                          "mr-2 text-lg",
                          card.color === "red" ? "text-red-600" : "text-black"
                        )}
                      >
                        {formatCardDisplay(card)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {card.displayName}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Cards Display */}
      {selectedCards.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCards.map((card) => (
            <Badge
              key={card.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span
                className={cn(
                  "text-sm",
                  card.color === "red" ? "text-red-600" : "text-black"
                )}
              >
                {formatCardDisplay(card)}
              </span>
              <button
                type="button"
                onClick={() => handleCardRemove(card.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Max Cards Info */}
      {maxCards && (
        <p className="text-xs text-muted-foreground">
          {selectedCards.length}/{maxCards} cards selected
        </p>
      )}
    </div>
  );
}
