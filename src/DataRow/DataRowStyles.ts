import { css } from "lit";

const DataRowStyles = css`
.row{
    background-color: white;
}

.row td.cell-container{
    border-top: 1px solid grey;
    border-bottom: 1px solid grey;
}

.row td.cell-container:first-of-type{
    border-left: 1px solid grey;
    padding-left: 4px;
}

.row td.cell-container:last-of-type{
    border-right: 1px solid grey;
    padding-right: 4px;
}

.table.wide-style > tbody > tr.row td.cell-container:first-of-type{
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
}

.table.wide-style > tbody > tr.row td.cell-container:last-of-type{
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
}

.row.header{
    background-color: transparent;
    color: black;
    /* font: var(--font-bold); */
    font-weight: bold;
}

.row.header th.cell-container{
    border: none;
    color: black;
}

.row.sub-row.hidden{
    display: none;
}

.row.with-subrows.subrows-hidden > .cell-container{
    border-bottom: 2px solid grey;
}

.row.with-subrows.subrows-open > .cell-container{
    border-bottom: none;
}

.table.wide-style > tbody > tr.row.with-subrows.subrows-open > .cell-container:first-of-type {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 0px;
}

.table.wide-style > tbody > tr.row.with-subrows.subrows-open > .cell-container:last-of-type{
    border-top-right-radius: 16px;
    border-bottom-right-radius: 0px;
}

.row.sub-row{
    background-color: lightgrey;
}

.table.wide-style > tbody > tr.row.sub-row.intermediate-subrow > .cell-container:first-of-type, .table.wide-style > tbody > tr.row.sub-row.intermediate-subrow > .cell-container:last-of-type{
    border-radius: 0px;
}

.table.wide-style > tbody > tr.row.sub-row.last-subrow > .cell-container:first-of-type{
    border-top-left-radius: 0px;
    border-bottom-left-radius: 16px;
}
.table.wide-style > tbody > tr.row.sub-row.last-subrow > .cell-container:last-of-type{
    border-top-right-radius: 0px;
    border-bottom-right-radius: 16px;
}

.row.sub-row.row.sub-row.intermediate-subrow > .cell-container{
    border-bottom: none;
}

.row.with-subrows.subrows-hidden.with-preview.preview-open > .cell-container{
    border-bottom: 1px solid grey;
}

.row.with-subrows.subrows-hidden.with-preview.preview-hidden > .cell-container{
    border-bottom: 1px solid grey;
}

.table.wide-style > tbody > tr.row.with-preview.preview-open > .cell-container:first-of-type {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 0px;
}

.table.wide-style > tbody > tr.row.with-preview.preview-open > .cell-container:last-of-type{
    border-top-right-radius: 16px;
    border-bottom-right-radius: 0px;
}

.row.preview-subrow{
    background-color: lightgrey;
}

.row.footer{
    background-color: transparent;
    color: black;
    font-weight: bold;
    /* font: var(--font-bold); */
}

.row.footer th.cell-container{
    border: none;
    color: black;
}
`;

export default DataRowStyles;