import React from 'react';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'



class InfoPage extends React.Component {

  render() {
    return (
      <div>
        <p>You have reached the IT Rolling Budget Info Page</p>
        <p>Welcome!</p>
      </div>
    )
  }
}



export default InfoPage;