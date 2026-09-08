import { useState } from 'react'
import type { FormEvent } from 'react'
import { categories, colleagues, MAX_MESSAGE_LENGTH, validateKudos } from '../kudos'
import type { Kudos, KudosDraft } from '../kudos'

type Props = {
  kudos: Kudos
  onSave: (draft: KudosDraft) => void
  onCancel: () => void
}

export default function EditKudosForm({ kudos, onSave, onCancel }: Props) {
  const [to, setTo] = useState(kudos.to)
  const [message, setMessage] = useState(kudos.message)
  const [category, setCategory] = useState<string>(kudos.category)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [saveError, setSaveError] = useState('')
  const draft = { from: kudos.from, to, message, category }
  const errors = validateKudos(draft)

  function touch(field: string) {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveError('')
    setTouched({ to: true, message: true, category: true })
    if (Object.values(errors).some(Boolean)) return

    try {
      onSave(draft)
    } catch {
      setSaveError('Kudos kunde inte sparas. Kontrollera lagringen och försök igen.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={`edit-recipient-${kudos.id}`}>Mottagare</label>
      <select id={`edit-recipient-${kudos.id}`} value={to}
        onChange={(event) => setTo(event.target.value)} onBlur={() => touch('to')}
        required aria-invalid={!!(touched.to && errors.to)}
        aria-describedby={touched.to && errors.to ? `edit-recipient-error-${kudos.id}` : undefined}>
        {colleagues.map((colleague) => (
          <option key={colleague.id} value={colleague.id}>{colleague.name}</option>
        ))}
      </select>
      {touched.to && errors.to && <p className="error" id={`edit-recipient-error-${kudos.id}`}>{errors.to}</p>}

      <label htmlFor={`edit-message-${kudos.id}`}>Meddelande</label>
      <textarea id={`edit-message-${kudos.id}`} value={message}
        onChange={(event) => setMessage(event.target.value)} onBlur={() => touch('message')}
        rows={5} maxLength={MAX_MESSAGE_LENGTH} required
        aria-invalid={!!(touched.message && errors.message)}
        aria-describedby={`edit-message-count-${kudos.id}${touched.message && errors.message ? ` edit-message-error-${kudos.id}` : ''}`} />
      <p className="hint" id={`edit-message-count-${kudos.id}`}>{message.length} / {MAX_MESSAGE_LENGTH} characters</p>
      {touched.message && errors.message && <p className="error" id={`edit-message-error-${kudos.id}`}>{errors.message}</p>}

      <label htmlFor={`edit-category-${kudos.id}`}>Kategori</label>
      <select id={`edit-category-${kudos.id}`} value={category}
        onChange={(event) => setCategory(event.target.value)} onBlur={() => touch('category')}
        required aria-invalid={!!(touched.category && errors.category)}
        aria-describedby={touched.category && errors.category ? `edit-category-error-${kudos.id}` : undefined}>
        {Object.entries(categories).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {touched.category && errors.category && <p className="error" id={`edit-category-error-${kudos.id}`}>{errors.category}</p>}

      <div className="edit-actions">
        <button type="submit">Spara</button>
        <button type="button" className="secondary-button" onClick={onCancel}>Avbryt</button>
      </div>
      {saveError && <p className="error" role="alert">{saveError}</p>}
    </form>
  )
}
