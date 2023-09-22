// eslint-disable-next-line import/no-extraneous-dependencies
import 'iconify-icon';

import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export class DataTableIcon extends LitElement {
  @property({ type: String, attribute: 'name' })
  name: string = '';

  @property({ type: String, attribute: 'style' })
  additionalStyle?: string = 'font-size: 1rem;';

  /**
   * The default render method for the component.
   * @returns TemplateResult
   */
  render(): TemplateResult {
    return html`
      <iconify-icon
        icon="${this.name}"
        style="${ifDefined(this.additionalStyle)}"
      >
      </iconify-icon>
    `;
  }
}

if (!window.customElements.get('datatable-icon'))
  window.customElements.define('datatable-icon', DataTableIcon);
