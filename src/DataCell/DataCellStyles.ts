import { css } from "lit";

const DataCellStyles = css`
:host {
  display: block;
  padding: 25px;
  color: var(--data-table-text-color, #000);
}

.cell{
    display: flex;
    min-height: 48px;
    height: fit-content;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-left: 16px;
    padding-right: 16px;
}

.wraps{
    white-space: nowrap;
}

.icon-container{
    cursor: pointer;
}

.icon-container.settings, .icon-container.copy, .icon-container.chevron{
    color: blueviolet;
}

.icon-container.alert{
    color: blueviolet;
}

.icon-container.copy{
    transition: opacity 0.2s ease-in-out 0.1s;
}

.cell:hover .icon-container.copy{
    opacity: 1;
}

.icon-container.copy{
    opacity: 0;
}

.cell.justify-content-center{
    justify-content: center;
}

.cell.justify-content-flex-start{
    justify-content: flex-start;
}

.cell.justify-content-flex-end{
    justify-content: flex-end;
}

.cell.justify-content-space-between{
    justify-content: space-between;
}

.cell.justify-content-space-around{
    justify-content: space-around;
}

.cell.justify-content-space-evenly{
    justify-content: space-evenly;
}

.cell.align-items-auto {
    align-items: auto;
}

.cell.align-items-flex-start {
    align-items: flex-start;
} 

.cell.align-items-flex-end{
    align-items: flex-end;
}

.cell.align-items-center{
    align-items: center;
}

.cell.align-items-stretch {
    align-items: stretch;
}

.cell.align-items-baseline {
    align-items: baseline;
}

.cell.hidden{
    display: none;
}

.cell.empty{
  visibility: hidden;
}

`;

export default DataCellStyles;