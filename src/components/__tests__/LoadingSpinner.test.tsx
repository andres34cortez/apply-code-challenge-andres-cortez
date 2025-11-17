import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render loading spinner", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).not.toBeNull();
  });

  it("should have correct styling classes", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).not.toBeNull();
    expect(spinner?.classList.contains("border-4")).toBe(true);
    expect(spinner?.classList.contains("border-gray-200")).toBe(true);
    expect(spinner?.classList.contains("border-t-gray-900")).toBe(true);
    expect(spinner?.classList.contains("rounded-full")).toBe(true);
    expect(spinner?.classList.contains("animate-spin")).toBe(true);
  });
});
