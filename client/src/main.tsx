import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { FluentProvider, teamsDarkTheme } from '@fluentui/react-components';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootRoute from './routes/root.tsx';
import LoginContextProvider, { SessionContext } from './components/session.tsx';
import { LoginRoute } from './routes/login.tsx';
import HomeRoute from './routes/home.tsx';
import ProjectsRoute from './routes/projects.tsx';

// TODO: Load routes dynamically
//  Consider aspects?
//  Auto reloads?
const router = () => createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    children: [
      {
        path: "",
        element: <HomeRoute />
      },
      {
        path: "login",
        element: <LoginRoute />
      },
      {
        path: "projects",
        element: <ProjectsRoute />
      }
    ]
    // loader: rootLoader,
    // children: [
    //   {
    //     path: 'team',
    //     element: <Team />,
    //     loader: teamLoader
    //   }
    // ]
  }
]);

const RouterWrapper = () => {
  const sessionContext = useContext(SessionContext)

  return <RouterProvider router={router()} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={teamsDarkTheme}>
      <LoginContextProvider>
        <RouterWrapper />
      </LoginContextProvider>
    </FluentProvider>
  </React.StrictMode>
);
