import { css } from "lit";

const DataTableStyles = css`

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24;
}

.table-wrapper {
    overflow-x: auto;
    min-width: unset;
    scrollbar-width: thin;
    scrollbar-color: blue;
  }
  
  .table-wrapper::-webkit-scrollbar {
    width: 12px;
  }
  
  .table-wrapper::-webkit-scrollbar-track {
    background-color: transparent;
  }
  
  .table-wrapper::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 20px;
    border: 1px solid black;
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
  
  .table.tight-style>tbody>tr.padding-row {
    display: none;
  }
  
  .table.wide-style>tbody>tr.padding-row {
    display: block;
    min-height: 12px;
    max-height: 12px;
  }

  `;

export default DataTableStyles;