import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CardCalculator } from "./CardCalculator";
import { emptyCardCount } from "../utils/scoring";
import type { CardCount, CardType } from "../types/game";
import type { ReactNode } from "react";
import { LocaleContext } from "../i18n/useLocale";
import { TRANSLATIONS } from "../i18n/index";

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <LocaleContext.Provider
      value={{ locale: "en", setLocale: () => {}, t: TRANSLATIONS.en }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

async function renderCalculator(
  cards: CardCount = emptyCardCount(),
  onUpdate: (type: CardType, delta: number) => void = vi.fn<
    (type: CardType, delta: number) => void
  >(),
) {
  const screen = await render(
    <CardCalculator cards={cards} onUpdate={onUpdate} />,
    { wrapper: Wrapper },
  );
  return { screen, onUpdate };
}

function CardCalculatorWithState() {
  const [cards, setCards] = useState<CardCount>(emptyCardCount());
  const [lastAction, setLastAction] = useState<{
    type: CardType;
    delta: number;
  } | null>(null);
  const handleUpdate = (type: CardType, delta: number) => {
    setCards((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
    setLastAction({ type, delta });
  };
  return (
    <div>
      <CardCalculator cards={cards} onUpdate={handleUpdate} />
      {lastAction && (
        <div data-testid="last-action">
          {lastAction.type}:{lastAction.delta}
        </div>
      )}
    </div>
  );
}

describe("CardCalculator", () => {
  it("renders all four card type rows", async () => {
    const { screen } = await renderCalculator();
    for (const label of ["1\u20139", "10\u201312", "Skip", "Wild"]) {
      await expect.element(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("disables minus buttons when count is 0", async () => {
    const { screen } = await renderCalculator();
    const minusBtns = screen.getByText("\u2212").all();
    for (const btn of minusBtns) {
      expect(btn.element().hasAttribute("disabled")).toBe(true);
    }
  });

  it("enables minus buttons after incrementing via stateful wrapper", async () => {
    const screen = await render(<CardCalculatorWithState />, {
      wrapper: Wrapper,
    });
    const plusBtns = screen.getByText("+").all();
    const minusBtns = screen.getByText("\u2212").all();

    // Initial state: all minus disabled
    for (const btn of minusBtns) {
      expect(btn.element().hasAttribute("disabled")).toBe(true);
    }

    await plusBtns[0].click();

    // After click, low minus should be enabled
    expect(minusBtns[0].element().hasAttribute("disabled")).toBe(false);
  });

  it("calls onUpdate for each card type via its + button", async () => {
    const { screen, onUpdate } = await renderCalculator();
    const plusBtns = screen.getByText("+").all();

    for (const btn of plusBtns) {
      await btn.click();
    }

    expect(onUpdate).toHaveBeenCalledTimes(4);
    expect(onUpdate).toHaveBeenNthCalledWith(1, "low", 1);
    expect(onUpdate).toHaveBeenNthCalledWith(2, "high", 1);
    expect(onUpdate).toHaveBeenNthCalledWith(3, "skip", 1);
    expect(onUpdate).toHaveBeenNthCalledWith(4, "wild", 1);
  });

  it("calls onUpdate with -1 when minus is clicked", async () => {
    const cards: CardCount = { low: 3, high: 1, skip: 1, wild: 1 };
    const { screen, onUpdate } = await renderCalculator(cards);
    const minusBtns = screen.getByText("\u2212").all();

    await minusBtns[0].click();
    expect(onUpdate).toHaveBeenCalledWith("low", -1);
  });

  it("displays current card counts with exact text matching", async () => {
    const cards: CardCount = { low: 2, high: 0, skip: 1, wild: 3 };
    const { screen } = await renderCalculator(cards);

    await expect
      .element(screen.getByText("2", { exact: true }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("1", { exact: true }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("3", { exact: true }))
      .toBeInTheDocument();
  });

  it("displays ptsEach for each card type", async () => {
    const { screen } = await renderCalculator();
    // Use exact matching to avoid "15" appearing in "15 pts each"
    for (const pts of [
      "5 pts each",
      "10 pts each",
      "15 pts each",
      "25 pts each",
    ]) {
      await expect
        .element(screen.getByText(pts, { exact: true }))
        .toBeInTheDocument();
    }
  });
});
