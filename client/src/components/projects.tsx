import { Button } from "@fluentui/react-components";
import { useEffect, useState } from "react";

const Projects = () => {
    const [projects, setProjects] = useState<unknown[]>([])

    const _fetch = () => fetch("/api/projects", { method: "GET", headers: { "Accept": "application/json;text/json" } })
        //.then(e => {console.log(e); return e;})
        .then(a => a.json())
        .then(a => a.map(JSON.parse))
        .then(a=> {
            a.sort((v: any, b: any) => (v.id).localeCompare(b.id));
            return a;
        })
        .then(setProjects)
        // .then(console.log)
        .catch(console.error)


    useEffect(() => {
        _fetch()
    }, [])

    return (<>
        <Button onClick={_fetch}>Refresh</Button>
        <table>
            <thead>
                <tr>
                    <td>id</td>
                    <td>state</td>
                    <td>ssh</td>
                    <td>http</td>
                </tr>
            </thead>
            <tbody>
                {projects.map((p: any) => <Project key={p.id} {...p} />)}
            </tbody>
        </table>
        </>
    );
}

const Project = ({ id, parent, ssh, state, http, web_links }: any) => {
    return (
        <tr>
            <td><a href={`https://gerrit.home.arpa${web_links[0].url}`}>{id.replace("%2F", "/")}</a></td>
            <td>{state}</td>
            <td><a href={http}>HTTP</a></td>
            <td><a href={ssh}>SSH</a></td>
        </tr>
    )
}

export default Projects;