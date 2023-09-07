import { html, LitElement, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { CellValues, CellAlignItemsStates, CellJustifyContentStates } from '../types/ValueTypes.js';
import { checkIfKeyEventIsAllowed, generateID } from '../utils/index.js';
import { IDataCellEntry } from '../interfaces/IDataCellEntry.js';

export class DataCell extends LitElement implements IDataCellEntry {

  @property({ type: String, reflect: true, attribute: 'property' })
  property: string = '';

  /**
   * The value this cell is representing - it has to be manually set, in order to enable the cell sorting in the table.
   */
  @property({ type: String, reflect: true, attribute: 'value' })
  value: CellValues = '';

  /**
   * Every cell in the table has its own id attribute. It defaults to a randomly generated uuid.
   */
  @property({ type: String, reflect: true, attribute: 'id' })
  cellID: string = generateID();

  /**
   * Utilized to render the cell in the correct header style.
   */
  @property({ type: Boolean, reflect: true, attribute: 'in-header-row' })
  isInHeaderRow = false;

  /**
   * Utilized to render the cell in the correct sub-row style.
   */
  @property({ type: Boolean, reflect: true, attribute: 'in-subrow' })
  isInSubrow = false;

  /**
   * Toggles the wrapping of the cell content.
   */
  @property({ type: Boolean, attribute: 'wraps' })
  wraps = false;

  /**
   * To manually set the justification-style of the cell. It accepts any kind of justify-content value.
   */
  @property({ type: String, reflect: true, attribute: 'justify-content' })
  justifyContent: CellJustifyContentStates = 'flex-start';

  /**
   * To manually set the alignment-style of the cell. It accepts any kind of align-items value.
   */
  @property({ type: String, reflect: true, attribute: 'align-items' })
  alignItems: CellAlignItemsStates = 'center';

  /**
   * Toggles the copy-button (on hover) for this cell. It defaults to false.
   */
  @property({ type: Boolean, attribute: 'has-copy-icon-on-hover' })
  isCopiable = false;

  /**
   * Regulates the copy button behavior - whether it adds the "id" field to the copied value or not.
   */
  @property({ type: Boolean, attribute: 'add-id-to-copy-output' })
  isIDInCopyOutput = false;

  /**
   * Toggles the presence of a "sort" arrows button.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-sort-icon' })
  hasSortIcon = false;

  /**
   * Toggles the presence of a "drag" icon.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-drag-icon' })
  isDraggable = false;

  /**
   * Toggles the visibility of the cell's content.
   */
  @property({ type: Boolean, attribute: 'hidden' })
  isHidden = false;

  /**
   * Toggles the pre-set "Alert-Cell" result.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-alert' })
  isAlertCell = false;

  /**
   * Toggles the pre-set "Settings-Button" result.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-settings' })
  isSettingsCell = false;

  /**
   * Toggles rendering of the pre-set "Settings-Button" content.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-custom-settings' })
  hasCustomSettingsCellContent = false;

  /**
   * Toggles rendering of the pre-set "Three-Dots-Button" content.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-custom-three-dots' })
  hasCustomThreeDotsCellContent = false;

  /**
   * Toggles rendering of the pre-set "Alert-Button" content.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-custom-alert' })
  hasCustomAlertCellContent = false;

  /**
   * Toggles the "Opening-Chevron" result.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-chevron' })
  isChevronCell = false;

  /**
   * Toggles the chevron direction. It defaults to false.
   */
  @property({ type: Boolean, reflect: true, attribute: 'chevron-facing-up' })
  isChevronOpen = false;

  /**
   * To be used externally in order to update the value for this cell (it can be done via a simple property update as well, indipendently).
   * @param newValue :Values type
   */
  updateValue(newValue: CellValues) {
    this.value = newValue;
    this.requestUpdate();
  }

  /**
   * This function is executed on the click interactions with the DragIcon (only available when the property "isDraggable" is true).
   */
  @property({ attribute: false })
  onDragIconInteraction?: Function;

  /**
   * This function is executed on the click interactions with the SortIcon (only available when the property "isSortable" is true).
   */
  @property({ attribute: false })
  onSortIconInteraction?: Function;

  /**
   * This function is executed on the click interactions with the CopyIcon (only available when the property "isCopiable" is true).
   */
  @property({ attribute: false })
  onCopyIconInteraction?: Function;

  /**
   * This function is executed on the click interactions with the AlertIcon (only available when the whole cell is an Alert Icon).
   */
  @property({ attribute: false })
  onContentIconInteraction?: Function;

  /**
   * This simple function utilizes the navigator.clipboard API to copy the value property in the end-user clipboard.
   */
  private copyCellValueToClipboard(): void {
    if (this.isIDInCopyOutput) {
      navigator.clipboard.writeText(`${this.property} - ${this.value}`).then(
        () => {
          console.log('🖥️, DataTable - the following content has been copied to the clipboard:');
          console.log(this.property, this.value);
        },
        () => {
          console.warn('🚨, something went wrong, and the data couldn\'t be copied to the clipboard. Check your OS/browser\'s permissions.');
        }
      );
    } else {
      navigator.clipboard.writeText(`${this.value}`).then(
        () => {
          console.log('🖥️, DataTable - the following content has been copied to the clipboard:');
          console.log(this.value);
        },
        () => {
          console.warn('🚨, something went wrong, and the data couldn\'t be copied to the clipboard. Check your OS/browser\'s permissions.');
        }
      );
    }
  }


  iconGenerator(iconType: 'generic' | 'copy' | 'sort' | 'drag'): TemplateResult {
    let iconName = '';
    let iconLabel = '';
    let onClickFunction: Function = () => { };
    let onKeyUpFunction: Function = () => { };
    let tempIcon = '';
    switch (iconType) {
      case 'copy':
        onClickFunction = this.onCopyIconInteraction ? (e: Event) => this.onCopyIconInteraction?.(e) : () => this.copyCellValueToClipboard();
        onKeyUpFunction = (keyEvent: KeyboardEvent) => checkIfKeyEventIsAllowed(keyEvent, onClickFunction);
        iconName = 'content_copy';
        iconLabel = 'content-copy clickable icon';
        tempIcon = '📄'
        break;
      case 'sort':
        onClickFunction = (e: Event) => this.onSortIconInteraction?.(e);
        onKeyUpFunction = (keyEvent: KeyboardEvent) => checkIfKeyEventIsAllowed(keyEvent, onClickFunction);
        iconName = 'swap_vert';
        iconLabel = 'sort-content clickable icon';
        tempIcon = '⤴'
        break;
      case 'drag':
        onClickFunction = (e: Event) => this.onDragIconInteraction?.(e);
        onKeyUpFunction = (keyEvent: KeyboardEvent) => checkIfKeyEventIsAllowed(keyEvent, onClickFunction);
        iconName = 'drag_indicator';
        iconLabel = 'drag-columns clickable icon';
        tempIcon = '🖐'
        break;

      case 'generic':
      default:
        onClickFunction = (e: Event) => this.onContentIconInteraction?.(e);
        onKeyUpFunction = (keyEvent: KeyboardEvent) => checkIfKeyEventIsAllowed(keyEvent, onClickFunction);
        if (this.isAlertCell) {
          iconName = 'warning';
          tempIcon = '⚠';
        }
        if (this.isSettingsCell) {
          iconName = this.isInSubrow ? 'more_vert' : 'settings';
          tempIcon = this.isInSubrow ? '🍔' : '⚙️';
        }
        if (this.isChevronCell) {
          iconName = this.isChevronOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
          tempIcon = this.isChevronOpen ? '⬇' : '⬆';
        }
        iconLabel = `${iconName} icon`;

        break;
    }
    const iconToGenerate = html`
      <span
        tabindex="0"
        class="icon-container ${iconType} ${iconName}"
        .onclick="${(e: Event) => onClickFunction(e)}"
        .onkeydown="${(e: Event) => onKeyUpFunction(e)}"
      >
        <material-icon
          size="24px"
          library="material"
          name="${iconName}"
          label="${iconLabel}"
        >
          ${tempIcon ?? iconName}
        </material-icon>
      </span>`;
    return iconToGenerate;
  }

  /**
   * This function generates the appropriate class sequence for the component, based on its properties.
   * @returns string containing the appropriate classes for this cell.
   */
  conditionalClassGenerator(): string {
    let classOutput = `justify-content-${this.justifyContent} align-items-${this.alignItems} `;
    if (this.isInHeaderRow) classOutput += ' header-row';
    if (this.isInSubrow) classOutput += ' sub-row';
    if (this.isCopiable) classOutput += ' has-copy-icon';
    if (this.hasSortIcon) classOutput += ' has-sort-icon';
    if (this.isDraggable) classOutput += ' has-drag-icon';
    if (this.isHidden) classOutput += ' hidden';
    if (this.wraps) classOutput += ' wraps';
    return classOutput;
  }

  /**
   * The default render method for the component.
   * @returns TemplateResult
   */
  render(): TemplateResult {
    // Given the unusual Lit structure used in the table, the "internal" class of the component is hoistered to the component itself.
    // E.g. It goes from a "typical" rendered `<data-cell><div class="class">...</div></data-cell>` to a rendered `<data-cell class="class">...</data-cell>`. 
    // This helps with accessibility 'default' features in the html <table> component.
    this.className = `cell ${this.conditionalClassGenerator()}`;

    const shouldRenderContentIcon =
      this.isChevronCell ||
      (this.isAlertCell && !this.hasCustomAlertCellContent) ||
      (this.isSettingsCell && this.isInHeaderRow && !this.hasCustomSettingsCellContent) ||
      (this.isSettingsCell && this.isInSubrow && !this.hasCustomThreeDotsCellContent);

    // Every possible icon is variabilized/pre-rendered here, and then invoked in the returned template-result.
    const copyIcon = this.iconGenerator('copy');
    const sortIcon = this.iconGenerator('sort');
    const draggableIcon = this.iconGenerator('drag');
    const contentIcon = shouldRenderContentIcon ? this.iconGenerator('generic') : nothing;

    return html`
    <div class='cell'>
      <slot name="${this.cellID}"></slot>
      ${copyIcon} ${sortIcon} ${draggableIcon} ${contentIcon}
    </div>
    `;
  }

  /**
   * //https://lit.dev/docs/components/shadow-dom/#setting-shadowrootoptions
   * Implementing this method allows the component to be rendered in light-DOM mode, transposing the content of the render method inside the "this" object (and the relative tag), instead of the regular this.shadowDom .
   * This means that whatever is returned by the render method will be simply wrapped by `<data-cell></data-cell>`, and not a #shadowRoot virtual tag.
   * NOTE that this will cause the styles in the DataTable shadow-dom to leak into this component - causing the 'styles' declared here to never be declared anywhere in the rendered HTML tree.
   * E.G. <data-cell><p>I'm an example</p><span class="icon-container drag"><material-icon size="24px" library="material" name="draggable"></material-icon></span></data-cell>
   * @returns the whole rendered component.
   */
  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }
}

if (!window.customElements.get('data-cell')) window.customElements.define('data-cell', DataCell);