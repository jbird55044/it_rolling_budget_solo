import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

import './ReportItem1.css'


class ReportItem1 extends Component {

    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        // this.props.dispatch({type: 'FETCH_EXPENSEFILL', recordFinder: {
        //     recordId: this.props.lineItem.id,
        //     }
        // });
        
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
    

    render() {
        return (
            <>
            <tr>
                {/* {JSON.stringify(this.props.lineItem)} */}
                <td>{this.props.lineItem.id}</td>
                <td>{this.props.lineItem.nomenclature}</td>
                <td>{this.props.lineItem.gl_account}</td>
                <td>{this.props.lineItem.gl_name}</td>
                <td>{this.props.lineItem.cost_center}</td>
                <td>{this.props.lineItem.description}</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td>Cap Life: {this.props.lineItem.life_nominclature}</td>
                <td>&nbsp;</td>
                <td>Total Cost:</td>
                <td> ${this.convertNumToMoneyString(this.props.lineItem.total)}</td>
            </tr>
            </>
        )
    }
}


export default connect(mapStoreToProps)(ReportItem1);
 