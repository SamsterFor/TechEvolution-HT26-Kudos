import { useState } from 'react'
import type { FormEvent } from 'react'
import { categories, colleagues, MAX_MESSAGE_LENGTH, validateKudos } from './kudos'
import type { KudosDraft } from './kudos'

type Props = {
  currentUserId: string
  onSend: (draft: KudosDraft) => void
}

export default function SendKudosForm({ currentUserId, onSend }: Props) {
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState('')
  const [saveError, setSaveError] = useState('')
  const draft = { from: currentUserId, to, message, category }
  const errors = validateKudos(draft)

  function touch(field: string) {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setSaveError('')
    setTouched({ to: true, message: true, category: true })
    if (Object.values(errors).some(Boolean)) return

    try {
      onSend(draft)
      setTo('')
      setMessage('')
      setCategory('')
      setTouched({})
      setStatus('Kudos sent!')
    } catch {
      setSaveError('Your kudos could not be saved. Your message is still here. Check that browser storage is available and try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate onChange={() => { setStatus(''); setSaveError('') }}>
      <label htmlFor="recipient">Recipient</label>
      <select id="recipient" value={to} onChange={(event) => setTo(event.target.value)}
        onBlur={() => touch('to')} required aria-invalid={!!(touched.to && errors.to)}
        aria-describedby={touched.to && errors.to ? 'recipient-error' : undefined}>
        <option value="">Choose a colleague</option>
        {colleagues.map((colleague) => (
          <option key={colleague.id} value={colleague.id}>{colleague.name}</option>
        ))}
      </select>
      {touched.to && errors.to && <p className="error" id="recipient-error">{errors.to}</p>}

      <label htmlFor="message">Message</label>
      <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)}
        onBlur={() => touch('message')} rows={5} maxLength={MAX_MESSAGE_LENGTH} required
        placeholder="What would you like to celebrate?"
        aria-invalid={!!(touched.message && errors.message)}
        aria-describedby={`message-count${touched.message && errors.message ? ' message-error' : ''}`} />
      <p className="hint" id="message-count">{message.length} / {MAX_MESSAGE_LENGTH} characters</p>
      {touched.message && errors.message && <p className="error" id="message-error">{errors.message}</p>}

      <label htmlFor="category">Category</label>
      <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}
        onBlur={() => touch('category')} required aria-invalid={!!(touched.category && errors.category)}
        aria-describedby={touched.category && errors.category ? 'category-error' : undefined}>
        <option value="">Choose a category</option>
        {Object.entries(categories).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {touched.category && errors.category && <p className="error" id="category-error">{errors.category}</p>}
      {errors.from && <p className="error" role="alert">{errors.from}</p>}
      <button type="submit">Send kudos</button>
      <p className="status" role="status">{status}</p>
      {saveError && <p className="error" role="alert">{saveError}</p>}
    </form>
  )
}
