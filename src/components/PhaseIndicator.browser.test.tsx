import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { PhaseIndicator, PhaseLabel } from "./PhaseIndicator";
import { LocaleContext } from "../i18n/useLocale";
import { TRANSLATIONS } from "../i18n/index";
import type { ReactNode } from "react";

function enWrapper({ children }: { children: ReactNode }) {
  return (
    <LocaleContext.Provider
      value={{ locale: "en", setLocale: () => {}, t: TRANSLATIONS.en }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

function deWrapper({ children }: { children: ReactNode }) {
  return (
    <LocaleContext.Provider
      value={{ locale: "de", setLocale: () => {}, t: TRANSLATIONS.de }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

describe("PhaseIndicator", () => {
  it("renders 10 phase indicators in default mode", async () => {
    const screen = await render(<PhaseIndicator currentPhase={1} />, {
      wrapper: enWrapper,
    });
    for (let i = 1; i <= 10; i++) {
      await expect
        .element(screen.getByText(String(i), { exact: true }))
        .toBeInTheDocument();
    }
  });

  it("marks phases 1..currentPhase-1 as completed", async () => {
    const screen = await render(<PhaseIndicator currentPhase={4} />, {
      wrapper: enWrapper,
    });
    const phase1 = screen.getByText("1", { exact: true });
    expect(phase1.element().className.includes("bg-p10-accent")).toBe(true);

    const phase4 = screen.getByText("4", { exact: true });
    expect(phase4.element().className.includes("border-p10-accent")).toBe(true);

    const phase5 = screen.getByText("5", { exact: true });
    expect(phase5.element().className.includes("bg-p10-surface-2")).toBe(true);
  });

  it("shows all completed when currentPhase is 11", async () => {
    const screen = await render(<PhaseIndicator currentPhase={11} />, {
      wrapper: enWrapper,
    });
    for (let i = 1; i <= 10; i++) {
      const phase = screen.getByText(String(i), { exact: true });
      expect(phase.element().className.includes("bg-p10-accent")).toBe(true);
    }
  });

  it("renders compact mode with bars and titles", async () => {
    const screen = await render(<PhaseIndicator currentPhase={3} compact />, {
      wrapper: enWrapper,
    });
    for (let i = 1; i <= 10; i++) {
      await expect
        .element(
          screen.getByTitle(
            `Phase ${i}: ${TRANSLATIONS.en.phaseDescriptions[i]}`,
          ),
        )
        .toBeInTheDocument();
    }
  });

  it("compact mode applies correct bar styling", async () => {
    const screen = await render(<PhaseIndicator currentPhase={3} compact />, {
      wrapper: enWrapper,
    });
    const bar1 = screen.getByTitle(
      `Phase 1: ${TRANSLATIONS.en.phaseDescriptions[1]}`,
    );
    expect(bar1.element().className.includes("bg-p10-accent")).toBe(true);

    const bar3 = screen.getByTitle(
      `Phase 3: ${TRANSLATIONS.en.phaseDescriptions[3]}`,
    );
    expect(bar3.element().className.includes("bg-p10-accent-light")).toBe(true);

    const bar4 = screen.getByTitle(
      `Phase 4: ${TRANSLATIONS.en.phaseDescriptions[4]}`,
    );
    expect(bar4.element().className.includes("bg-p10-surface-2")).toBe(true);
  });
});

describe("PhaseLabel", () => {
  it("shows phase number and description for active phases", async () => {
    const screen = await render(<PhaseLabel phase={5} />, {
      wrapper: enWrapper,
    });
    await expect.element(screen.getByText("Phase 5")).toBeInTheDocument();
    await expect.element(screen.getByText("1 run of 8")).toBeInTheDocument();
  });

  it("shows All Done when phase is 11", async () => {
    const screen = await render(<PhaseLabel phase={11} />, {
      wrapper: enWrapper,
    });
    await expect.element(screen.getByText("All Done!")).toBeInTheDocument();
  });

  it("shows German Alles geschafft! when locale is de", async () => {
    const screen = await render(<PhaseLabel phase={11} />, {
      wrapper: deWrapper,
    });
    await expect
      .element(screen.getByText("Alles geschafft!"))
      .toBeInTheDocument();
  });
});
