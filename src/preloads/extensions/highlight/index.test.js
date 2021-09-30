/*
    Jest file.
    Unit tests for the highlighter component.
    It tests that its main functionalities always succeed.
*/

import { applyHighlight, removeAllHighlights, toggleColorList, loadHighlights, toggleHighlight } from './index';

describe('Test highlight', () => {
  test('Test that it highlights sentences', () => {
    expect(applyHighlight()).toBe(true);
  });

  test('Test that it removes previous highlights correctly', () => {
    expect(removeAllHighlights()).toBe(true);
  });

  test('Test that the colour palette shows up correctly', () => {
    expect(toggleColorList()).toBe(true);
  });

  test('Test load highlight', () => {
    expect(loadHighlights()).toBe(true);
  });

  test('Test toggle highlight', () => {
    expect(toggleHighlight(false)).toBe(false);
  });
});