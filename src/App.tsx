import { useState } from 'react'
import { colleagues } from './kudos'
import KudosFeed from './kudos-feed/KudosFeed'
import SendKudosForm from './send-kudos/SendKudosForm'
import { useKudos } from './useKudos'

function App() {
  const [currentUserId, setCurrentUserId] = useState(colleagues[0].id)
  const { kudos, addKudos, updateKudos, deleteKudos } = useKudos()

  return (
    <main>
      <header>
        <p className="eyebrow">Evolution Lab · Kudos Wall</p>
        <h1>Send a kudos</h1>
        <p>Celebrate a win and the person behind it.</p>
      </header>
      <section className="card" aria-label="Send a kudos">
        <div className="current-user">
          <label htmlFor="current-user">Sending as</label>
          <select id="current-user" value={currentUserId}
            onChange={(event) => setCurrentUserId(event.target.value)}>
            {colleagues.map((colleague) => (
              <option key={colleague.id} value={colleague.id}>{colleague.name}</option>
            ))}
          </select>
        </div>
        <SendKudosForm currentUserId={currentUserId} onSend={addKudos} />
      </section>
      <KudosFeed kudos={kudos} onUpdate={updateKudos} onDelete={deleteKudos} />
    </main>
  )
}

export default App
