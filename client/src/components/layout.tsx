import React from "react";
import Content from "./content";
import Navigation from "./navigation";
import './layout.css'

const Layout = ({ children }: { children: React.ReactElement }) => {
    return (
        <>
            <div className="layout">
                <Navigation />
                <Content>{children}</Content>
            </div>
        </>
    );
}

export default Layout;