import { IDataCellEntry } from '../interfaces/IDataCellEntry.js';
import { CellValues } from './ValueTypes.js';

/**
 * The PreviewRowData object is used to identify a specific kind of subrow, the preview one.
 */
export type PreviewRowData = {
  id: string;
  parentID: string;
  isHidden: boolean;
};

/**
 * ## RowData
 * This type represents a single row of the table, and keeps track of its most important data: the entire row's id, its cells (their data), whether or not it's been hidden by the end-user, and its eventual subrows.
 * This data type can be used by the developers to make sure that the data they pass down to the table is renderable and organized in the best possible way - ad customizable with adhoc properties.
 */
export type RowData = {
  id: string;
  cells?: {
    [key: string]: IDataCellEntry;
  };
  isHidden?: boolean;
  subRows?: Array<RowData>;
  areSubRowsOpen?: boolean;
  previewRow?: PreviewRowData;
  hasAlertsToShow?: boolean;
  rowOnAlertClickFunction?: Function;
  rowOnThreeDotsFunction?: Function;
  rowPreChevronFunction?: Function;
  rowOnChevronFunction?: Function;
  hasCustomSubrowContent?: boolean;
  isChevronHidden?: boolean;
};

/**
 * The HeaderCell type implements various toggles for functionalities that can't be implemented on a regular cell - namely:
 * isSortable, isDraggable
 */
export type HeaderCell = {
  property: string;
  value: CellValues;
  id: string;
  isCopiable?: boolean;
  isSortable?: boolean;
  isDraggable?: boolean;
  isPropertyInCopyOutput?: boolean;
  isHidden?: boolean;
  isChevron?: boolean;
  isAlert?: boolean;
  isSettings?: boolean;
  onSortInteractionFunction?: Function;
  onAlertInteractionFunction?: Function;
  onCopyInteractionFunction?: Function;
  onRearrangeInteractionFunction?: Function;
};

/**
 * The FooterCell type is a shorter version of a DataCell, to be used exlusively in the table footer row.
 */
export type FooterCell = {
  property: string;
  value: CellValues;
  id: string;
  isCopiable?: boolean;
  isPropertyInCopyOutput?: boolean;
  isHidden?: boolean;
  onCopyInteractionFunction?: Function;
};

/**
 * The HeaderRowData is a special kind of RowData, accepting exclusively the HeaderCell kind of cell.
 */
export type HeaderRowData = {
  id: string;
  cells: {
    [key: string]: HeaderCell;
  };
};

/**
 * The FooterRowData is a special kind of RowData, accepting exclusively the FooterCellData kind of cell.
 */
export type FooterRowData = {
  id: string;
  cells: {
    [key: string]: FooterCell;
  };
};

/**
 * ## TableData
 * This is the data that has to be passed down to the table component: an array of rows (without the header row, to be passed down as a different object)
 */
export type TableData = Array<RowData>;
