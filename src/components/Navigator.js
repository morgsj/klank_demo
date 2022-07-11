import React, { useEffect } from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useNavigate } from 'react-router-dom';

import './Navigator.css';
import { List } from 'react-bootstrap-icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Navigator = () => {

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
    }, [user, loading]);

    return (<>
        <div id="sidebar-container">
            <CDBSidebar id="sidebar">
                <CDBSidebarHeader prefix={<List id="list-icon" />}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        <img id="logo" src={require("../images/logo_transparent.png")} />
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                <CDBSidebarMenu>
                    <NavLink exact to="/dashboard" activeClassName="activeClicked">
                        <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/messages" activeClassName="activeClicked">
                        <CDBSidebarMenuItem icon="dice">Messages</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to={user ? `/profile/${user.uid}` : "/"} activeClassName="activeClicked">
                        <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/settings" activeClassName="activeClicked">
                        <CDBSidebarMenuItem icon="video">Settings</CDBSidebarMenuItem>
                    </NavLink>
                </CDBSidebarMenu>
                </CDBSidebarContent>

            </CDBSidebar>
        </div>
    </>);
};

export default Navigator;