import React from 'react';

class App extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log('Component Did Mount!!!');
  }

  render() {
    return <h1>React Works!</h1>;
  }
}

export default App;
