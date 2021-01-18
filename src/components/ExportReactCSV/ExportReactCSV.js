import React from 'react'
import { CSVLink } from 'react-csv'
import Button from 'react-bootstrap/Button';

// code from:
// https://blog.bitsrc.io/exporting-data-to-excel-with-react-6943d7775a92


export const ExportReactCSV = ({csvData, fileName}) => {
    return (
        <Button className="buttonExportClass">
            <CSVLink className="buttonExportClass" data={csvData} filename={fileName}>Export CSV</CSVLink>
        </Button>
    )
}