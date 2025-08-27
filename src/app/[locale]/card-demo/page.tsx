"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { CardSelector } from "~/components/ui/card-selector";
import { MultiCardSelector } from "~/components/ui/multi-card-selector";
import { CardDisplay, CardListDisplay } from "~/components/ui/card-display";
import { type Card as CardType, FULL_DECK } from "~/lib/card-deck";

export default function CardDemoPage() {
  const [selectedCard, setSelectedCard] = useState<CardType | undefined>(undefined);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Card Selector Components Demo</h1>
        <p className="text-lg text-muted-foreground">
          Test and explore the new poker card selection components
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Single Card Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Single Card Selector
              <Badge variant="secondary">Single Select</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardSelector
              selectedCard={selectedCard}
              onCardSelect={setSelectedCard}
              placeholder="Select a single card..."
            />
            {selectedCard && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Selected Card:</h4>
                <CardDisplay card={selectedCard} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Multi Card Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Multi Card Selector
              <Badge variant="secondary">Multi Select</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultiCardSelector
              selectedCards={selectedCards}
              onCardsChange={setSelectedCards}
              maxCards={5}
              placeholder="Select up to 5 cards..."
            />
            {selectedCards.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Selected Cards ({selectedCards.length}):</h4>
                <CardListDisplay cards={selectedCards} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card Display Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Card Display Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <h4 className="font-medium mb-2">Single Card:</h4>
              <CardDisplay card={FULL_DECK[0]} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Multiple Cards:</h4>
              <CardListDisplay 
                cards={[FULL_DECK[12], FULL_DECK[25], FULL_DECK[38]]} 
              />
            </div>
            <div>
              <h4 className="font-medium mb-2">High Value:</h4>
              <CardDisplay card={FULL_DECK[9]} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Face Card:</h4>
              <CardDisplay card={FULL_DECK[13]} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use These Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">CardSelector (Single):</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use for single card selection (turn, river)</li>
                <li>• Returns a single Card object</li>
                <li>• Includes placeholder and validation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">MultiCardSelector (Multiple):</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use for multiple card selection (hand, flop)</li>
                <li>• Returns an array of Card objects</li>
                <li>• Configurable max cards limit</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Integration Example:</h4>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`// In your form component
const [selectedCards, setSelectedCards] = useState<Card[]>([]);

<MultiCardSelector
  selectedCards={selectedCards}
  onCardsChange={setSelectedCards}
  maxCards={2}
  placeholder="Select your 2 cards..."
/>

// Convert to string for API
const cardString = selectedCards
  .map(card => \`\${card.value}\${card.symbol}\`)
  .join(' ');`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
