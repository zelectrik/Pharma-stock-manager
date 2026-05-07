import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AlertBadge from "../../src/components/AlertBadge";

describe("AlertBadge", () => {
  it("should render OK label", () => {
    render(<AlertBadge alert="OK" />);

    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("should render low stock label", () => {
    render(<AlertBadge alert="LOW_STOCK" />);

    expect(screen.getByText("Low stock")).toBeInTheDocument();
  });

  it("should render expiring soon label", () => {
    render(<AlertBadge alert="EXPIRING_SOON" />);

    expect(screen.getByText("Expiring soon")).toBeInTheDocument();
  });
});
