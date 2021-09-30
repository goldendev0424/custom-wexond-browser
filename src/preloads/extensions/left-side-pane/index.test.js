/*
    Jest file.
    Unit tests for the side pane component.
    It tests that its main functionalities always succeed.
*/
import { toggleSidePane, toggleContentsShrink } from './index';

describe('Test side pane', () => {
  test('The side pane gets opened correctly', () => {
    const result = toggleSidePane(true);
    expect(result).toEqual({isShowed: true, success: true});
  });

  test('The side pane gets closed correctly', () => {
    const result = toggleSidePane(false);
    expect(result).toEqual({isShowed: false, success: true});
  });

  test('Test toggle contents shrink', () => {
    const result = toggleContentsShrink(false);
    expect(result).toEqual(false);
  });
});
