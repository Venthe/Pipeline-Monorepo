import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {FluentProvider, teamsDarkTheme} from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <FluentProvider theme={teamsDarkTheme}>
            <App/>
        </FluentProvider>
    </React.StrictMode>,
)
