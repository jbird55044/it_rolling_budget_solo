import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import './ExpenditureForm.css'





      


class ExpenditureForm extends Component {
    
    state = {
   
    }
    
    // Stage Redux with up to date db info
    async componentDidMount() {
      console.log (`In Expense Did Mount`);
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
    

   
    
    
    render() {
        return (
            
            <div>
                <h3>Total: {this.props.total}</h3>
                {this.props.expenseList.map((expenses, index) => {
                        return (
                            <div key={index}>
                            {/* <p>Expense Info</p> {budgetForm.id} */}
                            {JSON.stringify(expenses)}
                            </div>
                        );
                })}
            </div>
             
        );
    }
}

  

export default connect(mapStoreToProps)(ExpenditureForm);
 