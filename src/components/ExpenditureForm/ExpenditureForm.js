import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';

import './ExpenditureForm.css'

const moneyFormatter = ({ value }) => {
    return <p>${value}</p>;
  };
  

const columns = [
    { key: 'id', name: 'ID', editable: false, width: 60 },
    { key: 'period', name: 'period', editable: true , width: 75 },
    { key: 'year', name: 'year', editable: true , width: 75},
    { key: 'amount', name: 'amount', editable: true, formatter: moneyFormatter, width: 150 },
    { key: 'expense_note', name: 'expense_note', editable: true },
    ];
  

class ExpenditureForm extends Component {
    
    state = { 
        allRows: [],
        budgetId: 0,
        recordCount: 0,
        relitiveRecordId: 0,
    };
    
    // Stage Redux with up to date db info
    async componentDidMount() {
        let row = {};
        let stagedRow = {}
        let formattedRows = [];
        
        this.setState ({
            budgetId: this.props.currentBudgetId,
            relitiveRecordId: this.props.relitiveRecordId
          })
        for (row of this.props.store.budgetForm.expenseFillList) {
            stagedRow.id = row.id; 
            stagedRow.period = row.period;
            stagedRow.year = row.year;
            stagedRow.amount = row.amount;
            stagedRow.expense_note= row.expense_note;
            stagedRow.archived= row.archived;
           
            formattedRows.push (stagedRow);
            stagedRow={};
        }

        this.setState ({
            allRows: formattedRows,
            recordCount: formattedRows.length
        })

      console.log (`In Expense Did Mount`, this.state.allRows);

    }

    convertNumToMoneyString = (number) => {
        // convert to money format
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
    
    
    addRow = () => {
        let newRecord ={
            period: '',
            year: '',
            amount: 0,
            expense_note: '<-',
            archived: false
        }
        this.props.dispatch({type: 'ADD_ROW_EXPENSEGRID', payload: {
            newRecord: newRecord,
            businessUnitId: this.props.store.user.id,
            budgetId: this.state.budgetId,
            }
        })
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            relitiveRecordId: this.state.relitiveRecordId,
            }
        });
    }

    getDate = () => {
        let today = new Date();
        let date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
        return date
    }  // end of getDate fn

    cleanSqlDate = (fieldValue, fieldName) => {
        let year = fieldValue.slice(0, 4);
        let month = fieldValue.slice(5, 7);
        let day = fieldValue.slice(8, 10);
        return `${month}/${day}/${year}`
    };
    
    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState(state => {
            const allRows = state.allRows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                allRows[i] = { ...allRows[i], ...updated };
            }
            return { allRows };
        });
        console.log('')
    };

    refreshExpenseTable = () => {
        this.setState ({
            allRows: this.props.store.budgetForm.expenseFillList,
            recordCount: this.props.store.budgetForm.expenseFillList.length
        })
    }
      
    saveGrid = () => {
        console.log (`In Save Grid`);
        this.props.dispatch({type: 'REPLACE_EXPENSEGRID', payload: {
            allRows: this.state.allRows,
            businessUnitId: this.props.store.user.id,
            budgetId: this.state.budgetId,
            relitiveRecordId: this.state.relitiveRecordId
            }
        })
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            relitiveRecordId: this.state.relitiveRecordId,
            }
        });
        this.props.toggleExpense();
    }

    deleteAllRows = () => {
        console.log (`in Delete All Rows`);
        this.props.dispatch({type: 'DELETE_ALL_ROWS', payload: {
            allRows: this.state.allRows,
            businessUnitId: this.props.store.user.id,
            budgetId: this.state.budgetId,
            relitiveRecordId: this.state.relitiveRecordId
            }
        })
        // this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
        //     businessUnitId: this.props.store.user.id,
        //     relitiveRecordId: this.state.relitiveRecordId,
        //     }
        // });
        this.props.toggleExpense();
    }

    addRow = () => {
        let newRecord ={
            period: '',
            year: '',
            amount: 0,
            expense_note: '<-',
            archived: false
        }
        this.props.dispatch({type: 'ADD_ROW_EXPENSEGRID', payload: {
            newRecord: newRecord,
            businessUnitId: this.props.store.user.id,
            budgetId: this.state.budgetId,
            relitiveRecordId: this.state.relitiveRecordId
            }
        })
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            relitiveRecordId: this.state.relitiveRecordId,
            }
        });
        this.props.toggleExpense();
    }
    
    render() {
        return (
            <div className="pageDivClass">
            {/* <p>length: {this.state.allRows.length}</p> */}

                <div  className="datGridClass">
                    <button className="buttonClass" onClick={this.addRow}>Add Row</button>
                    <button className="buttonClass" onClick={this.refreshExpenseTable}>Refresh</button>
                    <button className="buttonClass" onClick={this.saveGrid}>Save and Close</button> 
                    <button className="buttonClass largeMarginClass" onClick={this.deleteAllRows}>Delete ALL</button>
                    <button className="buttonClass largeMarginClass" onClick={this.props.toggleExpense}>Cancel Changes</button>

                    <ReactDataGrid
                        // rows={rows}
                        columns={columns}
                        rowGetter={i => this.state.allRows[i]}
                        rowsCount={this.state.recordCount}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true}
                    />
                
                </div>
                
            </div>
             
        );
    }
}

  

export default connect(mapStoreToProps)(ExpenditureForm);
 