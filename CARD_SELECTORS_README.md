# Card Selector Components

This document describes the new card selector components implemented for the poker project form.

## Overview

The card selector system provides an intuitive way for users to select poker cards without having to manually type card notation. It includes:

- **Single Card Selector**: For selecting individual cards (turn, river)
- **Multi Card Selector**: For selecting multiple cards (hands, flop)
- **Card Display Components**: For showing selected cards in a visually appealing way

## Components

### 1. CardSelector (Single Card)

A dropdown component for selecting a single card.

```tsx
import { CardSelector } from "~/components/ui/card-selector";

<CardSelector
  selectedCard={selectedCard}
  onCardSelect={setSelectedCard}
  placeholder="Select a card..."
  excludedCards={otherSelectedCards}
  disabled={false}
/>
```

**Props:**
- `selectedCard`: The currently selected card
- `onCardSelect`: Callback when a card is selected
- `placeholder`: Placeholder text when no card is selected
- `excludedCards`: Array of cards to exclude from selection
- `disabled`: Whether the selector is disabled

### 2. MultiCardSelector (Multiple Cards)

A multi-select component for selecting multiple cards with visual chips.

```tsx
import { MultiCardSelector } from "~/components/ui/multi-card-selector";

<MultiCardSelector
  selectedCards={selectedCards}
  onCardsChange={setSelectedCards}
  maxCards={3}
  placeholder="Select up to 3 cards..."
  excludedCards={otherSelectedCards}
  disabled={false}
/>
```

**Props:**
- `selectedCards`: Array of currently selected cards
- `onCardsChange`: Callback when cards selection changes
- `maxCards`: Maximum number of cards that can be selected
- `placeholder`: Placeholder text when no cards are selected
- `excludedCards`: Array of cards to exclude from selection
- `disabled`: Whether the selector is disabled

### 3. CardDisplay (Single Card Display)

Displays a single card with proper formatting and colors.

```tsx
import { CardDisplay } from "~/components/ui/card-display";

<CardDisplay 
  card={card} 
  size="md" 
  className="custom-class" 
/>
```

**Props:**
- `card`: The card object to display
- `size`: Size variant ('sm', 'md', 'lg')
- `className`: Additional CSS classes

### 4. CardListDisplay (Multiple Cards Display)

Displays multiple cards with separators.

```tsx
import { CardListDisplay } from "~/components/ui/card-display";

<CardListDisplay 
  cards={cards} 
  separator=" " 
  size="md" 
  className="custom-class" 
/>
```

**Props:**
- `cards`: Array of cards to display
- `separator`: Separator between cards (default: space)
- `size`: Size variant ('sm', 'md', 'lg')
- `className`: Additional CSS classes

## Card Data Structure

Each card object has the following structure:

```typescript
interface Card {
  id: string;           // Unique identifier (e.g., "AHEARTS")
  value: string;        // Card value (e.g., "A", "10", "K")
  suit: string;         // Suit key (e.g., "HEARTS", "SPADES")
  symbol: string;       // Suit symbol (e.g., "♥", "♠")
  displayName: string;  // Human-readable name (e.g., "Ace of Hearts")
  color: 'red' | 'black'; // Card color for styling
}
```

## Usage Examples

### Basic Form Integration

```tsx
import { useState } from "react";
import { CardSelector, MultiCardSelector } from "~/components/ui/card-selector";
import { type Card } from "~/lib/card-deck";

function PokerForm() {
  const [yourHand, setYourHand] = useState<Card[]>([]);
  const [turn, setTurn] = useState<Card>();

  return (
    <form>
      <div>
        <label>Your Hand (2 cards)</label>
        <MultiCardSelector
          selectedCards={yourHand}
          onCardsChange={setYourHand}
          maxCards={2}
          placeholder="Select your 2 cards..."
        />
      </div>
      
      <div>
        <label>Turn Card</label>
        <CardSelector
          selectedCard={turn}
          onCardSelect={setTurn}
          placeholder="Select turn card..."
          excludedCards={yourHand}
        />
      </div>
    </form>
  );
}
```

### Validation and Error Handling

```tsx
const formSchema = z.object({
  yourHand: z.array(z.any()).min(2, "Please select exactly 2 cards").max(2, "Please select exactly 2 cards"),
  flop: z.array(z.any()).min(3, "Please select exactly 3 cards").max(3, "Please select exactly 3 cards"),
  turn: z.any().optional(),
  river: z.any().optional(),
});
```

### Converting to API Format

```tsx
const onSubmit = async (data: FormData) => {
  // Convert card arrays to strings for the API
  const formattedData = {
    ...data,
    yourHand: data.yourHand.map(card => `${card.value}${card.symbol}`).join(' '),
    flop: data.flop.map(card => `${card.value}${card.symbol}`).join(' '),
    turn: data.turn ? `${data.turn.value}${data.turn.symbol}` : '',
    river: data.river ? `${data.river.value}${data.river.value}` : '',
  };
  
  await createProject(formattedData);
};
```

## Features

### 1. Smart Card Exclusion
- Cards selected in one field are automatically excluded from other fields
- Prevents duplicate card selection across the entire form

### 2. Visual Card Representation
- Cards are displayed with proper colors (red for hearts/diamonds, black for clubs/spades)
- Suit symbols (♥, ♦, ♣, ♠) are used for better visual recognition

### 3. Searchable Dropdowns
- Users can search for cards by value, suit, or name
- Cards are grouped by suit for easier navigation

### 4. Responsive Design
- Components work well on both desktop and mobile devices
- Touch-friendly interface for mobile users

### 5. Accessibility
- Proper ARIA labels and keyboard navigation
- Screen reader friendly

## Demo Page

Visit `/card-demo` to see all components in action and test their functionality.

## Dependencies

The card selector components depend on:
- `@radix-ui/react-popover` for dropdown functionality
- `@radix-ui/react-command` for searchable command interface
- `lucide-react` for icons
- Tailwind CSS for styling

## Future Enhancements

Potential improvements for future versions:
- Card images/illustrations
- Drag and drop functionality
- Keyboard shortcuts for quick selection
- Card combination presets (pairs, suited connectors, etc.)
- Hand strength indicators
- Integration with poker hand evaluators
