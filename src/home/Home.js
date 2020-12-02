import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Home extends Component {

    render() {

        return (
            <img src="../Home.jpg" id="bg" alt=""></img>
        );
    }

}
export default withRouter(Home);