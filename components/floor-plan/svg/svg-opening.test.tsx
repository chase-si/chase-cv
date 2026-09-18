import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { getVertexMap } from "@/lib/floor-plan/geometry";
import { SvgOpening } from "./svg-opening";

afterEach(() => {
  cleanup();
});

describe("SvgOpening Component (AC-9)", () => {
  const vertexMap = getVertexMap(VALID_STANDARD_FLOOR_PLAN);
  const door1 = VALID_STANDARD_FLOOR_PLAN.openings.find((o) => o.id === "door1")!;
  const doorWall = VALID_STANDARD_FLOOR_PLAN.walls.find((w) => w.id === door1.wallId)!;

  const win1 = VALID_STANDARD_FLOOR_PLAN.openings.find((o) => o.id === "win1")!;
  const winWall = VALID_STANDARD_FLOOR_PLAN.walls.find((w) => w.id === win1.wallId)!;

  it("renders door opening without door leaf or swing arc (AC-9)", () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <svg>
        <SvgOpening
          opening={door1}
          wall={doorWall}
          vertexMap={vertexMap}
          selectedEntity={null}
          onSelect={handleSelect}
        />
      </svg>,
    );

    const openingGroup = screen.getByTestId("floor-plan-opening-door1");
    expect(openingGroup).toBeInTheDocument();
    expect(openingGroup).toHaveAttribute("data-entity-type", "opening");
    expect(openingGroup).toHaveAttribute("data-selected", "false");

    // Per AC-9: No door leaf or swing is rendered!
    // Swing arcs use <path d="... A ..."> or dashed paths
    const pathElements = container.querySelectorAll("path");
    expect(pathElements.length).toBe(0);

    // No hinge circles or swing circles
    const circleElements = container.querySelectorAll("circle");
    expect(circleElements.length).toBe(0);

    // Clear opening cutout and frame/jambs are rendered
    const polygons = container.querySelectorAll("polygon");
    expect(polygons.length).toBeGreaterThanOrEqual(1);

    // Jambs / frame lines
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });

  it("renders window opening with frame and sill/glass indicator", () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <svg>
        <SvgOpening
          opening={win1}
          wall={winWall}
          vertexMap={vertexMap}
          selectedEntity={null}
          onSelect={handleSelect}
        />
      </svg>,
    );

    const winGroup = screen.getByTestId("floor-plan-opening-win1");
    expect(winGroup).toBeInTheDocument();

    // Window has cutout mask + frame polygon + glass lines
    const polygons = container.querySelectorAll("polygon");
    expect(polygons.length).toBeGreaterThanOrEqual(2);

    const lines = container.querySelectorAll("line");
    expect(lines.length).toBe(2); // Glass lines
  });

  it("applies selected state when entity is selected", () => {
    const handleSelect = vi.fn();
    render(
      <svg>
        <SvgOpening
          opening={door1}
          wall={doorWall}
          vertexMap={vertexMap}
          selectedEntity={{ type: "opening", id: "door1" }}
          onSelect={handleSelect}
        />
      </svg>,
    );

    const openingGroup = screen.getByTestId("floor-plan-opening-door1");
    expect(openingGroup).toHaveAttribute("data-selected", "true");
  });

  it("triggers onSelect callback when clicked", () => {
    const handleSelect = vi.fn();
    render(
      <svg>
        <SvgOpening
          opening={door1}
          wall={doorWall}
          vertexMap={vertexMap}
          selectedEntity={null}
          onSelect={handleSelect}
        />
      </svg>,
    );

    fireEvent.click(screen.getByTestId("floor-plan-opening-door1"));
    expect(handleSelect).toHaveBeenCalledWith({ type: "opening", id: "door1" });
  });
});
