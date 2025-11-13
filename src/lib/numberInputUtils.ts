// Utility functions for number input protection
// Prevents mouse wheel from changing values and other unwanted behaviors

/**
 * Prevents mouse wheel from changing number input values
 * @param event - The wheel event
 */
export const handleNumberInputWheel = (event: React.WheelEvent<HTMLInputElement>) => {
  // Prevent the input value change on wheel
  const target = event.target as HTMLInputElement;
  target.blur(); // Remove focus to prevent scrolling
  event.preventDefault();
};

/**
 * Adds onWheel handler to number input props to prevent scroll changes
 * @param props - Existing input props
 * @returns Props with wheel handler added
 */
export const withNumberInputProtection = (props: any) => ({
  ...props,
  onWheel: handleNumberInputWheel,
});

/**
 * Hook to get protected number input props
 * Usage: const inputProps = useProtectedNumberInput();
 */
export const useProtectedNumberInput = () => ({
  onWheel: handleNumberInputWheel,
});

/**
 * Prevents arrow key increment/decrement on number inputs
 * @param event - The keyboard event
 */
export const handleNumberInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  // Prevent arrow up/down from changing values
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};

/**
 * Complete protection for number inputs (wheel + arrow keys)
 * @returns Props object with all protection handlers
 */
export const useFullNumberInputProtection = () => ({
  onWheel: handleNumberInputWheel,
  onKeyDown: handleNumberInputKeyDown,
});