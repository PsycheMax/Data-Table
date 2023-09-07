import { CellJustifyContentStates, CellAlignItemsStates } from "../types/ValueTypes.js";

/**
 * # interface IDataCellEntry
 * 
 * ## Key Props
 * ### **Mandatory**
 * - .*`property`*
 * : `string` used to associate the cell to a column. **Mandatory**
 * - .*`value`*
 * : `string` | `number` | `boolean` used by sorting mechanism to sort the columns in ascending/descending order. **Mandatory**
 * - .*`id`*
 * : `string` used by the rendering mechanism and the slotting mechanism. **Mandatory**
 * 
 * ## Styling Props
 * ### **Optional**
 * - .*`justifyContent`*
 * : `string` of `CellJustifyContentState` - controls the justify-content value of the rendered cell.
 * - .*`alignItems`*
 * : `string` of `CellAlignItemsState` - controls the align-items value of the rendered cell.
 * - .*`doesWrap`*
 * : `boolean` - toggles the wrapping of cell content.
 * 
 * ## Feature controlling Props
 * ### **Optional**
 * - .*`isCopiable`*
 * : `boolean` - Toggles the presence of a copy button when hovering the cell.
 * - .*`isPropertyInCopyOutput`*
 * : `boolean` - Toggles the presence of the cell's property in the copy output.
 * - .*`isIDInCopyOutput`*
 * : `boolean` - Toggles the presence of the cell's ID in the copy output.
 * - .*`isHidden`*
 * : `boolean` - Toggles the rendering of the cell's content in the DOM - if unset, it'll be controlled by the component.
 * - .*`isDraggable`*
 * : `boolean` - Toggles the presence of a drag-handle in the cell.
 * 
 * ## Inferred Props, not to be set manually unless a custom behavior is expected.
 * ### **Optional**
 * - .*`parentID`*
 * : `string` - the id of the parent row - used by the rendering mechanism and the slotting mechanism.
 * - .*`isInHeaderRow`*
 * : `boolean` - Indicates whether the cell has to be rendered as a Header cell.
 * - .*`isInSubrow`*
 * : `boolean` - Indicates whether the cell has to be rendered as a subrow cell.
 * - .*`isInFooterRow`*
 * : `boolean` - Indicates whether the cell has to be rendered as a footer cell.
 * - .*`hasSortIcon`*
 * : `boolean` - Toggles the presence of a sorting icon (only rendered if isInHeader = true).
 * - .*`isSettingsCell`*
 * : `boolean` - Used by the rendering mechanism to control the cell's content - if true, it renders either a `cog` button or a `more` button.
 * - .*`isAlert`*
 * : `boolean` - Used by the rendering mechanism to control the cell's content - if true, it renders an `alert` button.
 * - .*`isChevronCell`*
 * : `boolean` - Used by the rendering mechanism to control the cell's content - if true, it renders an `chevron` button (facing the correct direction).
 
 * ## Custom Inferred Props, not to be set manually.
 * ### **Optional**
 * - .*`hasCustomSettingsCellContent`*
 * : `boolean` - Deactivates the rendering of a default settings content, in lieu of the slotted content received in the Data object.
 * - .*`hasCustomThreeDotsCellContent`*
 * : `boolean` - Deactivates the rendering of a default three dots content, in lieu of the slotted content received in the Data object.
 * - .*`hasCustomAlertCellContent`*
 * : `boolean` - Deactivates the rendering of a default alert content, in lieu of the slotted content received in the Data object.
 *
 * ## Callback on button-clicks.
 * ### **Optional**
 * - .*`onCopyClick`*
 * : `Function` - This callback is executed when onClick and onKeyUp events are fired by the (optional) copy button.
 * - .*`onAlertClick`*
 * : `Function` - This callback is executed when onClick and onKeyUp events are fired by the (optional) alert button.
 * - .*`onThreeDotsClick`*
 * : `Function` - This callback is executed when onClick and onKeyUp events are fired by the (optional) threeDots button.
 * - .*`onChevronClick`*
 * : `Function` - This callback is executed when onClick and onKeyUp events are fired by the (optional) chevron button.
 */
export interface IDataCellEntry {
    property: string;
    value: string | number | boolean;
    id: string;
    // Styling properties
    justifyContent?: CellJustifyContentStates;
    alignItems?: CellAlignItemsStates;
    doesWrap?: boolean;
    // Feature controlling properties
    isCopiable?: boolean;
    isPropertyInCopyOutput?: boolean;
    isIDInCopyOutput?: boolean;
    isHidden?: boolean;
    isDraggable?: boolean;
    // Inferred properties, not to be set manually unless a custom behavior is expected.
    parentID?: string;
    isInHeaderRow?: boolean;
    isInSubrow?: boolean;
    isInFooterRow?: boolean;
    hasSortIcon?: boolean;
    isSettingsCell?: boolean;
    isAlertCell?: boolean;
    isChevronCell?: boolean;
    // These are automatically set when a settings, three dots or alert custom cell is declared in a row.
    hasCustomSettingsCellContent?: boolean;
    hasCustomThreeDotsCellContent?: boolean;
    hasCustomAlertCellContent?: boolean;
    // Callbacks
    onCopyClick?: Function;
    onAlertClick?: Function;
    onThreeDotsClick?: Function;
    onChevronClick?: Function;
}

export default IDataCellEntry;