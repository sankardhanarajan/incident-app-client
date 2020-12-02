import React, { Component } from 'react';
import { getAllApps, getAllCauses, createOutage } from '../util/APIUtils';
import { withRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Form, Button, notification } from 'antd';
import './Kpi.css';
import "react-datepicker/dist/react-datepicker.css";

const FormItem = Form.Item;

class Kpi extends Component {

  constructor(props) {
    super(props);
    this.state = {
        apps: [],
        causes:[],
        selectedApp:"1",
        selectedCause:"1",
        startDate: new Date(),
        isLoading: false
    };
    this.loadAppList = this.loadAppList.bind(this);
    this.loadCauseList = this.loadCauseList.bind(this);
    this.HandleAppChange = this.HandleAppChange.bind(this);
    this.HandleOutageChange = this.HandleOutageChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }

loadAppList() {
  let promise;
  promise = getAllApps();

  if(!promise) {
    return;
  }

  this.setState({
    isLoading: true
    });

  promise            
  .then(response => {
    const apps = this.state.apps.slice();

     this.setState({
        apps: apps.concat(response.content),
        isLoading: false
      })
      }).catch(error => {
          this.setState({
          isLoading: false
          })
        });
    
}

loadCauseList()
{
  let outage;
  outage = getAllCauses();

  if(!outage) {
    return;
  }

  this.setState({
    isLoading: true
    });

  outage            
  .then(response => {
    const causes = this.state.causes.slice();

     this.setState({
        causes: causes.concat(response.content),
        isLoading: false
      })
      }).catch(error => {
          this.setState({
          isLoading: false
          })
        });
    
}

handleDateChange(date) {
  this.setState({
    startDate: date
  })
}

  componentDidMount() 
  {
    this.loadAppList();
    this.loadCauseList();
  }

  HandleAppChange(e)
  {
    const selectedIndex = e.target.value;
    
    this.setState({
    selectedApp: selectedIndex
    })
  }

  HandleOutageChange(e)
  {
    const selIndex = e.target.value;
    
    this.setState({
    selectedCause: selIndex
    })
  }

  handleSubmit(e)
  {
    e.preventDefault();
        const OutageData = {
          app_id: this.state.selectedApp,
          rootcasuse_id: this.state.selectedCause,
          dateCreated: this.state.startDate
        };

        createOutage(OutageData)
        .then(response => {
          notification.success({
            message: 'Application KPI',
            description: "You Entry has been Registered",
          });
          this.loadCurrentUser();
            this.props.history.push("/kpi/new");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
            } else {
                notification.error({
                    message: 'Application health KPI  App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
  }
render() {
  
    return (
      <div className="new-poll-container">
                <h1 className="page-title">Application Outage</h1>
                <div className="new-poll-content">
                <Form onSubmit={this.handleSubmit} className="create-poll-form">
                <FormItem className="poll-form-row"> 
                 Application Name : <select value={this.state.selectedApp}
                      onChange={this.HandleAppChange}
                      >
                      {this.state.apps.map(app => (
                      <option
                        key={app.id}
                        value={app.id}
                      >
                        {app.appName}
                      </option>
                        ))}
                      </select>
                  </FormItem> 
                      
              <FormItem className="poll-form-row">
                   Outage Cause : <select value={this.state.selectedCause}
                      onChange={this.HandleOutageChange}
                      >
                      {this.state.causes.map(rcause => (
                      <option
                        key={rcause.id}
                        value={rcause.id}
                      >
                        {rcause.cause}
                      </option>
                        ))}
                      </select>
                </FormItem>
                <FormItem>
                      Date : <DatePicker
                      selected={ this.state.startDate }
                      onChange={ this.handleDateChange }
                      name="startDate"
                      dateFormat="MM/dd/yyyy"
                   />
                    
                </FormItem>

                <FormItem className="poll-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="create-poll-form-button">Submit</Button>
                </FormItem>
                </Form>                 
      </div>
      </div>
    );
  }

}

export default withRouter(Kpi);