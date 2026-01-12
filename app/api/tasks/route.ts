import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/tasks?projectId=$1&status=$2
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    let values: any[] = [projectId];

    // validations
    if (!projectId) {
        return NextResponse.json({ ok: false, message: "Project is required" }, { status: 400 });
    }
    
    let query = "SELECT * FROM tasks WHERE projectId = $1";
    if (status) {
        query += " AND status = $2";
        values.push(status);
    }
    query += " ORDER BY id";

    // error handling
    try {
        const result = await pool.query(query, values);
        return NextResponse.json({ ok: true, message: "Ok", data: result.rows }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error fetching tasks" }, { status: 500 });
    }
}

// POST /api/tasks
export async function POST(req: Request) {
    // error handling
    try{
        const body = await req.json();
        const { title, description, projectId, assignee } = body;

        // validations
        if (!projectId) {
            return NextResponse.json({ ok: false, message: "Project is required" }, { status: 400 });
        }
        if (!title || title.trim().length === 0) {
            return NextResponse.json({ ok: false, message: "Title is required" }, { status: 400 });
        }
        if (!assignee || assignee.trim().length === 0) {
            return NextResponse.json({ ok: false, message: "Assignee is required" }, { status: 400 });
        }

        const result = await pool.query("INSERT INTO tasks (title, description, status, projectId, assignee) VALUES ($1, $2, $3, $4, $5) RETURNING *", [title, description, 'todo', projectId, assignee ]);
        if (result.rowCount === 0) {
            return NextResponse.json({ ok: false, message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true, message: "Task created", data: result.rows[0] }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error creating task" }, { status: 500 });
    }
}

// PUT /api/tasks
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;
        
        // validations
        if (!id) {
            return NextResponse.json({ message: 'id is required' }, { status: 400 });
        }

        if (!['todo','in_progress','done'].includes(status)){
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const result = await pool.query("UPDATE tasks SET status = $1, updatedAt = NOW() WHERE id = $2", [status, id]);
        if (result.rowCount === 0) {
            return NextResponse.json({ ok: false, message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true, message: "Task updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error updating task" }, { status: 500 });
    }
}

// DELETE /api/tasks
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        // validations
        if (!id) {
            return NextResponse.json({ message: 'id is required' }, { status: 400 });
        }

        const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return NextResponse.json({ ok: false, message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true, message: "Task deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error deleting task" }, { status: 500 });
    }
}