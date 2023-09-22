import { css } from 'lit';

// --var-data-table--font-family: 'Roboto', sans-serif;

// --var-data-table--color-primary: #D9A282;
// --var-data-table--color-secondary: #8C594D;
// --var-data-table--color-tertiary: #A6A6A6;
// --var-data-table--color-quaternary: #404040;
// --var-data-table--color-quinary: #0D0D0D;

// --var-data-table--custom-rem: 16px;

const DataTableStyles = css`
  :host {
    /* background-color: var(--var-data-table--color-primary); */
  }

  .table-wrapper {
    overflow-x: auto;
    overflow-y: auto;
    min-width: unset;
    scrollbar-width: thin;
    scrollbar-color: var(--var-data-table--color-quaternary);
    font-size: var(--var-data-table--custom-rem);
  }

  table {
    border-color: transparent;
  }

  .table {
    width: 100%;
    border-spacing: 0;
    white-space: nowrap;
  }

  .table.wide-style {
    border-collapse: separate;
  }

  .table.tight-style {
    border-collapse: collapse;
  }

  .table.tight-style > tbody > tr.padding-row {
    display: none;
  }

  .table.wide-style > tbody > tr.padding-row {
    display: block;
    min-height: 0.75rem;
    max-height: 0.75rem;
  }
`;

export default DataTableStyles;
