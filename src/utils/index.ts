import { v4 } from 'uuid';
import type {
  InteractionEventCodes,
  InteractionKeys,
} from '../types/ValueTypes.js';
import { RenderedRowObject } from '../types/RenderTypes.js';

const allowedKeys: Array<InteractionKeys> = [' ', 'Enter'];
const allowedEventCodes: Array<InteractionEventCodes> = ['Space', 'Enter'];

/**
 * Checks the key/code of the KeyboardEvent, fired by the user interacting with an interactable element, belongs to the commonly utilized interaction keys (e.g. Space/Enter).
 * @param e KeyboardEvent. Its key/code is checked against a list of values that can execute functions.
 * @param callback The function to execute in case the key/code check returns a true value.
 */
export function checkIfKeyEventIsAllowed(
  e: KeyboardEvent,
  callback: Function
): void {
  if (
    allowedKeys.includes(e.key as InteractionKeys) ||
    allowedEventCodes.includes(e.code as InteractionEventCodes)
  ) {
    callback();
  }
}

export function generateID(): string {
  return v4();
}

/**
 * This function sorts the first array of RenderedRowsObjects, according to the order of the IDs in the second array (of strings, in this case).
 * @param rowsToSort : Array<RenderedRowObject> - the array to sort. Please note that although the sort method is used, the array will remain unmodified.
 * @param idsArrayToSortBy : Array<string> - the array of strings to use to sort the first one. This array will remain unaffected.
 * @returns an Array<RenderedRowObject> with the same content of rowsToSort, but ordered according to idsArrayToSortBy.
 */
export function sortRowsByIdsArray(
  rowsToSort: Array<RenderedRowObject>,
  idsArrayToSortBy: Array<string>
): Array<RenderedRowObject> {
  // The method sort is called on a temporary array, called via the spread operator, to ensure that the "rowsToSort" array is not modified, as it's considered bad practice to do so.
  const toReturn = [...rowsToSort].sort(
    (a, b) => idsArrayToSortBy.indexOf(a.id) - idsArrayToSortBy.indexOf(b.id)
  );
  return toReturn;
}
