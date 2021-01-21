import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';


import './ExpenditureForm.css'
const columns = [
    { key: 'id', name: 'ID', editable: false },
    { key: 'budget_fk', name: 'budget_fk', editable: true },
    { key: 'period', name: 'period', editable: true },
    { key: 'year', name: 'year', editable: true },
    { key: 'amount', name: 'amount', editable: true },
    { key: 'expense_note', name: 'expense_note', editable: true },
    ];
  

class ExpenditureForm extends Component {
    
    state = { 
        rows: [],
    };
    
    // Stage Redux with up to date db info
    async componentDidMount() {

      this.setState ({
        rows: this.props.expenseList
      })

      console.log (`In Expense Did Mount`, this.state.rows);

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
        charNumberNew += cents
        return charNumberNew;
    
        function reverseString(str) {
            return str.split("").reverse().join("");
        }
    }  // end of convertNumToMoneyString fn
    
    
    

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
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        });
        console.log('')
    };
      
    
    
    render() {
        return (
            <div className="pageDivClass">
            <p>length: {this.state.rows.length}</p>

                <div  className="datGridClass">

                <ReactDataGrid
                    // rows={rows}
                    columns={columns}
                    rowGetter={i => this.state.rows[i]}
                    rowsCount={this.state.rows.length}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    enableCellSelect={true}
                 />
            
                </div>
                
            </div>
             
        );
    }
}

  

export default connect(mapStoreToProps)(ExpenditureForm);
 