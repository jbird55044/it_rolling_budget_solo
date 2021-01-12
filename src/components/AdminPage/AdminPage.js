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
        this.props.dispatch({type: 'FETCH_TLIST_GLCODE'});
        this.props.dispatch({type: 'FETCH_TLIST_BUSINESSUNIT'});
        this.props.dispatch({type: 'FETCH_TLIST_FREQUENCY'});

    }

    render() {
        return (
            <div className="homePageClass">
                <h3>Admin Page</h3>
                <p>Here you will be able to do great stuff.</p>
                <button onClick={this.tlistRefresher}>Refresh all T-Lists</button>

                <p>Frequency</p>
                        {this.props.store.tlist.tlistFrequency.map((frequency, index) => {
                                return (
                                    <div key={index}>
                                    {JSON.stringify(frequency)}
                                    </div>
                                );
                        })}

                <p>Business Unit</p>
                    {this.props.store.tlist.tlistBusinessUnit.map((businessUnit, index) => {
                            return (
                                <div key={index}>
                                {JSON.stringify(businessUnit)}
                                </div>
                    );
                })}

                <p>GL Code</p>
                        {this.props.store.tlist.tlistGlcode.map((glcode, index) => {
                                return (
                                    <div key={index}>
                                    {JSON.stringify(glcode)}
                                    </div>
                                );
                        })} 

            </div>
        );
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(AdminPage);
 