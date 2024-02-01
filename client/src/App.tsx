import {Button, Input, Label, useId,} from "@fluentui/react-components";
import {useEffect, useRef} from "react";
import Keycloak, {KeycloakConfig, KeycloakInitOptions} from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:15380/auth',
    realm: 'Example',
    clientId: 'example-client',
}

const keycloak = new Keycloak(keycloakConfig)
const initOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
};
const kc = keycloak.init(initOptions)

function App() {
    const login = useId("login");
    const pasword = useId("password");

    const passwordData = useRef<string>();
    const loginData = useRef<string>();

    useEffect(() => {
        kc.then((auth) => {
            if (!auth) {
                window.location.reload();
            } else {
                console.info("Authenticated", keycloak.tokenParsed);
            }
            setTimeout(() => {
                keycloak.updateToken(70).then((refreshed) => {
                    if (refreshed) {
                        console.debug('Token refreshed' + refreshed);
                    } else {
                        console.warn('Token not refreshed, valid for '
                            + Math.round((keycloak.tokenParsed?.exp ?? 0) + (keycloak.timeSkew ?? 0) - new Date().getTime() / 1000) + ' seconds');
                    }
                }).catch(() => {
                    console.error('Failed to refresh token');
                });

            }, 60000)
        }).catch(() => {
            console.error("Authenticated Failed");
        });
    }, [])

    const loginClick = () => {
        console.log(loginData, passwordData);
    }

    const _2faClick = () => {
        console.log("2FA");
    }


    const logout = () => {
        keycloak.logout().then(console.log).catch(console.error)
    }

    return (
        <>
            <div>
                <Label htmlFor={login} size={"medium"} disabled={false}>
                    Login
                </Label>
                <Input id={login} onInput={e => {
                    passwordData.current = e.currentTarget.value;
                }}/>
            </div>
            <div>
                <Label htmlFor={pasword} size={"medium"} disabled={false}>
                    Password
                </Label>
                <Input id={pasword} onInput={e => {
                    loginData.current = e.currentTarget.value;
                }}/>
            </div>
            <div>
                <Button onClick={() => loginClick()}>Normal</Button>
            </div>
            <div>
                <Button onClick={() => _2faClick()}>2FA</Button>
            </div>
            <div>
                <Button onClick={() => logout()}>Logout</Button>
            </div>
        </>
    )
}


export default App
