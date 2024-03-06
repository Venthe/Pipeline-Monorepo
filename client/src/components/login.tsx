import { useContext, useEffect } from "react"
import { SessionContext } from "../components/session"
import { Button } from "@fluentui/react-components"

const Login = () => {
    const sessionContext = useContext(SessionContext)

    const remainingTime = sessionContext?.user?.timeRemaining

    if (sessionContext?.user?.isAuthenticated) {
        return <>
        Logged in as {sessionContext.user.login}
        <Button onClick={() => sessionContext?.logout()}>logout</Button>
        Remaining time: {Math.floor((remainingTime ?? 0) / 1000)}s
        </>
    }

    return <><Button onClick={() => sessionContext?.login()}>Login</Button></>
}

export default Login;