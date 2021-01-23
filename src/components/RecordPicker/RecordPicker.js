import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { useEffect } from 'react';

import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from "react-data-grid-addons";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import {useDispatch} from 'react-redux'

import './RecordPicker.css'


function RecordPicker() {
    const dispatch = useDispatch();
    let [selectedYear, setSelectedYear] = useState ('');
    let [allRows, setAllRows] = useState ([]);
    let [budgetId, setBudgetId] = useState (0);
    let [recordCount, setRecordCount] = useState (0);
    let [relitiveRecordId, setRelitiveRecordId] = useState (0);
    const selectors = Data.Selectors
    const [filters, setFilters] = useState({});
    const filteredRows = getRows(allRows, filters);

    const reduxStoreTaco = useSelector(store => store)
    
    // const styles = theme => ({
    //     container: {
    //         display: 'flex',
    //         flexWrap: 'wrap',
    //     },
    //     margin: {
    //         margin: theme.spacing.unit,
    //         paddingTop: theme.spacing.unit,
    //         paddingBottom: theme.spacing.unit,
    //     },
    //     textField: {
    //         flexBasis: 200,
    //     },
    // });
    // const { classes } = styles;

    //equivalant to Component did mount 
    let renderQuantity=[]
    useEffect(() => {
        dispatch({type: 'FETCH_TLIST_YEAR'});
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        dispatch({type: 'FETCH_BUDGETREPORT1', recordFinder: {
            businessUnitId: reduxStoreTaco.user.id,
            selectedYear: reduxStoreTaco.budgetReport.reportSelectedYear,
            }
        });
        dispatch({type: 'FETCH_BUDGETREPORT1SUM', recordFinder: {
            businessUnitId: reduxStoreTaco.user.id,
            selectedYear: reduxStoreTaco.budgetReport.reportSelectedYear,
            }
        });
    }, renderQuantity)
    
    const moneyFormatter = ({ value }) => {
        return <p>${value}</p>;
    };
    

    const columns = [
        { key: 'id', name: 'ID', editable: false, width: 60 },
        { key: 'cost_center', name: 'CC', editable: false, filterable: true, width: 75 },
        { key: 'nomenclature', name: 'Nomenclature', editable: false , filterable: true, width: 150 },
        { key: 'needs_review', name: 'Review', editable: false , filterable: true, width: 75},
        { key: 'gl_name', name: 'GL Name', editable: false, filterable: true, width: 125 },
        { key: 'frequency', name: 'Frequency', editable: false },
        { key: 'total', name: 'Total', editable: true, filterable: true, formatter: moneyFormatter, width: 150 },
        { key: 'detail', name: 'Detail', editable: false },
        ];

        const handleFilterChange = filter => filters => {
            const newFilters = { ...filters };
            if (filter.filterTerm) {
              newFilters[filter.column.key] = filter;
            } else {
              delete newFilters[filter.column.key];
            }
            return newFilters;
          };
          


    const refreshExpenseTable = () => {
        let row = {};
        let stagedRow = {}
        let formattedRows = [];
        
        console.log (`Report 1`, reduxStoreTaco.budgetReport.reportBudgetReport1);
        for (row of reduxStoreTaco.budgetReport.reportBudgetReport1) {
            stagedRow.id = row.id; 
            stagedRow.cost_center = row.cost_center;
            stagedRow.nomenclature = row.nomenclature;
            if (row.needs_review) {stagedRow.needs_review = 'Review'}
            stagedRow.gl_name= row.gl_name;
            stagedRow.frequency= row.frequency;
            stagedRow.total= row.total;
            stagedRow.detail= 'detail';
            // console.log (`stagedRow.id`, stagedRow.id ,stagedRow.needs_review);
            
            formattedRows.push (stagedRow);
            stagedRow={};
        }
        setAllRows(formattedRows);
        setRecordCount (formattedRows.length)
        console.log (`In Expense Did Mount`, allRows);
    }

    const handleChange = (event, name) => {
        console.log ('value 1:', event.target.value)
        dispatch({type: 'SET_SELECTEDYEAR', payload: event.target.value});
        dispatch({type: 'FETCH_BUDGETREPORT1', recordFinder: {
            businessUnitId: reduxStoreTaco.user.id,
            selectedYear: event.target.value,
            }
        });
        dispatch({type: 'FETCH_BUDGETREPORT1SUM', recordFinder: {
            businessUnitId: reduxStoreTaco.user.id,
            selectedYear: event.target.value,
            }
        });
    }
     

    const convertNumToMoneyString = (number) => {
        // convert to money format
        if (number < 1 || number === null) return;
        let charNumberNew = '';
        let charNumberOld = '';
        let cents= null;
        charNumberOld = number.toString();
        if ( charNumberOld.indexOf('.') > 0 ) {
            cents = charNumberOld.slice(charNumberOld.indexOf('.'));
            charNumberOld = charNumberOld.slice( 0, charNumberOld.indexOf('.'));
        }
        // reverses string and adds ',' every third location
        let c=0;
        charNumberOld = reverseString(charNumberOld);
        for ( c = 0; c < charNumberOld.length; c += 1 ) {
            if (  (c !== 0) && (c % 3) === 0 ) {
            charNumberNew += (',')
            }
            charNumberNew += charNumberOld[c]
        };
        charNumberNew = reverseString(charNumberNew);
        if ( cents === null ) cents = '.00'
        // charNumberNew += cents
        return charNumberNew;
    
        function reverseString(str) {
            return str.split("").reverse().join("");
        }
    }  // end of convertNumToMoneyString fn

    function getRows(rows, filters) {
        return selectors.getRows({ rows, filters });
    }

        return (
            <div className="pageDivClass">
                <TextField
                    select style = {{minWidth: 100}}
                    variant="outlined"
                    label=""
                    // className={{margin, textField}}
                    value={reduxStoreTaco.budgetReport.reportSelectedYear}
                    onChange={(event)=>handleChange(event, 'selectedYear')}
                    InputProps={{startAdornment: <InputAdornment position="start">Budget Year:</InputAdornment>,}}
                    >
                    <MenuItem value="">
                        </MenuItem>
                            {reduxStoreTaco.tlist.tlistYear.map(records => (
                                <MenuItem key={records.id} value={records.year}>
                                {records.year}
                                </MenuItem>
                            ))}
                </TextField>

                {/* <p>length: {reduxStoreTaco.budgetReport.reportBudgetReport1.length}</p> */}
                {/* <p>sum: {reduxStoreTaco.budgetReport.reportBudgetReport1Sum}</p> */}
                    

                    <div  className="datGridClass">
                        <button className="buttonClass" onClick={refreshExpenseTable}>Refresh</button>
                        {/* <button className="buttonClass" onClick={this.saveGrid}>Save and Close</button>  */}

                        <ReactDataGrid
                            // rows={rows}
                            columns={columns}
                            rowGetter={i => allRows[i]}
                            rowsCount={recordCount}
                            enableCellSelect={true}
                            onAddFilter={filter => setFilters(handleFilterChange(filter))}
                            onClearFilters={() => setFilters({})}
                        />
                    
                    </div>
                
            </div>
        )
}


export default RecordPicker;
// export default connect(mapStoreToProps)(withStyles(styles)(RecordPicker));
 