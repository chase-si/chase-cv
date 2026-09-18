import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { RecognitionLabShell } from "./recognition-lab-shell";

describe("CubiCasa Recognition Lab Shell (AC-20..AC-24)", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders sample choices, calibration controls, and execution button", () => {
    render(<RecognitionLabShell initialSampleId="sample-1br" />);

    expect(screen.getByText("CubiCasa 识图实验室")).toBeInTheDocument();
    expect(screen.getByText("Standard 1-Bedroom (一室一厅)")).toBeInTheDocument();
    expect(screen.getByText("Family 2-Bedroom (两室一厅)")).toBeInTheDocument();
    expect(screen.getByText("Compact Studio (单身公寓)")).toBeInTheDocument();

    expect(screen.getByTestId("run-inference-button")).toBeInTheDocument();
    expect(screen.getByTestId("calibration-real-length-input")).toBeInTheDocument();
  });

  it("toggles unscaled mode when skip calibration is checked (AC-21)", () => {
    render(<RecognitionLabShell initialSampleId="sample-1br" />);

    const skipToggle = screen.getByTestId("skip-calibration-toggle");
    fireEvent.click(skipToggle);

    expect(screen.getByTestId("unscaled-mode-notice")).toBeInTheDocument();
    expect(
      screen.getByText(/未标定模式：保留相对像素几何/i),
    ).toBeInTheDocument();
  });

  it("runs inference, renders semantic overlay and evaluation metrics (AC-20, AC-22, AC-23)", async () => {
    render(<RecognitionLabShell initialSampleId="sample-1br" />);

    const runBtn = screen.getByTestId("run-inference-button");
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByTestId("evaluation-record-panel")).toBeInTheDocument();
    });

    expect(screen.getByTestId("raw-semantic-elements")).toBeInTheDocument();
    expect(screen.getByTestId("fix-count-walls")).toHaveTextContent("0");
    expect(screen.getByTestId("fix-count-openings")).toHaveTextContent("0");
    expect(screen.getByTestId("fix-count-rooms")).toHaveTextContent("0");
    expect(screen.getByTestId("open-correction-editor-button")).toBeInTheDocument();
  });

  it("transitions to correction editor, allows approval and returns to lab (AC-22, AC-23)", async () => {
    render(<RecognitionLabShell initialSampleId="sample-1br" />);

    fireEvent.click(screen.getByTestId("run-inference-button"));

    await waitFor(() => {
      expect(screen.getByTestId("open-correction-editor-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("open-correction-editor-button"));

    // Should now be in correction editor mode
    expect(screen.getByTestId("return-to-lab-button")).toBeInTheDocument();
    expect(screen.getByTestId("approve-plan-button")).toBeInTheDocument();

    // Click approve
    fireEvent.click(screen.getByTestId("approve-plan-button"));

    // Return to lab
    fireEvent.click(screen.getByTestId("return-to-lab-button"));
    expect(screen.getByText("CubiCasa 识图实验室")).toBeInTheDocument();
  });

  it("handles service unavailability error without crashing editor workflow (AC-24)", async () => {
    render(
      <RecognitionLabShell
        initialSampleId="sample-1br"
        adapterType="http"
        endpoint="http://127.0.0.1:59999/predict"
      />,
    );

    const runBtn = screen.getByTestId("run-inference-button");
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByTestId("inference-error-alert")).toBeInTheDocument();
    });

    expect(
      screen.getByText(/CubiCasa recognition service is currently unavailable/i),
    ).toBeInTheDocument();
  });
});
