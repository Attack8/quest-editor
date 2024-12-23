import NewNote from '../components/NewNote';
import CreateNewPost from '../components/QuestEditor.client';
import "../styles/home.css"

export default function Index() {
  return (
    <main id="content">
      <h1>Vault Hunters Quest Line Editor</h1>
      <p>An interactive editor for quest lines</p>
      <NewNote />
      <CreateNewPost />
    </main>
  )
}