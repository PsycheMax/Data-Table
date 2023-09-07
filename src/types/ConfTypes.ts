import { FooterRowData, HeaderRowData } from "./DataTypes.js";
import { CellAlignItemsStates, CellJustifyContentStates, AlignTextValues, VerticalAlignmentValues } from "./ValueTypes.js";

/**
 * # TableConf Object
 * This type describes the expected configuration object for the table.
 *
 * - .*`headerRow`*
 * : a HeaderRowData object, containing the precise data to render a proper header for the table. **Optional**.
 * - .*`hasSettings`*
 * : toggles the presence/absence of a setting button at the right end of the table. **Mandatory**.
 * - .*`hasSubrows`*
 * : toggles the presence/absence of a chevron button at the right end of the table. **Mandatory**.
 * - .*`hasAlerts`*
 * : toggles the presence/absence of an alert button at the right end of the table. **Mandatory**.
 * - .*`hasCustomSettingsCell`*
 * : toggles the customizability of a setting cell for the whole table - a setting cell (where isSettings is true) has to be passed in the header row. **Optional**.
 * - .*`hasCustomThreeDotsCell`*
 * : toggles the customizability of a setting cell for every row in the table - a setting cell (where isSettings is true) has to be passed to every row. **Optional**.
 * - .*`hasCustomAlertCell`*
 * : toggles the customizability of an Alert cell for every row in the table - an Alert cell (where isAlertCellis true) has to be passed to every row. **Optional**.
 *
 * - .*`renderOrder`*
 * : this object contains two objects regulating the rendering order of columns and rows. **Mandatory**
 * >  - .*`columns`*
 *    : this object contains the configurations regulating the render order of the columns. **Mandatory**
 * >    - .*`defaultOrder`*
 *      : this is an array of column-IDs, regulating the render order of the columns. Once set via the conf file, it can't be changed by the end-user, and it's the reference for a table without further settings. **Mandatory**
 * >    - .*`customOrder`*
 *      : this is an array of column-IDs, regulating the render order of the columns. It can be changed via the user interface by the end-user, regulating a custom view-order by the end-user. **Optional**.
 * >    - .*`hiddenIDs`*
 *      : this is an array of column-IDs. All the column-IDs contained in this array will not be rendered. **Optional**.
 * >  - .*`rows`*
 *    : this object contains the configurations regulating the render order of the rows. **Mandatory**
 * >    - .*`defaultOrder`*
 *      : this is an array of rows-IDs, regulating the render order of the rows. Once set via the conf file, it can't be changed by the end-user, and it's the reference for a table without further settings. **Mandatory**
 * >    - .*`customOrder`*
 *        : this is an array of rows-IDs, regulating the render order of the rows. It can be changed via the user interface by the end-user, regulating a custom view-order by the end-user. **Optional**.
 * >    - .*`hiddenIDs`*
 *      : this is an array of rows-IDs. All the rows-IDs contained in this array will not be rendered. **Optional**.
 *
 * - .*`styling`*
 *    : this object contains the optional styling configurations for the table, its rows, columns and cells.  **Optional**.
 * >  - .*`table`*
 *    : this object contains the style settings to apply to the whole table.  **Optional**.
 * >    - .*`areRowsSeparated`*
 *      : this boolean toggles the separatedRows/cardStyled table style variant.  **Optional**.
 * >  - .*`rows`*
 *    : this object contains the style settings to apply to every row.  **Optional**.
 * >    - .*`minHeight`*
 *      : this string is utilized as a value for the minHeight CSS rule, for every row. It needs to include a measurement unit (e.g. px).  **Optional**.
 * >    - .*`maxHeight`*
 *      : this string is utilized as a value for the maxHeight CSS rule, for every row. It needs to include a measurement unit (e.g. px).  **Optional**.
 * >    - .*`alignText`*
 *      : this value regulates the alignText CSS rule, for every row.  **Optional**.
 * >    - .*`verticalAlign`*
 *      : this value regulates the verticalAlign CSS rule, for every row.  **Optional**.
 * >  - .*`column`*
 *    : this object contains the style settings to apply to every column.  **Optional**.
 * >    - .*`minWidth`*
 *      : this string is utilized as a value for the minWidth CSS rule, for every column. It needs to include a measurement unit (e.g. px).  **Optional**.
 * >    - .*`maxWidth`*
 *      : this string is utilized as a value for the maxWidth CSS rule, for every column. It needs to include a measurement unit (e.g. px).  **Optional**.
 * >  - .*`cell`*
 *    : this object contains the style settings to apply to every cell.  **Optional**.
 * >    - .*`alignItems`*
 *      : this value regulates the alignItems CSS rule, for every cell.  **Optional**.
 * >    - .*`justifyContent`*
 *      : this string is utilized as a value for the justifyContent CSS rule, for every cell.  **Optional**.
 */
export type TableConf = {
    headerRow?: HeaderRowData;
    footerRow?: FooterRowData;
    hasSettings?: boolean;
    hasSubrows?: boolean;
    hasAlerts?: boolean;
    hasPreview?: boolean,
    hasCustomSettingsCell?: boolean;
    hasCustomThreeDotsCell?: boolean;
    hasCustomAlertCell?: boolean,
    renderOrder: {
        columns: {
            defaultOrder: Array<string>;
            customOrder?: Array<string>;
            hiddenIDs?: Array<string>;
        };
        rows: {
            defaultOrder: Array<string>;
            customOrder?: Array<string>;
            hiddenIDs?: Array<string>;
        };
    };
    styling?: {
        table?: {
            areRowsSeparated?: boolean;
        };
        rows?: {
            minHeight?: string;
            maxHeight?: string;
            alignText?: AlignTextValues;
            verticalAlign?: VerticalAlignmentValues;
        };
        columns?: {
            maxWidth?: string;
            minWidth?: string;
        };
        cells?: {
            alignItems?: CellAlignItemsStates;
            justifyContent?: CellJustifyContentStates;
            wrapContent?: boolean;
        };
    };
};