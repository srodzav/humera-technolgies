"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
    // variables
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchProjects() {
        setIsLoading(true);
        setError("");
        try {
            // simulation
            // await new Promise (r => setTimeout(r, 3000));
            // throw new Error("Simulated server error");

            const res = await fetch("/api/projects");
            const data = await res.json();
            if (data.ok) {
                setProjects(data.data);
            } else {
                setError(data.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    async function createProject() {
        setError("");
        if (!name || name.trim().length === 0) {
            return setError("Please verify name");
        }

        const res = await fetch("/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name })
        });

        if (!res.ok) {
            setError("Failed to create Project");
        }

        setName("");
        fetchProjects();
    }

    return (
        <div className="container">
            <h2>Project List</h2>

            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}

            <div className="columns">
                <input className="input" placeholder="Name" value={name} onChange={e=> setName(e.target.value)} />

                <button className="btn btn-action" onClick={createProject} disabled={isLoading}> {isLoading ? "Loading..." : "Add Project"} </button>
            </div>

            {isLoading ? (
                <p className="text-centered">Loading projects...</p>
            ) : projects.length > 0 ? (
            <ul className="table">
                <li className="row-single header">
                    <span> Name </span>
                    <span> Created At </span>
                    <span> Actions </span>
                </li>
                {projects.map((project: any) => (
                    <li className="row-single" key={project.id}>
                        <span> {project.name} </span>
                        <span> {new Date(project.createdat).toLocaleString()} </span>
                        <Link className="btn btn-primary" href={`/tasks/${project.id}`}> View Tasks </Link>
                    </li>
                ))}
            </ul>) : (<p className="text-centered">No projects found. Please add a project.</p>)}
        </div>
    );
}