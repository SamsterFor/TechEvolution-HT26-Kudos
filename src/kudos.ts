import colleagues from '../data/colleagues.json'

export { colleagues }

export const categories = {
  TEAMWORK: 'Teamwork',
  EXTRA_MILE: 'Extra mile',
  MENTORSHIP: 'Mentorship',
  CRAFT: 'Craft',
  CUSTOMER_IMPACT: 'Customer impact',
} as const

export type Category = keyof typeof categories
export type Kudos = {
  id: string
  from: string
  to: string
  message: string
  category: Category
  createdAt: string
}
export type KudosDraft = Omit<Kudos, 'id' | 'createdAt' | 'category'> & {
  category: string
}
export const MAX_MESSAGE_LENGTH = 500

export function isCategory(value: string): value is Category {
  return Object.hasOwn(categories, value)
}

export function isKudos(value: unknown): value is Kudos {
  if (!value || typeof value !== 'object') return false
  const kudos = value as Record<string, unknown>
  return typeof kudos.id === 'string' && kudos.id.length > 0 &&
    typeof kudos.from === 'string' && kudos.from.length > 0 &&
    typeof kudos.to === 'string' && kudos.to.length > 0 &&
    typeof kudos.message === 'string' && Boolean(kudos.message.trim()) &&
    typeof kudos.category === 'string' && isCategory(kudos.category) &&
    typeof kudos.createdAt === 'string' && Number.isFinite(Date.parse(kudos.createdAt))
}

export function validateKudos(draft: KudosDraft) {
  return {
    from: colleagues.some(({ id }) => id === draft.from) ? '' : 'Choose who is sending.',
    to: colleagues.some(({ id }) => id === draft.to) ? '' : 'Choose a recipient.',
    message: !draft.message.trim()
      ? 'Write a message before sending.'
      : draft.message.length > MAX_MESSAGE_LENGTH
        ? `Keep your message to ${MAX_MESSAGE_LENGTH} characters.`
        : '',
    category: isCategory(draft.category) ? '' : 'Choose a category.',
  }
}

export function createKudos(draft: KudosDraft): Kudos {
  if (Object.values(validateKudos(draft)).some(Boolean) || !isCategory(draft.category)) {
    throw new Error('Please check the form before sending.')
  }
  return {
    ...draft,
    message: draft.message.trim(),
    category: draft.category,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
}

export function updateKudos(kudos: Kudos, draft: KudosDraft): Kudos {
  if (Object.values(validateKudos(draft)).some(Boolean) || !isCategory(draft.category)) {
    throw new Error('Please check the form before saving.')
  }
  return {
    ...kudos,
    ...draft,
    message: draft.message.trim(),
    category: draft.category,
  }
}
