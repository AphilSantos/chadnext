export interface Card {
  id: string;
  value: string;
  suit: string;
  symbol: string;
  displayName: string;
  color: "red" | "black";
}

export const SUITS = {
  HEARTS: { symbol: "♥", name: "Hearts", color: "red" as const },
  DIAMONDS: { symbol: "♦", name: "Diamonds", color: "red" as const },
  CLUBS: { symbol: "♣", name: "Clubs", color: "black" as const },
  SPADES: { symbol: "♠", name: "Spades", color: "black" as const },
} as const;

export const VALUES = [
  { value: "A", name: "Ace" },
  { value: "2", name: "2" },
  { value: "3", name: "3" },
  { value: "4", name: "4" },
  { value: "5", name: "5" },
  { value: "6", name: "6" },
  { value: "7", name: "7" },
  { value: "8", name: "8" },
  { value: "9", name: "9" },
  { value: "10", name: "10" },
  { value: "J", name: "Jack" },
  { value: "Q", name: "Queen" },
  { value: "K", name: "King" },
] as const;

export const FULL_DECK: Card[] = VALUES.flatMap(({ value, name }) =>
  Object.entries(SUITS).map(([suitKey, suit]) => ({
    id: `${value}${suitKey}`,
    value,
    suit: suitKey,
    symbol: suit.symbol,
    displayName: `${name} of ${suit.name}`,
    color: suit.color,
  }))
);

export const getCardById = (id: string): Card | undefined => {
  return FULL_DECK.find((card) => card.id === id);
};

export const getCardByValueAndSuit = (
  value: string,
  suit: string
): Card | undefined => {
  return FULL_DECK.find((card) => card.value === value && card.suit === suit);
};

export const formatCardDisplay = (card: Card): string => {
  return `${card.value}${card.symbol}`;
};

export const parseCardString = (cardString: string): Card | null => {
  // Handle formats like "A♠", "AS", "10♥", "10H"
  const match = cardString.match(/^([A2-9JQK]|10)([♥♦♣♠]|[HDCS])$/);
  if (!match) return null;

  const value = match[1];
  const suitSymbol = match[2];

  // Convert suit symbols to suit keys
  const suitMap: Record<string, string> = {
    "♥": "HEARTS",
    H: "HEARTS",
    "♦": "DIAMONDS",
    D: "DIAMONDS",
    "♣": "CLUBS",
    C: "CLUBS",
    "♠": "SPADES",
    S: "SPADES",
  };

  const suit = suitMap[suitSymbol];
  if (!suit) return null;

  return getCardByValueAndSuit(value, suit) || null;
};

export const getAvailableCards = (excludedCards: Card[]): Card[] => {
  const excludedIds = new Set(excludedCards.map((card) => card.id));
  return FULL_DECK.filter((card) => !excludedIds.has(card.id));
};
