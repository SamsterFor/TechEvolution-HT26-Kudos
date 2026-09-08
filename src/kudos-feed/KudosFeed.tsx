import { categories, colleagues } from '../kudos'
import type { Kudos } from '../kudos'
import { useState } from 'react'
import EditKudosForm from './EditKudosForm'
import type { KudosDraft } from '../kudos'

type Props = {
  kudos: Kudos[]
  onUpdate: (id: string, draft: KudosDraft) => void
  onDelete: (id: string) => void
}

function getColleagueName(id: string) {
  return colleagues.find((colleague) => colleague.id === id)?.name ?? 'Okänd kollega'
}

function formatCreatedAt(createdAt: string) {
  return new Intl.DateTimeFormat('sv-SE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export default function KudosFeed({ kudos, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const newestFirst = [...kudos].sort(
    (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
  )

  return (
    <section aria-label="Kudos feed">
      <header>
        <p className="eyebrow">The wall</p>
        <h2>Latest kudos</h2>
      </header>

      {newestFirst.length === 0 ? (
        <p>Inga Kudos har lagts till. Var banbrytande och skapa den första!</p>
      ) : (
        <div>
          {newestFirst.map((kudo) => (
            <article key={kudo.id}>
              {editingId === kudo.id ? (
                <EditKudosForm
                  kudos={kudo}
                  onSave={(draft) => {
                    onUpdate(kudo.id, draft)
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <p>
                    <strong>{getColleagueName(kudo.from)}</strong> gav Kudos till{' '}
                    <strong>{getColleagueName(kudo.to)}</strong>
                  </p>
                  <p>{kudo.message}</p>
                  <p>
                    <span>{categories[kudo.category]}</span>{' · '}
                    <time dateTime={kudo.createdAt}>{formatCreatedAt(kudo.createdAt)}</time>
                  </p>
                  <div className="feed-actions">
                    <button type="button" className="secondary-button" onClick={() => {
                      setActionError('')
                      setEditingId(kudo.id)
                    }}>Redigera</button>
                    <button type="button" className="text-button" onClick={() => {
                      if (!window.confirm('Vill du radera denna Kudos?')) return
                      try {
                        onDelete(kudo.id)
                        setActionError('')
                      } catch {
                        setActionError('Kudos kunde inte raderas. Försök igen.')
                      }
                    }}>Radera</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
      {actionError && <p className="error" role="alert">{actionError}</p>}
    </section>
  )
}
