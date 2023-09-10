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

const DataCellStyles = css`
  :host {
    display: block;
    padding: 1.5rem;
  }

  .cell {
    display: flex;
    min-height: 3rem;
    height: fit-content;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .wraps {
    white-space: nowrap;
  }

  .icon-container {
    cursor: pointer;
  }

  .icon-container.settings,
  .icon-container.copy,
  .icon-container.chevron {
    color: var(--var-data-table--color-primary);
  }

  .icon-container.alert {
    color: var(--var-data-table--color-primary);
  }

  .icon-container.copy {
    transition: opacity 0.2s ease-in-out 0.1s;
  }

  .cell:hover .icon-container.copy {
    opacity: 1;
  }

  .icon-container.copy {
    opacity: 0;
  }

  .cell.justify-content-center {
    justify-content: center;
  }

  .cell.justify-content-flex-start {
    justify-content: flex-start;
  }

  .cell.justify-content-flex-end {
    justify-content: flex-end;
  }

  .cell.justify-content-space-between {
    justify-content: space-between;
  }

  .cell.justify-content-space-around {
    justify-content: space-around;
  }

  .cell.justify-content-space-evenly {
    justify-content: space-evenly;
  }

  .cell.align-items-auto {
    align-items: auto;
  }

  .cell.align-items-flex-start {
    align-items: flex-start;
  }

  .cell.align-items-flex-end {
    align-items: flex-end;
  }

  .cell.align-items-center {
    align-items: center;
  }

  .cell.align-items-stretch {
    align-items: stretch;
  }

  .cell.align-items-baseline {
    align-items: baseline;
  }

  .cell.hidden {
    display: none;
  }

  .cell.empty {
    visibility: hidden;
  }
`;

export default DataCellStyles;
