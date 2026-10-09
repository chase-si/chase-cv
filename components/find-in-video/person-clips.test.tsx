import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PersonResult } from "@/lib/find-in-video/analysis-run";
import messages from "@/messages/en.json";
import { PersonClips } from "./person-clips";

const person: PersonResult = { id: "a", name: "Alice", filename: "Alice.jpg", hit_seconds: [2, 4, 10],
  segments: [{ start_seconds: 2, end_seconds: 4 }, { start_seconds: 10, end_seconds: 10 }] };

afterEach(cleanup);

function setup(disabled = false, people = [person]) {
  const onSeek = vi.fn();
  const onExport = vi.fn();
  const ui = (locked: boolean, run = "first") => (
    <NextIntlClientProvider locale="en" messages={messages}>
      {people.map((item) => <PersonClips key={`${run}-${item.id}`} person={item} duration={20}
        disabled={locked} playerReady onSeek={onSeek} onExport={onExport} />)}
    </NextIntlClientProvider>
  );
  return { ...render(ui(disabled)), onSeek, onExport, ui };
}

describe("person clip selection", () => {
  it("selects every safety range initially and separates playing from selection", () => {
    const { onSeek, onExport } = setup();
    const checks = screen.getAllByRole("checkbox");
    checks.forEach((check) => expect(check).toBeChecked());
    expect(screen.getByText("2 selected · about 6.0s")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Play 00:01–00:05" }));
    expect(onSeek).toHaveBeenCalledWith({ start_seconds: 1, end_seconds: 5 });
    expect(checks[0]).toBeChecked();
    fireEvent.click(checks[0]);
    expect(onSeek).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Download joined clips" }));
    expect(onExport).toHaveBeenCalledWith([{ start_seconds: 9, end_seconds: 11 }]);
  });

  it("clears, selects all, locks modifications during export, and resets for a new run", () => {
    const { rerender, ui } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(screen.getByRole("button", { name: "Download joined clips" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Select all" }));
    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
    rerender(ui(true));
    screen.getAllByRole("checkbox").forEach((check) => expect(check).toHaveAttribute("aria-disabled", "true"));
    expect(screen.getByRole("button", { name: "Clear selection" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Download joined clips" })).toBeDisabled();
    rerender(ui(false));
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    rerender(ui(false, "new"));
    screen.getAllByRole("checkbox").forEach((check) => expect(check).toBeChecked());
  });

  it("keeps people's selections independent and handles unmatched people", () => {
    setup(false, [person, { ...person, id: "b", name: "Bob" }, { ...person, id: "c", name: "Carol", hit_seconds: [], segments: [] }]);
    fireEvent.click(within(screen.getByLabelText("Clips for Alice")).getByRole("button", { name: "Clear selection" }));
    within(screen.getByLabelText("Clips for Bob")).getAllByRole("checkbox").forEach((check) => expect(check).toBeChecked());
    expect(within(screen.getByLabelText("Clips for Carol")).getByText("Not found")).toBeVisible();
    expect(within(screen.getByLabelText("Clips for Carol")).queryByRole("button", { name: "Download joined clips" })).toBeNull();
  });
});
