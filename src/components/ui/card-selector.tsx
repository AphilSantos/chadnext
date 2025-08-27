"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Card, formatCardDisplay, getAvailableCards } from "~/lib/card-deck";

interface CardSelectorProps {
  selectedCard?: Card;
  onCardSelect: (card: Card | undefined) => void;
  excludedCards?: Card[];
  placeholder?: string;
  disabled?: boolean;
}

export function CardSelector({
  selectedCard,
  onCardSelect,
  excludedCards = [],
  placeholder = "Select a card...",
  disabled = false,
}: CardSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const availableCards = getAvailableCards(excludedCards);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedCard ? (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-lg",
                  selectedCard.color === "red" ? "text-red-600" : "text-black"
                )}
              >
                {formatCardDisplay(selectedCard)}
              </span>
              <span className="text-sm text-muted-foreground">
                {selectedCard.displayName}
              </span>
            </div>
          ) : (
            placeholder
          )}
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
                      onCardSelect(card);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCard?.id === card.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
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
  );
}
