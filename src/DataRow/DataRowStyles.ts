import { css } from 'lit';

// --var-data-table--font-family: 'Roboto', sans-serif;

// --var-data-table--color-primary: #D9A282;
// --var-data-table--color-secondary: #8C594D;
// --var-data-table--color-tertiary: #A6A6A6;
// --var-data-table--color-quaternary: #404040);
// --var-data-table--color-quinary: #0D0D0D;
// --var-data-table--color-tinted-black: #131826
// --var-data-table--color-tinted-white: #F9F6EA

// --var-data-table--custom-rem: 16px;

const DataRowStyles = css`
  .row {
    background-color: var(--var-data-table--color-tinted-white);
  }

  .row td.cell-container {
    border-top: 0.06rem solid black;
    border-top-color: var(--var-data-table--color-primary);
    border-bottom: 0.06rem solid black;
    border-bottom-color: var(--var-data-table--color-primary);
  }

  .row td.cell-container:first-of-type {
    border-left: 0.06rem black;
    border-left-color: var(--var-data-table--color-primary);
    padding-left: 0.25rem;
  }

  .row td.cell-container:last-of-type {
    border-right: 0.06rem solid black;
    border-right-color: var(--var-data-table--color-primary);
    padding-right: 0.25rem;
  }

  .table.wide-style > tbody > tr.row td.cell-container:first-of-type {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  .table.wide-style > tbody > tr.row td.cell-container:last-of-type {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  .row.header {
    background-color: transparent;
    color: var(--var-data-table--color-tinted-black);
    /* font: var(--font-bold); */
    font-weight: bold;
  }

  .row.header th.cell-container {
    border: none;
    color: var(--var-data-table--color-tinted-black);
  }

  .row.sub-row.hidden {
    display: none;
  }

  .row.with-subrows.subrows-hidden > .cell-container {
    border-bottom: 0.13rem solid black;
    border-bottom-color: var(--var-data-table--color-primary);
  }

  .row.with-subrows.subrows-open > .cell-container {
    border-bottom: none;
  }

  .table.wide-style
    > tbody
    > tr.row.with-subrows.subrows-open
    > .cell-container:first-of-type {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 0px;
  }

  .table.wide-style
    > tbody
    > tr.row.with-subrows.subrows-open
    > .cell-container:last-of-type {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 0px;
  }

  .row.sub-row {
    background-color: var(--var-data-table--color-primary);
  }

  .table.wide-style
    > tbody
    > tr.row.sub-row.intermediate-subrow
    > .cell-container:first-of-type,
  .table.wide-style
    > tbody
    > tr.row.sub-row.intermediate-subrow
    > .cell-container:last-of-type {
    border-radius: 0px;
  }

  .table.wide-style
    > tbody
    > tr.row.sub-row.last-subrow
    > .cell-container:first-of-type {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 1rem;
  }
  .table.wide-style
    > tbody
    > tr.row.sub-row.last-subrow
    > .cell-container:last-of-type {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 1rem;
  }

  .row.sub-row.row.sub-row.intermediate-subrow > .cell-container {
    border-bottom: none;
  }

  .row.with-subrows.subrows-hidden.with-preview.preview-open > .cell-container {
    border-bottom: 0.06rem solid black;
    border-bottom-color: var(--var-data-table--color-primary);
  }

  .row.with-subrows.subrows-hidden.with-preview.preview-hidden
    > .cell-container {
    border-bottom: 0.06rem solid black;
    border-bottom-color: var(--var-data-table--color-primary);
  }

  .table.wide-style
    > tbody
    > tr.row.with-preview.preview-open
    > .cell-container:first-of-type {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 0px;
  }

  .table.wide-style
    > tbody
    > tr.row.with-preview.preview-open
    > .cell-container:last-of-type {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 0px;
  }

  .row.preview-subrow {
    background-color: var(--var-data-table--color-secondary);
  }

  .row.footer {
    background-color: transparent;
    color: var(--var-data-table--color-tinted-black);
    font-weight: bold;
    /* font: var(--font-bold); */
  }

  .row.footer th.cell-container {
    border: none;
    color: var(--var-data-table--color-tinted-black);
  }
`;

export default DataRowStyles;
