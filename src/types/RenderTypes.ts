import { TemplateResult } from "lit";
import { RowData } from "./DataTypes.js";

/**
 * The most basic rendering type - it identifies a renderedCell.
 * 
 * Used by the *RenderedRowObject* type to keep track of every single cell. The three values it contains are used by the sorting algorhytm and the value-copy functions (e.g. clicking the copy icon).
 */
export type RenderedCellObject = {
    id?: string;
    property: string;
    value: string | string[] | number | number[] | boolean | null;
};

/**
 * Identifies a specific kind of RenderedDataRow, a subrow one.
 */
export type RenderedSubRowObject = {
    subRowData: RowData;
    isHidden: boolean;
    parentID: string;
    subRowResult: TemplateResult;
    hasSettings?: boolean;
    hasAlert?: boolean;
};

/**
 * In case a preview row is rendered, this is filled with the relative data.
 */
export type RenderedPreviewRowObject = {
    content: TemplateResult;
    isHidden: boolean;
    parentID: string;
    id: string;
}

/**
 * Used by the table to keep track of the rendered data for each row, an array of objects of this type is the rendered output of the table's rendering method.
 */
export type RenderedRowObject = {
    id: string;
    result: TemplateResult;
    cellObjects: Array<RenderedCellObject>;
    rowData: RowData;
    isHeader: boolean;
    hasSubrows: boolean;
    hasPreview: boolean;
    subRows?: Array<RenderedSubRowObject>;
    hasSettings?: boolean;
    hasAlert?: boolean;
    preview?: RenderedPreviewRowObject;
};