import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import mapStoreToProps from '../../redux/mapStoreToProps';

const Nav = (props) => {
  let loginLinkData = {
    path: '/login',
    text: 'Login / Register',
  };

  if (props.store.user.id != null) {
    loginLinkData.path = '/user';
    loginLinkData.text = 'Home';
  }

  return (
    <div className="nav">
      <div>
        <Link to="/home">
            <h3 className="nav-title-left">IT Rolling Budget Manager.  </h3>
            <h3 className="nav-title-right">Dept: {props.store.user.bu_description}</h3>
        </Link>

      </div>
      <div className="nav-menu">
        <Link className="nav-link" to={loginLinkData.path}>
          {/* Show this link if they are logged in or not,
          but call this link 'Home' if they are logged in,
          and call this link 'Login / Register' if they are not */}
          {loginLinkData.text}
        </Link>
        <Link className="nav-link" to="/about">
          About
        </Link>
        {/* Show the link to the info page and the logout button if the user is logged in */}
        {props.store.user.id && (
          <>
            <LogOutButton className="nav-link" />
            <Link className="nav-link" to="/adminpage">
              Admin
            </Link>
            <Link className="nav-link" to="/reportmenu">
              Reporting
            </Link>
            <Link className="nav-link" to="/budgetform">
              Budget Form
            </Link>
            <Link className="nav-link" to="/recordpicker">
              Record Picker
            </Link>
           
          </>
        )}
        {/* Always show this link since the about page is not protected */}
       
      </div>
    </div>
  );
};

export default connect(mapStoreToProps)(Nav);
