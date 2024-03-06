import { NavLink } from "react-router-dom";
import { useContext } from "react"
import { SessionContext } from "../components/session"

const Navigation = () => {
    const sessionContext = useContext(SessionContext)

    return (<>
        <nav style={{ display: "flex", flexDirection: "column" }}>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/login"}>Login</NavLink>
            <NavLink to={"/projects"}>Projects</NavLink>
        </nav>
        </>)
}

export default Navigation;