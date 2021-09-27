import React from 'react';
import { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import MainPage from './MainPage';


export const PrivateRoute = ({ component: Component, role = [0], apiLink = "", tabValue = 0, name = "Page", showTab = false, ...rest }) => {

    const test = (props) => {
        if (localStorage.getItem("authToken") !== null) {
            const roleUser = JSON.parse(localStorage.getItem("user")).role_id;
            //console.log(role);
            //console.log(roleUser);
            //console.log(role.includes(roleUser));
            if (!role.includes(roleUser)) {
                return (<div>dilarang</div>);

            } else {
                return (<MainPage tabValue={tabValue} showTab={showTab}>
                    <Component  tabValue={tabValue} apiLink={apiLink} pageName={name} />
                </MainPage>);
            }


        } else {
            return (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />);
        }
    }

    return (<Route
        {...rest}
        render={props => test(props)}
    />
    );
}
