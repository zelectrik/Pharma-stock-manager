import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("App", () => {
  it("should render title", () => {
    render(<App />);
    expect(screen.getByText(/Pharma Stock Manager/i)).toBeInTheDocument();
  });
});
