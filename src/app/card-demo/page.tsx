"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CardSelector } from "~/components/ui/card-selector";
import { MultiCardSelector } from "~/components/ui/multi-card-selector";
import { CardListDisplay } from "~/components/ui/card-display";
import { type Card as CardType } from "~/lib/card-deck";

export default function CardDemoPage() {
  const [selectedSingleCard, setSelectedSingleCard] = useState<CardType>();
  const [selectedMultiCards, setSelectedMultiCards] = useState<CardType[]>([]);
  const [selectedHand, setSelectedHand] = useState<CardType[]>([]);
  const [selectedFlop, setSelectedFlop] = useState<CardType[]>([]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">Card Selector Components Demo</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Single Card Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Single Card Selector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardSelector
              selectedCard={selectedSingleCard}
              onCardSelect={setSelectedSingleCard}
              placeholder="Select a single card..."
            />
            {selectedSingleCard && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Selected:</p>
                <p className="text-lg">{selectedSingleCard.displayName}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Multi Card Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Multi Card Selector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultiCardSelector
              selectedCards={selectedMultiCards}
              onCardsChange={setSelectedMultiCards}
              maxCards={5}
              placeholder="Select up to 5 cards..."
            />
            {selectedMultiCards.length > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Selected Cards:</p>
                <CardListDisplay cards={selectedMultiCards} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hand Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Your Hand (2 cards)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultiCardSelector
              selectedCards={selectedHand}
              onCardsChange={setSelectedHand}
              maxCards={2}
              placeholder="Select your 2 cards..."
            />
            {selectedHand.length > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Your Hand:</p>
                <CardListDisplay cards={selectedHand} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flop Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Flop (3 cards)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultiCardSelector
              selectedCards={selectedFlop}
              onCardsChange={setSelectedFlop}
              maxCards={3}
              placeholder="Select 3 flop cards..."
            />
            {selectedFlop.length > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Flop:</p>
                <CardListDisplay cards={selectedFlop} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Selected Cards Summary */}
      <Card>
        <CardHeader>
          <CardTitle>All Selected Cards Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">Single Card:</h4>
              {selectedSingleCard ? (
                <CardListDisplay cards={[selectedSingleCard]} />
              ) : (
                <span className="text-muted-foreground">None selected</span>
              )}
            </div>
            <div>
              <h4 className="mb-2 font-medium">Multi Cards:</h4>
              <CardListDisplay cards={selectedMultiCards} />
            </div>
            <div>
              <h4 className="mb-2 font-medium">Your Hand:</h4>
              <CardListDisplay cards={selectedHand} />
            </div>
            <div>
              <h4 className="mb-2 font-medium">Flop:</h4>
              <CardListDisplay cards={selectedFlop} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
