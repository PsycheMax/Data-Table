import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAll, state } from 'lit/decorators.js';
import { DataCell } from '../DataCell/DataCell.js';
import DataCellStyles from '../DataCell/DataCellStyles.js';
import DataRowStyles from '../DataRow/DataRowStyles.js';
import DataTableStyles from '../DataTable/DataTableStyles.js';
import {
  FooterCell,
  HeaderCell,
  RowData,
  TableData,
} from '../types/DataTypes.js';
import { TableConf } from '../types/ConfTypes.js';
import { generateID, sortRowsByIdsArray } from '../utils/index.js';
import {
  RenderedCellObject,
  RenderedRowObject,
  RenderedSubRowObject,
} from '../types/RenderTypes.js';
import { AdditionalColumnProperties } from '../types/ValueTypes.js';
import { IDataCellEntry } from '../interfaces/IDataCellEntry.js';
import '../DataTableIcon/DataTableIcon.js';

export class DataTable extends LitElement {
  static styles = [DataCellStyles, DataRowStyles, DataTableStyles];

  /**
   * The data passed to the component - it must comply with the IDataCellEntry interface.
   */
  @property({ attribute: false })
  data: TableData = [];

  /**
   * The configuration object to pass to this component - it can be changed via end-user interaction. For more info on it, check the documentation in the type.ts file, and/or the storybook.
   */
  @property({ attribute: false })
  conf: TableConf = {
    headerRow: {
      id: 'headerRow',
      cells: {},
    },
    renderOrder: {
      columns: {
        defaultOrder: [],
        customOrder: [],
        hiddenIDs: [],
      },
      rows: {
        defaultOrder: [],
        customOrder: [],
        hiddenIDs: [],
      },
    },
  };

  @property({ type: String, attribute: 'id', reflect: true })
  tableID = generateID();

  /**
   * This array of RenderedRowObjects keeps track of the order the rows are rendered in.
   */
  @state()
  private renderedRows: Array<RenderedRowObject> = [];

  /**
   * Populated on the first update, this internal property is a shorthand selector for all the cells belonging to the same column.
   */
  @state()
  private renderedColumns:
    | {
        [key: string]: {
          columnID: string;
          columnCellsIDs: Array<string>;
        };
      }
    | undefined;

  /**
   * Shorthand selector for all the rendered cells contained in the table.
   */
  @queryAll('data-cell')
  // eslint-disable-next-line no-undef
  private renderedCells: NodeListOf<DataCell> | undefined;

  /**
   * On the first update, the following state is populated with the correct value. If no values are passed at the relative conf object key, they're populated on the first render.
   */
  @state()
  private isRowDefaultOrderExternal?: boolean;

  /**
   * On the first update, the following state is populated with the correct value. If no values are passed at the relative conf object key, they're populated on the first render.
   */
  @state()
  private isColumnDefaultOrderExternal?: boolean;

  /**
   * On every update the following states are re-checked, to make sure that the latest custom-order is used.
   */
  @state()
  private isRowCustomOrderExternal?: boolean;

  /**
   * On every update the following states are re-checked, to make sure that the latest custom-order is used.
   */
  @state()
  private isColumnCustomOrderExternal?: boolean;

  /**
   * The following internal state keeps track of whether or not the property utilized by the sorting mechanism has been utilized (flipping the order on its head, in case the value is true).
   */
  @state()
  private hasAlreadySorted: { [key: string]: boolean } = {};

  /**
   * The following internal state keeps track of whether or not the (eventual) subrows have been opened or not.
   */
  @state()
  isSubrowOpen: { [key: string]: boolean } = {};

  /**
   * The following internal state keeps track of the order of the additional properties rendered at the end of every column (if data is available to do so).
   * If they're present, and at least a single row has valid data for it, an empty column is rendered in the right place.
   */
  @state()
  private additionalColumnsProperties: Array<AdditionalColumnProperties> = [
    'data-table-alerts',
    'data-table-chevron',
    'data-table-settings',
  ];

  /**
   * The following callback is executed on every table settings icon click (the cog in the top right).
   */
  @property({ attribute: false })
  onTableSettingsClickFunction?: Function;

  /**
   * The following callback sets a default behavior for the whole table, executed on every three-dots button click. A more specific, per row, interaction can be set via the data/conf props.
   */
  @property({ attribute: false })
  onTableAlertClickFunction?: Function;

  /**
   * The following callback sets a default behavior for the whole table, executed on every alert click. A more specific, per row, interaction can be set via the data/conf props.
   */
  @property({ attribute: false })
  onTableThreeDotsClickFunction?: Function;

  /**
   * PLEASE avoid using this as much as possible, as it removes the automated subrows behavior. In case you set this, the subrows HAVE to be shown via the `toggleSubrows` function.
   * The following callback sets a default behavior for the whole table, executed on every chevron click. A more specific, per row, interaction can be set via the data/conf props.
   */
  @property({ attribute: false })
  onTableChevronClickFunction?: Function;

  /**
   * The following callback sets a default behavior for the whole table, executed before every chevron click. A more specific, per row, interaction can be set via the data/conf props.
   */
  @property({ attribute: false })
  preTableChevronClickFunction?: Function;

  /**
   * This function reorders the rows based on the values of the propertyToReorderBy param. It can also output the results in an inverted fashion.
   * This function automatically forces a componentUpdate, since it modifies the component prop renderedRows.
   * @param propertyToReorderBy : string. The name of the property, whose corresponding value is used to reorder the renderedRows array.
   * @param inverted : boolean. If true, the results are decreasing (from the biggest one to the smallest one). It defaults to false.
   * @returns void
   */
  reorderRenderedRows(propertyToReorderBy: string, inverted = false): void {
    // An intermediate array is created, containing new {index,value} objects. The index outputted is the index inside this.renderedRows, the value is the propertyToReorderBy value.
    const intermediateArray = this.renderedRows.map((row, index) => {
      const targetCell = row.cellObjects.filter(
        (element: RenderedCellObject) =>
          element.property === propertyToReorderBy
      )[0];
      const value = targetCell.value ?? '-';
      const rowID = row.id;
      return { index, value, rowID };
    });

    // The values in the intermediate array are sorted - this should be less resource heavy than using the actual array.
    intermediateArray.sort((a, b) => {
      if (a.value && b.value && a.value > b.value) return 1;
      if (a.value === null || b.value === null || a.value < b.value) return -1;
      // In all other cases, leave the order unchanged.
      return 0;
    });
    // If the inverted argument is set to true, then the results are flipped.
    if (inverted) intermediateArray.reverse();
    // The "conf.renderOrder.rows.customOrder" array is emptied, before getting filled with the new ids indicating the new cutomOrder.
    this.conf.renderOrder.rows.customOrder = [];
    intermediateArray.forEach(element =>
      this.conf.renderOrder.rows.customOrder?.push(element.rowID)
    );
    this.requestUpdate();
  }

  /**
   * Utility function, to be utilized from the outside, that resets the rows to their defaultOrder (created in the renderDataContent method).
   * This function automatically forces a componentUpdate, since it modifies the component prop renderedRows. It erases the conf.renderOrder.rows.customOrder .
   */
  resetRowsOrder() {
    this.conf.renderOrder.rows.customOrder =
      this.conf.renderOrder.rows.defaultOrder;
    this.requestUpdate();
  }

  /**
   * Utility function, to be utilized from outside, that either reorders the columns of the table with a new order, or deletes any customization to the order (if called without any parameter).
   * This function automatically forces a componentUpdate, since it modifies the component prop renderedRows.
   * @param newPropertyOrder an array of strings containing the properties utilized in data. If empty, the default column configuration will be used (by deleting the custom one, if present).
   */
  reorderRenderedColumns(newPropertyOrder?: Array<string>) {
    if (this.conf.renderOrder?.columns) {
      if (newPropertyOrder) {
        this.conf.renderOrder.columns.customOrder = [
          ...newPropertyOrder,
          'data-table-alert',
          'data-table-chevron',
          'data-table-settings',
        ];
      } else if (this.conf.renderOrder.columns.customOrder)
        this.conf.renderOrder.columns.customOrder =
          this.conf.renderOrder.columns.defaultOrder;
    }
    this.requestUpdate();
  }

  /**
   * This function toggles the visibility of every subrow associated with the row indicated by parentID.
   * @param parentID number . The subrows' parent index.
   */
  toggleSubRows(parentIndex: number, forcedValue?: boolean) {
    const target = this.data[parentIndex];
    if (target) {
      target.areSubRowsOpen = forcedValue ?? !target.areSubRowsOpen;
      this.requestUpdate();
    }
  }

  /**
   * This function toggles .isHidden to every DataCell contained in the targeted cell.
   * @param columnID string. The ID of the column (dictated by the relative <th> id property) to hide/show.
   */
  toggleColumn(columnID: string) {
    if (this.conf.renderOrder.columns.hiddenIDs === undefined) {
      this.conf.renderOrder.columns.hiddenIDs = [columnID];
    } else if (this.conf.renderOrder.columns.hiddenIDs.includes(columnID)) {
      this.conf.renderOrder.columns.hiddenIDs.splice(
        this.conf.renderOrder.columns.hiddenIDs.indexOf(columnID),
        1
      );
    } else {
      this.conf.renderOrder.columns.hiddenIDs.push(columnID);
    }
    this.requestUpdate();
  }

  /**
   * This function toggles the visibility of the preview row associated with the row indicated by parentID.
   * @param parentID number . The index of the target DataRow element in this.data.
   */
  togglePreview(parentIndex: number, forcedValue?: boolean) {
    const target = this.data[parentIndex];
    if (target?.previewRow) {
      target.previewRow.isHidden = forcedValue ?? !target.previewRow.isHidden;
      this.requestUpdate();
    }
  }

  /**
   * This method generates a new header, if the conf.headerRow object is available.
   * @returns TemplateResult containing the header
   */
  generateHeader(): TemplateResult {
    if (this.conf.headerRow !== undefined) {
      // If external conf.renderOrder.rows objects are passed, they are used. In case they're not, new empty objects will be created (and later filled).
      if (!this.isRowDefaultOrderExternal)
        this.conf.renderOrder.rows.defaultOrder = [];
      if (!this.isRowCustomOrderExternal)
        this.conf.renderOrder.rows.customOrder = [];

      // If an ID is not provided, it's generated.
      const rowID = this.conf.headerRow.id || generateID();

      // Iterating through the cells, an ID is generated if not provided AND the IDs found in the hiddenIDs array are set as hidden.
      Object.keys(this.conf.headerRow?.cells).forEach(key => {
        if (this.conf?.headerRow?.cells[key]) {
          const headerRowCell = this.conf.headerRow.cells[key];
          if (!headerRowCell.id) headerRowCell.id = generateID();
          if (
            this.conf.renderOrder.columns?.hiddenIDs?.includes(headerRowCell.id)
          ) {
            headerRowCell.isHidden = true;
          } else {
            headerRowCell.isHidden = false;
          }
        }
      });
      this.additionalColumnsProperties.forEach(additionalProperty => {
        if (
          this.conf.renderOrder.columns.defaultOrder &&
          !this.conf.renderOrder.columns.defaultOrder.includes(
            additionalProperty
          )
        )
          this.conf.renderOrder.columns.defaultOrder.push(additionalProperty);
        if (
          this.conf.renderOrder.columns.customOrder !== undefined &&
          !this.conf.renderOrder.columns.customOrder.includes(
            additionalProperty
          )
        )
          this.conf.renderOrder.columns.customOrder.push(additionalProperty);
      });
      if (!this.isRowDefaultOrderExternal)
        this.conf.renderOrder.rows.defaultOrder.push(rowID);
      if (!this.isRowCustomOrderExternal)
        this.conf.renderOrder.rows.customOrder?.push(rowID);
      return html`
        <tr class="row header" id=${rowID}>
          ${this.renderRowDataContent(
            this.conf.headerRow,
            this.conf.renderOrder.columns.customOrder,
            true
          )}
        </tr>
      `;
    }
    return html``;
  }

  /**
   * This method generates a new header, if the conf.headerRow object is available.
   * @returns TemplateResult containing the header
   */
  generateFooter(): TemplateResult {
    if (this.conf.footerRow !== undefined) {
      // If an ID is not provided, it's generated.
      const rowID = this.conf.footerRow.id || generateID();

      // Iterating through the cells, an ID is generated if not provided AND the IDs found in the hiddenIDs array are set as hidden.
      Object.keys(this.conf.footerRow.cells).forEach(key => {
        if (this.conf?.footerRow?.cells[key]) {
          const footerRowCell = this.conf.footerRow.cells[key];
          if (!footerRowCell.id) footerRowCell.id = generateID();
          if (
            this.conf.renderOrder.columns?.hiddenIDs?.includes(footerRowCell.id)
          ) {
            footerRowCell.isHidden = true;
          } else {
            footerRowCell.isHidden = false;
          }
        }
      });
      this.additionalColumnsProperties.forEach(additionalProperties => {
        if (
          this.conf.renderOrder.columns.defaultOrder &&
          !this.conf.renderOrder.columns.defaultOrder.includes(
            additionalProperties
          )
        )
          this.conf.renderOrder.columns.defaultOrder.push(additionalProperties);
        if (
          this.conf.renderOrder.columns.customOrder !== undefined &&
          !this.conf.renderOrder.columns.customOrder.includes(
            additionalProperties
          )
        )
          this.conf.renderOrder.columns.customOrder.push(additionalProperties);
      });
      if (!this.isRowDefaultOrderExternal)
        this.conf.renderOrder.rows.defaultOrder.push(rowID);
      if (!this.isRowCustomOrderExternal)
        this.conf.renderOrder.rows.customOrder?.push(rowID);
      return html`
        <tr class="row footer" id=${rowID}>
          ${this.renderRowDataContent(
            this.conf.footerRow,
            this.conf.renderOrder.columns.customOrder,
            false,
            false
          )}
        </tr>
      `;
    }
    return html``;
  }

  /**
   * This function takes the data parameter object and renders its content, while also populating the internal states of the component.
   * @returns TemplateResult
   */
  private renderDataContent(): TemplateResult {
    // If there's no data, the table renders an error-like message - in case it exists, it cycles through it.
    if (this.data) {
      // This process is either completed here, or first in the headerGeneration process, in case a header is available. The redundant checks for both customOrders silence a TS error in the following lines.
      const rowsDefaultOrder = this.isRowDefaultOrderExternal
        ? this.conf.renderOrder.rows.defaultOrder
        : [];
      const rowsCustomOrder =
        this.isRowCustomOrderExternal && this.conf.renderOrder.rows.customOrder
          ? this.conf.renderOrder.rows.customOrder
          : [];
      const columnsDefaultOrder = this.isColumnDefaultOrderExternal
        ? this.conf.renderOrder.columns.defaultOrder
        : [];
      const columnsCustomOrder =
        this.isColumnCustomOrderExternal &&
        this.conf.renderOrder.columns.customOrder
          ? this.conf.renderOrder.columns.customOrder
          : [];

      const isVariantWide =
        this.conf?.styling?.table?.areRowsSeparated ?? false;
      const paddingRow = isVariantWide
        ? html`<tr class="padding-row"></tr>`
        : null;
      const variantClassName = !isVariantWide ? 'tight' : 'wide';
      let rowsStyleFromConf = '';
      if (this.conf.styling?.rows) {
        const rowStyle = this.conf.styling.rows;
        if (rowStyle.minHeight !== undefined)
          rowsStyleFromConf = `min-height: ${rowStyle.minHeight}; height: ${rowStyle.minHeight};`;
        if (rowStyle.maxHeight !== undefined)
          rowsStyleFromConf = `${rowsStyleFromConf} max-height: ${rowStyle.maxHeight};`;
        if (rowStyle.alignText !== undefined)
          rowsStyleFromConf = `${rowsStyleFromConf} align-text: ${rowStyle.alignText};`;
        if (rowStyle.verticalAlign !== undefined)
          rowsStyleFromConf = `${rowsStyleFromConf} vertical-align: ${rowStyle.verticalAlign};`;
      }

      // The renderedRows array is emptied, and repopulated, on every value update.
      const toRenderRows: Array<RenderedRowObject> = [];
      // The data object is iterated through
      this.data?.forEach(rowDataObject => {
        // Local objects are declared here, to manage the row content
        const rowID = rowDataObject.id || generateID();
        const rowCellObjects: Array<RenderedCellObject> = [];

        if (rowDataObject.cells) {
          Object.keys(rowDataObject.cells).forEach(key => {
            if (rowDataObject.cells?.[key]) {
              const itemInRow = rowDataObject.cells[key];
              const valueToString =
                itemInRow.value !== undefined
                  ? itemInRow.value.toString()
                  : null;
              if (
                !this.isColumnDefaultOrderExternal &&
                !columnsCustomOrder.includes(itemInRow.property)
              )
                columnsDefaultOrder.push(itemInRow.property);
              if (
                !this.isColumnCustomOrderExternal &&
                !columnsCustomOrder.includes(itemInRow.property)
              )
                columnsCustomOrder.push(itemInRow.property);
              rowCellObjects.push({
                property: itemInRow.property,
                id: itemInRow.id,
                value: valueToString ?? null,
              });
            }
          });
        }
        if (!this.isRowDefaultOrderExternal) rowsDefaultOrder.push(rowID);
        if (!this.isRowCustomOrderExternal) rowsCustomOrder.push(rowID);

        // The rowToRender object will be pushed into the toRenderRows object.
        const rowToRender: RenderedRowObject = {
          isHeader: false,
          hasSubrows: false,
          hasAlert: this.conf.hasAlerts,
          hasSettings: this.conf.hasSettings,
          cellObjects: rowCellObjects,
          rowData: rowDataObject,
          id: rowID,
          hasPreview: rowDataObject.previewRow !== undefined,
          result: html``,
        };
        // Subrows rendering
        if (
          rowDataObject.subRows !== undefined &&
          rowDataObject.subRows.length > 0
        ) {
          if (this.isSubrowOpen === undefined) this.isSubrowOpen = {};
          this.isSubrowOpen[rowID] = rowDataObject.areSubRowsOpen ?? false;
          if (rowToRender.subRows === undefined) rowToRender.subRows = [];
          rowDataObject.subRows?.forEach((subRow, index) => {
            const isLastOne =
              rowDataObject.subRows &&
              index === rowDataObject.subRows.length - 1;
            let subrowGeneratedClass = `row sub-row ${variantClassName}`;
            subrowGeneratedClass += isLastOne
              ? 'last-subrow'
              : 'intermediate-subrow';
            subrowGeneratedClass +=
              !rowDataObject.areSubRowsOpen || subRow.isHidden
                ? ' hidden'
                : null;

            const subRowToAdd: RenderedSubRowObject = {
              parentID: rowID,
              isHidden: subRow.isHidden ?? false,
              subRowData: {
                id: subRow.id,
                cells: subRow.cells,
              },
              subRowResult: html`
                <tr
                  style="${rowsStyleFromConf}"
                  class="${subrowGeneratedClass}"
                  id="${rowID}"
                >
                  ${this.renderRowDataContent(
                    subRow,
                    this.conf.renderOrder.columns.customOrder,
                    false,
                    subRow.hasCustomSubrowContent
                  )}
                </tr>
              `,
            };
            rowToRender.subRows?.push(subRowToAdd);
          });
          // The row property "hasSubrows" is overwritten.
          rowToRender.hasSubrows = true;
        }
        // Preview rendering
        if (rowToRender.hasPreview && rowDataObject.previewRow !== undefined) {
          const isPreviewHidden = rowDataObject.previewRow.isHidden ?? true;
          let previewConditionalClass = 'row sub-row preview-subrow ';
          previewConditionalClass += isPreviewHidden ? 'hidden ' : '';
          previewConditionalClass += rowDataObject.areSubRowsOpen
            ? 'intermediate-subrow '
            : 'last-subrow ';
          rowToRender.preview = {
            id: rowDataObject.previewRow.id,
            parentID: rowID,
            isHidden: isPreviewHidden,
            content: html` <tr
              class="${previewConditionalClass}"
              id="${rowDataObject.previewRow.id}-row"
            >
              <td colspan="9999" class="cell-container preview-cell ">
                <slot name="${rowDataObject.previewRow.id}"></slot>
              </td>
            </tr>`,
          };
        }
        let conditionalClass = 'row ';
        conditionalClass += `${variantClassName} `;
        conditionalClass += rowToRender.hasPreview ? 'with-preview ' : '';
        conditionalClass += !rowToRender.preview?.isHidden
          ? 'preview-open '
          : 'preview-hidden ';
        conditionalClass += rowToRender.hasSubrows ? 'with-subrows ' : '';
        conditionalClass +=
          rowToRender.hasSubrows && rowDataObject.areSubRowsOpen
            ? 'subrows-open '
            : 'subrows-hidden ';

        // The rowToRender object will be pushed into the toRenderRows object. The 'result' value will be written after the eventual subrows/preview render.
        rowToRender.result = html`
          <tr
            style="${rowsStyleFromConf}"
            class="${conditionalClass}"
            id="${rowID}"
          >
            ${this.renderRowDataContent(
              rowDataObject,
              this.conf.renderOrder.columns.customOrder,
              false
            )}
          </tr>
          ${!rowToRender.preview?.isHidden
            ? rowToRender.preview?.content
            : null}
          ${rowToRender.subRows?.map(subRow => subRow.subRowResult)}
          ${paddingRow}
        `;
        // At last, the data is pushed in the renderedRows array.
        toRenderRows.push(rowToRender);
      });
      // If no default/custom order were supplied, they are populated here. This runs exclusively on the first iteration.
      if (rowsDefaultOrder.length > 0)
        this.conf.renderOrder.rows.defaultOrder = rowsDefaultOrder;
      if (rowsCustomOrder.length > 0)
        this.conf.renderOrder.rows.defaultOrder = rowsCustomOrder;
      if (columnsDefaultOrder.length > 0)
        this.conf.renderOrder.columns.defaultOrder = columnsDefaultOrder;
      if (columnsCustomOrder.length > 0)
        this.conf.renderOrder.columns.customOrder = columnsCustomOrder;

      // Before rendering the toRenderRows object, they're ordered by the conf.renderOrder.rows.customOrder, if present, or by the defaultOrder.
      const orderedRows = sortRowsByIdsArray(
        toRenderRows,
        this.conf.renderOrder.rows.customOrder ??
          this.conf.renderOrder.rows.defaultOrder
      );
      this.renderedRows = orderedRows;
      return html`${orderedRows.map(element => element.result)}`;
    }
    console.error(`Data-Table: Data Object empty in table: ${this.tableID}.`);
    return html`<p>Data Object Empty</p>`;
  }

  /**
   * This function cycles through the provided data, and renders it as DataCell components, based on the conf prop.
   * @param rowData RowData. The data to render in a row.
   * @param rowRenderOrderFromConf ? Array<string>. The render order, typically inherited from the table conf object.
   * @param isHeader boolean. If the row has to be rendered as a header, it's passed here. It defaults to false.
   * @param isSubrowAndHasCustomContent boolean. If set to true, the row content generation is skipped in favor of a render of a single named slot (named by rowData.id). It defaults to false.
   * @returns TemplateResult containing the actual row content
   */
  renderRowDataContent(
    rowData: RowData,
    rowRenderOrderFromConf?: Array<string>,
    isHeader = false,
    isSubrowAndHasCustomContent = false,
    isFooter = false
  ): TemplateResult {
    // This array will be populated with the various TemplateResult objects containing the rendered output of the component - in the form of DataCell components.
    const rowContent: Array<TemplateResult> = [];
    const rowDataToOutput = { ...rowData };

    // In case the parameter 'isSubrowAndHasCustomContent' is set to true, the subrow generation process is skipped in favor of a render of a single slot, spanning the whole table.
    if (isSubrowAndHasCustomContent) {
      // TODO When having the time, the colspan could probably be calculated in a smart way?
      return html` <td colspan="9999">
        <slot name=${rowDataToOutput.id}></slot>
      </td>`;
    }

    if (!this.conf.renderOrder.rows.defaultOrder.includes(rowDataToOutput.id))
      this.conf.renderOrder.rows.defaultOrder.push(rowDataToOutput.id);
    if (!this.conf.renderOrder.rows.customOrder?.includes(rowDataToOutput.id))
      this.conf.renderOrder.rows.customOrder?.push(rowDataToOutput.id);

    let tableSettingsCell: IDataCellEntry;
    let threeDotsCell: IDataCellEntry;
    let alertCell: IDataCellEntry;
    if (
      this.conf.hasCustomThreeDotsCell ||
      this.conf.hasCustomSettingsCell ||
      this.conf.hasCustomAlertCell
    ) {
      if (rowDataToOutput.cells) {
        Object.keys(rowDataToOutput.cells).forEach(key => {
          const cell = rowDataToOutput.cells?.[key];
          if (cell?.isSettingsCell) {
            threeDotsCell = {
              ...cell,
              property: this.additionalColumnsProperties[2],
            };
            if (isHeader)
              tableSettingsCell = {
                ...cell,
                property: this.additionalColumnsProperties[2],
              };
            if (
              !this.additionalColumnsProperties.includes(
                key as AdditionalColumnProperties
              )
            ) {
              delete rowDataToOutput.cells?.[key];
            }
          }
          if (cell?.isAlertCell) {
            alertCell = {
              ...cell,
              property: this.additionalColumnsProperties[0],
            };
            if (
              !this.additionalColumnsProperties.includes(
                key as AdditionalColumnProperties
              )
            ) {
              delete rowDataToOutput.cells?.[key];
            }
          }
        });
      }
    }

    // The following variable is declared as false - if any of the additional properties has to be rendered, they're all checked. If not, the whole loop is avoided, saving rendering time/resources.
    let shouldRenderAdditionalProperties = false;
    if (this.conf.hasAlerts !== undefined)
      shouldRenderAdditionalProperties = true;
    if (this.conf.hasSettings !== undefined)
      shouldRenderAdditionalProperties = true;
    if (this.conf.hasSubrows !== undefined)
      shouldRenderAdditionalProperties = true;
    if (shouldRenderAdditionalProperties) {
      this.additionalColumnsProperties.forEach(additionalProperty => {
        const additionalPropertyCommons = {
          value: 'none',
          property: additionalProperty,
          hasCustomThreeDotsCellContent: false,
          hasCustomAlertCellContent: false,
          hasCustomSettingsCellContent: false,
        };
        switch (additionalProperty) {
          // Alerts
          case this.additionalColumnsProperties[0]:
            if (this.conf.hasAlerts) {
              // Custom Alerts
              if (this.conf.hasCustomAlertCell) {
                rowDataToOutput.cells = {
                  ...rowDataToOutput.cells,
                  [`${additionalProperty}`]: {
                    ...additionalPropertyCommons,
                    ...alertCell,
                    hasCustomThreeDotsCellContent: false,
                    hasCustomAlertCellContent: true,
                    hasCustomSettingsCellContent: false,
                  },
                };
                // Standard Alerts
              } else {
                const isAlertButtonHidden = isHeader
                  ? true
                  : rowDataToOutput.hasAlertsToShow === undefined;
                const onAlert =
                  rowDataToOutput.rowOnAlertClickFunction !== undefined
                    ? rowDataToOutput.rowOnAlertClickFunction
                    : this.onTableAlertClickFunction;
                rowDataToOutput.cells = {
                  ...rowDataToOutput.cells,
                  [`${additionalProperty}`]: {
                    ...additionalPropertyCommons,
                    id: `${rowDataToOutput.id}-alert`,
                    isAlertCell: true,
                    isHidden: isAlertButtonHidden,
                    onAlertClick: onAlert,
                  },
                };
              }
            }
            break;
          // Chevron
          case this.additionalColumnsProperties[1]:
            if (this.conf.hasSubrows) {
              // The chevron function is set via some simple boolean logic: in case table-wide functions are declared, they're the only ones that get executed. Both pre-chevron clicks and actual-chevron-clicks.
              const onChevron = () => {
                if (
                  !this.preTableChevronClickFunction &&
                  !this.onTableChevronClickFunction &&
                  !rowDataToOutput.rowPreChevronFunction &&
                  !rowDataToOutput.rowOnChevronFunction
                ) {
                  rowDataToOutput.areSubRowsOpen =
                    !rowDataToOutput.areSubRowsOpen;
                  this.requestUpdate();
                }
                if (this.preTableChevronClickFunction !== undefined) {
                  this.preTableChevronClickFunction();
                } else {
                  rowDataToOutput.rowPreChevronFunction?.();
                }
                if (this.onTableChevronClickFunction !== undefined) {
                  this.onTableChevronClickFunction();
                } else {
                  rowDataToOutput.rowOnChevronFunction?.();
                }
              };
              const isChevronHiddenValue =
                rowDataToOutput.isChevronHidden ??
                (rowDataToOutput.subRows === undefined ||
                  rowDataToOutput.subRows.length === 0);
              rowDataToOutput.cells = {
                ...rowDataToOutput.cells,
                [`${additionalProperty}`]: {
                  ...additionalPropertyCommons,
                  id: `${rowDataToOutput.id}-chevron`,
                  isChevronCell: true,
                  isHidden: isChevronHiddenValue,
                  onChevronClick: onChevron,
                },
              };
            }
            break;
          // Settings
          case this.additionalColumnsProperties[2]:
            if (this.conf.hasSettings) {
              // Standard Cogs
              if (!this.conf.hasCustomSettingsCell && isHeader) {
                rowDataToOutput.cells = {
                  ...rowDataToOutput.cells,
                  [`${additionalProperty}`]: {
                    ...additionalPropertyCommons,
                    id: `${rowDataToOutput.id}-table-settings`,
                    onThreeDotsClick: this.onTableSettingsClickFunction,
                    isSettingsCell: true,
                    isInHeaderRow: true,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                };
              }
              // Standard ThreeDots
              if (!this.conf.hasCustomThreeDotsCell && !isHeader) {
                const onThreeDots =
                  rowDataToOutput.rowOnThreeDotsFunction ??
                  this.onTableThreeDotsClickFunction;
                rowDataToOutput.cells = {
                  ...rowDataToOutput.cells,
                  [`${additionalProperty}`]: {
                    ...additionalPropertyCommons,
                    id: `${rowDataToOutput.id}-settings`,
                    onThreeDotsClick: onThreeDots,
                    isSettingsCell: true,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                };
              }
              // Custom ThreeDots
              if (this.conf.hasCustomThreeDotsCell && !isHeader) {
                rowDataToOutput.cells = {
                  ...rowDataToOutput.cells,
                  [`${additionalProperty}`]: {
                    ...additionalPropertyCommons,
                    ...threeDotsCell,
                    hasCustomThreeDotsCellContent: true,
                    hasCustomAlertCellContent: false,
                    hasCustomSettingsCellContent: false,
                  },
                };
              }
              // Custom Cogs
              if (this.conf.hasCustomSettingsCell && isHeader) {
                rowDataToOutput.cells = {
                  ...rowDataToOutput.cells,
                  [`${additionalProperty}`]: {
                    ...additionalPropertyCommons,
                    ...tableSettingsCell,
                    hasCustomThreeDotsCellContent: false,
                    hasCustomAlertCellContent: false,
                    hasCustomSettingsCellContent: true,
                    isInHeaderRow: true,
                  },
                };
              }
            }
            break;
          default:
            break;
        }
      });
    }
    // The optional conf.styling.columns width options are here checked, and if existing, set into the following variable (then utilized as inline-styles for each cell).
    let colStyleFromConf = '';
    if (this.conf?.styling?.columns) {
      const columnStyle = this.conf.styling.columns;
      if (columnStyle.minWidth !== undefined)
        colStyleFromConf = `min-width: ${columnStyle.minWidth}; width: ${columnStyle.minWidth};`;
      if (columnStyle.maxWidth !== undefined)
        colStyleFromConf = `${colStyleFromConf} max-width: ${columnStyle.maxWidth};`;
    }

    // The row object contains a different key for each cell, and they are cycled through in this loop.
    if (rowDataToOutput.cells) {
      Object.keys(rowDataToOutput.cells).forEach(key => {
        const itemInRowData = rowDataToOutput.cells?.[key];
        if (itemInRowData) {
          itemInRowData.parentID = rowDataToOutput.id;

          if (isHeader) itemInRowData.isInHeaderRow = true;
          if (isFooter) itemInRowData.isInFooterRow = true;
          itemInRowData.doesWrap =
            this.conf.styling?.cells?.wrapContent ?? false;

          // The individual cell generation process cycles through all the possible values a DataCell can implement that are provided by the rowDataToOutput object, and sets them for each every single DataCell via the renderCell method.
          const cellToRender = this.renderCell(itemInRowData);

          // In case the row rendered is part of a header, it's rendered as such (whether or not there's a rowConf).
          // In case there's an existing conf.renderOrder.column.customOrder object passed to the component, it's implemented, otherwise the order used is the order in which the data is passed down to the component.
          if (isHeader) {
            cellToRender.isInHeaderRow = true;
            if (rowRenderOrderFromConf && rowRenderOrderFromConf.length > 0) {
              rowContent[
                rowRenderOrderFromConf.indexOf(itemInRowData.property)
              ] = html`<th
                style=${colStyleFromConf}
                id="${cellToRender.property}-th"
                class="cell-container"
              >
                ${cellToRender}
              </th>`;
            } else {
              rowContent.push(
                html`<th
                  style=${colStyleFromConf}
                  id="${cellToRender.property}-th"
                  class="cell-container"
                >
                  ${cellToRender}
                </th>`
              );
            }
          } else {
            cellToRender.isInHeaderRow = false;
            if (rowRenderOrderFromConf && rowRenderOrderFromConf.length > 0) {
              rowContent[
                rowRenderOrderFromConf.indexOf(itemInRowData.property)
              ] = html`<td
                style=${colStyleFromConf}
                headers="${cellToRender.property}-th"
                class="cell-container"
              >
                ${cellToRender}
              </td>`;
            } else {
              rowContent.push(
                html`<td
                  style=${colStyleFromConf}
                  headers="${cellToRender.property}-th"
                  class="cell-container"
                >
                  ${cellToRender}
                </td>`
              );
            }
          }
        }
      });
    }

    // eslint-disable-next-line no-param-reassign
    rowData = rowDataToOutput;
    // At last, the result is rendered.
    return html`${rowContent.map(rowElement => rowElement)}`;
  }

  /**
   * This internal function renders a cell, based on the data it receives from IDataCellEntry and the children contained in this.children .
   * @param itemInRowData IDataCellEntry
   * @returns DataCell . A completely setup DataCell object
   */
  private renderCell(itemInRowData: IDataCellEntry): DataCell {
    // A new cell is created - please note that the best practice of creating new webcomponents is NOT to use the "new Component()" syntax, but the following document.createElement('web-component-name').
    const outputCell = document.createElement('data-cell') as DataCell;

    const headerCellData = itemInRowData.isInHeaderRow
      ? (itemInRowData as HeaderCell)
      : null;
    const footerCellData = itemInRowData.isInFooterRow
      ? (itemInRowData as FooterCell)
      : null;

    // If the column is hidden, the cells are subsequentyly hidden.
    if (
      this.conf.renderOrder.columns.hiddenIDs?.includes(itemInRowData.property)
    ) {
      outputCell.isHidden = true;
    } else {
      outputCell.isHidden = itemInRowData.isHidden ?? false;
    }

    // The following manual setting of each and every property is willfully verbose - this way setting a property triggers the setting of other properties (e.g. hasSortIcon, or isAlert).
    outputCell.property = itemInRowData.property;
    outputCell.id = itemInRowData.id;
    const valueToString =
      itemInRowData.value !== undefined ? itemInRowData.value.toString() : null;
    if (valueToString) outputCell.value = valueToString;
    // The styling data is added, if present. If not present on the cell, the default data from the conf.styling object is passed, if present.
    if (itemInRowData.justifyContent !== undefined)
      outputCell.justifyContent = itemInRowData.justifyContent;
    if (itemInRowData.alignItems !== undefined)
      outputCell.alignItems = itemInRowData.alignItems;
    if (itemInRowData.isHidden !== undefined)
      outputCell.isHidden = itemInRowData.isHidden;
    if (itemInRowData.isInSubrow !== undefined)
      outputCell.isInSubrow = itemInRowData.isInSubrow;
    if (itemInRowData.doesWrap !== undefined)
      outputCell.wraps = itemInRowData.doesWrap;

    // Copy
    if (itemInRowData.isCopiable !== undefined)
      outputCell.isCopiable = itemInRowData.isCopiable;
    if (itemInRowData.isIDInCopyOutput !== undefined)
      outputCell.isIDInCopyOutput = itemInRowData.isIDInCopyOutput;
    // Copy in header && footer
    if (headerCellData?.onCopyInteractionFunction !== undefined) {
      outputCell.onCopyIconInteraction = () => {
        headerCellData.onCopyInteractionFunction?.();
      };
    }
    if (footerCellData?.onCopyInteractionFunction !== undefined) {
      outputCell.onCopyIconInteraction = () => {
        footerCellData.onCopyInteractionFunction?.();
      };
    }

    // Sorting
    if (itemInRowData.hasSortIcon !== undefined)
      outputCell.hasSortIcon = itemInRowData.hasSortIcon;
    if (outputCell.hasSortIcon) {
      // In case a specific sorting behavior is necessary (e.g. one that involves API calls), said behavior is implemented instead of the local one.
      if (headerCellData?.onSortInteractionFunction !== undefined) {
        outputCell.onSortIconInteraction = () => {
          headerCellData.onSortInteractionFunction?.();
        };
      } else {
        // On the first onSortIconInteraction event, since the hasAlreadySorted internal state is undefined, the reorderRenderedRows function is called with a mandatory true for its "inverse" param.
        // On subsequent calls, the 'invalid' param to the function is given by the status of hasAlreadySorted - inversely, so if it `hasAlreadySorted` by a certain property, the output will now be reversed.
        outputCell.onSortIconInteraction = () => {
          const shouldInvert =
            this.hasAlreadySorted[outputCell.property] ?? false;
          this.reorderRenderedRows(outputCell.property, !shouldInvert);
          this.hasAlreadySorted[outputCell.property] = !shouldInvert;
        };
      }
    }

    // Dragging - TODO complete it when the designs are ready.
    if (itemInRowData.isDraggable !== undefined)
      outputCell.isDraggable = itemInRowData.isDraggable;
    if (headerCellData?.onRearrangeInteractionFunction !== undefined) {
      outputCell.onDragIconInteraction = () => {
        headerCellData.onRearrangeInteractionFunction?.();
      };
    }
    // TODO Missing behavior for dragging, due to lack of design for it.

    // Alert
    if (itemInRowData.isAlertCell !== undefined)
      outputCell.isAlertCell = itemInRowData.isAlertCell;
    if (itemInRowData.hasCustomAlertCellContent !== undefined)
      outputCell.hasCustomAlertCellContent =
        itemInRowData.hasCustomAlertCellContent;
    if (outputCell.isAlertCell && !outputCell.hasCustomAlertCellContent) {
      // In case a specific Alert icon click behavior is expected, it's implemented instead of the general one for the whole table.
      if (itemInRowData.onAlertClick !== undefined)
        outputCell.onContentIconInteraction = () => {
          itemInRowData.onAlertClick?.();
        };
    }

    // Chevron
    if (itemInRowData.isChevronCell !== undefined)
      outputCell.isChevronCell = itemInRowData.isChevronCell;
    if (outputCell.isChevronCell) {
      outputCell.onContentIconInteraction = () => {
        // In case a table-wide onTableChevronClick exists, it would've been set in the itemInRowData before, therefore it can be executed here
        itemInRowData.onChevronClick?.();
        if (itemInRowData.parentID !== undefined) {
          if (this.isSubrowOpen === undefined) this.isSubrowOpen = {};
          this.isSubrowOpen[itemInRowData.parentID] =
            !this.isSubrowOpen[itemInRowData.parentID] ?? true;
        }
      };
    }
    if (itemInRowData.parentID !== undefined)
      outputCell.isChevronOpen = this.isSubrowOpen[itemInRowData.parentID];

    // Settings
    if (itemInRowData.isSettingsCell !== undefined)
      outputCell.isSettingsCell = itemInRowData.isSettingsCell;
    if (itemInRowData.hasCustomSettingsCellContent !== undefined)
      outputCell.hasCustomSettingsCellContent =
        itemInRowData.hasCustomSettingsCellContent;
    if (itemInRowData.hasCustomThreeDotsCellContent !== undefined)
      outputCell.hasCustomThreeDotsCellContent =
        itemInRowData.hasCustomThreeDotsCellContent;
    if (
      outputCell.isSettingsCell &&
      !outputCell.hasCustomSettingsCellContent &&
      !outputCell.hasCustomThreeDotsCellContent
    ) {
      if (itemInRowData.isInHeaderRow) {
        outputCell.onContentIconInteraction = () => {
          this.onTableSettingsClickFunction?.();
        };
      } else {
        const onThreeDots =
          itemInRowData.onThreeDotsClick ?? this.onTableThreeDotsClickFunction;
        outputCell.onContentIconInteraction = () => {
          onThreeDots?.();
        };
      }
    }

    return outputCell;
  }

  /**
   * After the first update (await lets it finish, first), the renderedColumns object is populated with the correct data, or with empty data (to reduce the amount of TS boolean/lenght checks in the whole component) via a series of nullish-coalescing-operator checks.
   * FirstUpdate lets it run only once.
   */
  protected async firstUpdated() {
    this.isRowDefaultOrderExternal =
      this.conf.renderOrder.rows.defaultOrder.length > 0;
    this.isColumnDefaultOrderExternal =
      this.conf.renderOrder.columns.defaultOrder.length > 0;
    await this.updateComplete;
    const emptyRenderOrder = {
      columns: { defaultOrder: [], customOrder: [], hiddenIDs: [] },
      rows: { defaultOrder: [], customOrder: [], hiddenIDs: [] },
    };
    const emptyStyling = {
      table: { areRowsSeparated: false },
      cells: { alignItems: undefined, justifyContent: undefined },
      rows: {
        minHeight: undefined,
        alignText: undefined,
        verticalAlign: undefined,
      },
      columns: { minWidth: undefined },
    };
    if (this.conf.headerRow === undefined)
      this.conf = { renderOrder: emptyRenderOrder };
    this.conf.headerRow ??= { id: 'headerRow', cells: {} };
    this.conf.renderOrder ??= emptyRenderOrder;
    this.conf.renderOrder.columns ??= emptyRenderOrder.columns;
    this.conf.renderOrder.rows ??= emptyRenderOrder.rows;
    this.conf.styling ??= emptyStyling;
    this.conf.styling.cells ??= emptyStyling.cells;
    this.conf.styling.rows ??= emptyStyling.rows;
    this.conf.styling.columns ??= emptyStyling.columns;
    this.conf.styling.table ??= emptyStyling.table;
    this.renderedColumns ??= {};

    if (this.renderedColumns === undefined) this.renderedColumns = {};
    this.renderedCells?.forEach(cell => {
      if (this.renderedColumns) {
        if (this.renderedColumns[cell.property] === undefined)
          this.renderedColumns[cell.property] = {
            columnID: 'notAvailable',
            columnCellsIDs: [],
          };
        this.renderedColumns[cell.property].columnCellsIDs.push(cell.id);
        // Since the only cells with the isInHeaderRow property are the ones in <th>, their ID is used as a columnID.
        if (cell.isInHeaderRow)
          this.renderedColumns[cell.property].columnID = cell.id;
      }
    });
  }

  /**
   * On every update, the component checks if a new customOrder for either the column or the rows has been set into the conf files.
   */
  protected updated(): void {
    this.isRowCustomOrderExternal =
      this.conf.renderOrder.rows.customOrder !== undefined &&
      this.conf.renderOrder.rows.customOrder.length > 0;
    this.isColumnCustomOrderExternal =
      this.conf.renderOrder.columns.customOrder !== undefined &&
      this.conf.renderOrder.columns.customOrder.length > 0;
  }

  render(): TemplateResult {
    let tableClass = '';
    tableClass += this.conf?.styling?.table?.areRowsSeparated
      ? 'wide-style '
      : 'tight-style';
    return html`
      <div class="table-wrapper">
        <table class="${tableClass} table">
          <thead>
            ${this.generateHeader()}
          </thead>
          <tbody>
            ${this.renderDataContent()}
            <tfoot>
              ${this.generateFooter()}
            </tfoot>
          </tbody>
        </table>
      </div>
    `;
  }
}

window.customElements.define('data-table', DataTable);
