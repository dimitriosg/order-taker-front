// frontend\src\components\RoleSwitcher.js
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    setOriginalRole, 
    setHasSwitchedRole, 
    switchRoleAndNavigate 
} from '../slices/roleSwitchSlice.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../api';
import ErrorModal from './ErrorModal-danger';
import { set } from 'mongoose';


const RoleSwitcher = () => {
    console.log(localStorage);  // Debugging line
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const originalRole = setOriginalRole;
    const [selectedRole, setSelectedRole] = useState('');

    const [hasSwitchedRole, setHasSwitchedRole] = useState(false);
    const [hasAppliedRole, setHasAppliedRole] = useState(false);

    const [roles, setRoles] = useState([]); // array of roles (dropdownlist)
    const [isOnDashboard, setIsOnDashboard] = useState(location.pathname.includes('/dashboard/'));
    // the above is tracker for whether or not the user is on the dashboard page

    useEffect(() => { // fetching roles to dropdown list
        const fetchRoles = async () =>{
            try {
                const response = await api.get('/api/users/roles');
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => { // Update isOnDashboard whenever the location changes
        setIsOnDashboard(location.pathname.includes('/dashboard/'));
    }, [location.pathname]);

    useEffect(() => { // Update hasSwitchedRole based on selectedRole and originalRole
        if (selectedRole !== originalRole) {
            setHasSwitchedRole(true);
        } else {
            setHasSwitchedRole(false);
        }
    }, [originalRole, selectedRole]);

    useEffect(() => { 
        // logic here
    }, []);//, dependencies


    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setSelectedRole(event.target.value);
        console.log('(handleRoleChange) Selected Role:', selectedRole);
    };

    const handleApplyRole = async () => {
        dispatch(switchRoleAndNavigate({ newRole: selectedRole, navigate }))
            .then((action) => {
                if (action.payload.success) {
                    dispatch(setSelectedRole(action.payload.newRole));
                    dispatch(setHasSwitchedRole(true));
                } else {
                    // Handle error case
                    window.displayError(action.payload.message);
                }
            });
    };

    const handleRevertRole = async () => {
        dispatch(switchRoleAndNavigate({ newRole: originalRole, navigate }))  // pass an object with newRole and navigate
          .then((action) => {
            if (action.payload.success) {
              setHasSwitchedRole(false);
            }
          });
    };

    //////////////////////
    return (
        <div className="d-flex align-items-center">
            <select 
                value={selectedRole} 
                onChange={handleRoleChange} 
                className="form-select m-2" 
                id="custom-width-role-selector"
            >
                <option value="" disabled>Select role</option>
                {roles.map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                ))}
            </select>
            <button onClick={handleApplyRole} className="btn btn-success m-2">
                Apply
            </button>
            <hr className="m-2" />
            
            {console.log({hasSwitchedRole, isOnDashboard, hasAppliedRole})}
            {/* {hasSwitchedRole && isOnDashboard && hasAppliedRole && ( */}
            {/* OR */}
            {/* { (isOnDashboard && hasSwitchedRole) && */}
            { (isOnDashboard && hasSwitchedRole && hasAppliedRole) &&
                <button 
                    onClick={handleRevertRole} 
                    className="btn btn-warning m-2"
                    id="revert-to-original-role-button"
                >
                    Revert to Original Role
                </button>
            }
            {/* )} */}
            <ErrorModal />
        </div>
    );
};

export default RoleSwitcher;
