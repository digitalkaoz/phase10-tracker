import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { GameSetup } from "./GameSetup";
import { LocaleContext } from "../i18n/useLocale";
import { TRANSLATIONS } from "../i18n/index";
import type { ReactNode } from "react";

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <LocaleContext.Provider
      value={{ locale: "en", setLocale: () => {}, t: TRANSLATIONS.en }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

async function renderSetup(
  onStart: (names: string[]) => void = vi.fn<(names: string[]) => void>(),
  onBack: () => void = vi.fn<() => void>(),
) {
  const screen = await render(<GameSetup onStart={onStart} onBack={onBack} />, {
    wrapper: Wrapper,
  });
  return { screen, onStart, onBack };
}

describe("GameSetup", () => {
  it("renders the title and subtitle", async () => {
    const { screen } = await renderSetup();
    await expect.element(screen.getByText("New Game")).toBeInTheDocument();
    await expect
      .element(screen.getByText("Enter player names (2\u20136 players)"))
      .toBeInTheDocument();
  });

  it("shows two player inputs by default", async () => {
    const { screen } = await renderSetup();
    await expect
      .element(screen.getByPlaceholder("Player 1"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByPlaceholder("Player 2"))
      .toBeInTheDocument();
    expect(screen.getByPlaceholder("Player 3").elements()).toHaveLength(0);
  });

  it("disables the start button when names are empty", async () => {
    const { screen } = await renderSetup();
    expect(
      screen.getByText("Start Game").element().hasAttribute("disabled"),
    ).toBe(true);
  });

  it("shows hint when fewer than 2 filled names", async () => {
    const { screen } = await renderSetup();
    await expect
      .element(screen.getByText("At least 2 players required"))
      .toBeInTheDocument();
  });

  it("enables start button when both players have names", async () => {
    const { screen } = await renderSetup();
    const inputs = screen.getByRole("textbox").all();

    await inputs[0].fill("Alice");
    await inputs[1].fill("Bob");

    expect(
      screen.getByText("Start Game").element().hasAttribute("disabled"),
    ).toBe(false);
  });

  it("calls onStart with trimmed names", async () => {
    const onStart = vi.fn<(names: string[]) => void>();
    const { screen } = await renderSetup(onStart);
    const inputs = screen.getByRole("textbox").all();

    await inputs[0].fill("Alice");
    await inputs[1].fill("Bob");
    await screen.getByText("Start Game").click();

    expect(onStart).toHaveBeenCalledWith(["Alice", "Bob"]);
  });

  it("adds a player input when clicking + Add Player", async () => {
    const { screen } = await renderSetup();
    await screen.getByText("+ Add Player").click();

    await expect
      .element(screen.getByPlaceholder("Player 3"))
      .toBeInTheDocument();
  });

  it("adds up to 6 players, then hides the add button", async () => {
    const { screen } = await renderSetup();
    const addBtn = screen.getByText("+ Add Player");

    for (let i = 3; i <= 6; i++) {
      await addBtn.click();
      await expect
        .element(screen.getByPlaceholder(`Player ${i}`))
        .toBeInTheDocument();
    }

    expect(screen.getByText("+ Add Player").elements()).toHaveLength(0);
  });

  it("removes a player when clicking the remove button", async () => {
    const { screen } = await renderSetup();
    await screen.getByText("+ Add Player").click();
    await expect
      .element(screen.getByPlaceholder("Player 3"))
      .toBeInTheDocument();

    const removeBtns = screen.getByLabelText("Remove player").all();
    // When 3 players exist, the last remove button is for player 3
    await removeBtns[removeBtns.length - 1].click();

    expect(screen.getByPlaceholder("Player 3").elements()).toHaveLength(0);
  });

  it("does not show remove buttons with only 2 players", async () => {
    const { screen } = await renderSetup();
    expect(screen.getByLabelText("Remove player").query()).toBeNull();
  });

  it("calls onBack when back button is clicked", async () => {
    const onBack = vi.fn<() => void>();
    const { screen } = await renderSetup(undefined, onBack);
    await screen.getByText("Back").click();
    expect(onBack).toHaveBeenCalledOnce();
  });
});
