import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import type { Locale } from "../i18n/index";

async function renderWithLocale(locale: Locale = "en") {
  const setLocale = vi.fn<(locale: Locale) => void>();
  const screen = await render(
    <LocaleSwitcher locale={locale} setLocale={setLocale} />,
  );
  return { screen, setLocale };
}

describe("LocaleSwitcher", () => {
  it("renders EN and DE buttons", async () => {
    const { screen } = await renderWithLocale();
    await expect.element(screen.getByText("EN")).toBeInTheDocument();
    await expect.element(screen.getByText("DE")).toBeInTheDocument();
  });

  it("highlights the active locale", async () => {
    const { screen } = await renderWithLocale("en");
    const enBtn = screen.getByText("EN");
    const deBtn = screen.getByText("DE");

    expect(enBtn.element().className.includes("bg-p10-accent")).toBe(true);
    expect(deBtn.element().className.includes("bg-p10-accent")).toBe(false);
  });

  it("calls setLocale with 'de' when DE is clicked", async () => {
    const { screen, setLocale } = await renderWithLocale("en");
    await screen.getByText("DE").click();
    expect(setLocale).toHaveBeenCalledWith("de");
  });

  it("calls setLocale with 'en' when EN is clicked in German mode", async () => {
    const { screen, setLocale } = await renderWithLocale("de");
    await screen.getByText("EN").click();
    expect(setLocale).toHaveBeenCalledWith("en");
  });
});
