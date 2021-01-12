import React from 'react';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

const AboutPage = () => (
  <div className="container">
    <div>
      <h3>Welcome to the IT Rolling Budget Manager!</h3>
      <p>This awesome tool is the tool of all tools to manage complex</p>
      <p>&nbsp;</p>
      <p>Credit:  James Bird</p>
      <p>Contact Info: </p>
      <a href="https://www.JamesDBird.com" target="_blank"  rel="noopener noreferrer">https://www.JamesDBird.com</a>

    </div>
  </div>
);

export default AboutPage;
