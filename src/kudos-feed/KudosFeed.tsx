import { categories, colleagues } from '../kudos'
import type { Kudos } from '../kudos'

type Props = {
  kudos: Kudos[]
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

export default function KudosFeed({ kudos }: Props) {
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
              <p>
                <strong>{getColleagueName(kudo.from)}</strong> gav Kudos till{' '}
                <strong>{getColleagueName(kudo.to)}</strong>
              </p>
              <p>{kudo.message}</p>
              <p>
                <span>{categories[kudo.category]}</span>{' · '}
                <time dateTime={kudo.createdAt}>{formatCreatedAt(kudo.createdAt)}</time>
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
