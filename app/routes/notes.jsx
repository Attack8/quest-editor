import { Link, redirect, useLoaderData, useRouteError } from "@remix-run/react";
import NewNote from "../components/NewNote";
import { getStoredNotes, storeNotes } from "../data/notes";
import NoteList from "../components/NoteList";

export default function NotesPage() {
    const notes = useLoaderData();

    return (
        <main>
            <NewNote />
            <NoteList notes={notes} />
        </main>
    );
}

// Server-sided (trigered whenever a GET request is sent to this route)
export async function loader() {
    const notes = await getStoredNotes();
    if (!notes || notes.length === 0) {
        throw Response.json({message: 'Could not find any notes.'}, {
            status: 400,
            statusText: 'Notes Not Found'
        });
    }
    return notes;
}

// Server-sided (triggered whenever a non-GET request is sent to this route)
export async function action({ request }) {
    const formData = await request.formData();
    const noteData = Object.fromEntries(formData);
    
    if (noteData.title.trim().length < 5) {
        return {message: 'Invalid title - must be at least 5 characters long.'};
    }
    
    const existingNotes = await getStoredNotes();
    noteData.id = new Date().toISOString();
    const updatedNotes = existingNotes.concat(noteData);
    await storeNotes(updatedNotes);
    return redirect('/notes');
}

export function meta() {
    return [
        {title: "All Notes"},
        {description: "Manage your notes with ease."} 
    ];
}

export function ErrorBoundary() {
    const error = useRouteError();
    // console.error(error);
    if (error.status === 400) {
        return (
            <main>
                <NewNote />
                <p className="info-message">{error.data.message}</p>
            </main>
        )
    }
    return (
        <main className="error">
          <h1>An error occurred!</h1>
          <p>{error.message}</p>
          <p>Back to <Link to="/">Safety!</Link></p>
        </main>
    )
}