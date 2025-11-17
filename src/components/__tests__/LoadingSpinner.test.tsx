import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render loading spinner", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      "border-4",
      "border-gray-200",
      "border-t-gray-900"
    );
  });
});
