import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

import './AdminPage.css'


class AdminPage extends Component {
    componentDidMount() {
        console.log (`We are loaded: Admin Page`);        
    }

    tlistRefresher = () => {
        console.log (`Refresh T-Lists Activated`);
        this.props.dispatch({type: 'FETCH_TLIST_BUSINESSUNIT'});
        this.props.dispatch({type: 'FETCH_BUDGET_RECORD_COUNT', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });
        this.props.dispatch({type: 'FETCH_TLIST_COSTCENTER', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });
        this.props.dispatch({type: 'FETCH_TLIST_POINTPERSON', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });
        this.props.dispatch({type: 'FETCH_TLIST_GLCODE'});
        this.props.dispatch({type: 'FETCH_TLIST_FREQUENCY'});
        this.props.dispatch({type: 'FETCH_TLIST_CAPITALIZEDLIFE'});
        this.props.dispatch({type: 'FETCH_TLIST_EXPENDITURETYPE', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });

    }
    
    render() {
        return (
            <div className="homePageClass">
                <h3>Admin Page</h3>
                <p>Here you will be able to do great stuff.</p>
                <button onClick={this.tlistRefresher}>Refresh all T-Lists</button>

                <p style={{textDecoration: "underline"}}>Business Unit</p>
                         {this.props.store.tlist.tlistBusinessUnit.map((businessUnit, index) => {
                             return (
                                 <div key={index}>
                                     {JSON.stringify(businessUnit)}
                                     </div>
                         );
                     })}

                <p style={{textDecoration: "underline"}}>Budget Record Count from CTE sql call</p>
                    {this.props.store.budgetForm.budgetFormCount}

                <p style={{textDecoration: "underline"}}>Cost Centers</p>
                    {this.props.store.tlist.tlistCostCenter.map((costCenter, index) => {
                            return (
                                <div key={index}>
                                {JSON.stringify(costCenter)}
                                </div>
                            );
                    })} 
                    
                <p style={{textDecoration: "underline"}}>Point Person</p>
                     {this.props.store.tlist.tlistCostCenter.map((pointPerson, index) => {
                        return (
                            <div key={index}>
                            {JSON.stringify(pointPerson)}
                            </div>
                        );
                    })} 

                <p style={{textDecoration: "underline"}}>Frequency</p>
                        {this.props.store.tlist.tlistFrequency.map((frequency, index) => {
                            return (
                                <div key={index}>
                                    {JSON.stringify(frequency)}
                                    </div>
                                );
                        })}


                <p style={{textDecoration: "underline"}}>GL Code</p>
                    {this.props.store.tlist.tlistGlcode.map((glcode, index) => {
                            return (
                                <div key={index}>
                                {JSON.stringify(glcode)}
                                </div>
                            );
                    })} 

                <p style={{textDecoration: "underline"}}>Capitalized Life</p>
                    {this.props.store.tlist.tlistCapitalizedLife.map((capLife, index) => {
                            return (
                                <div key={index}>
                                {JSON.stringify(capLife)}
                                </div>
                            );
                    })} 

                <p style={{textDecoration: "underline"}}>Expenditure Type</p>
                    {this.props.store.tlist.tlistExpenditureType.map((expType, index) => {
                            return (
                                <div key={index}>
                                {JSON.stringify(expType)}
                                </div>
                            );
                    })} 
            </div>
        );
    }
}


export default connect(mapStoreToProps)(AdminPage);
 