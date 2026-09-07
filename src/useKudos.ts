import { useState } from 'react'
import { createKudos, isCategory } from './kudos'
import type { Kudos, KudosDraft } from './kudos'

const STORAGE_KEY = 'kudos'

function readKudos(): Kudos[] {
  const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  if (!Array.isArray(stored) || !stored.every((kudos) =>
    kudos && typeof kudos.id === 'string' && typeof kudos.from === 'string' &&
    typeof kudos.to === 'string' && typeof kudos.message === 'string' &&
    typeof kudos.category === 'string' && isCategory(kudos.category) &&
    typeof kudos.createdAt === 'string' && Number.isFinite(Date.parse(kudos.createdAt)),
  )) {
    throw new Error('Saved kudos could not be read.')
  }
  return stored.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export function useKudos() {
  const [kudos, setKudos] = useState<Kudos[]>(() => {
    try {
      return readKudos()
    } catch {
      return []
    }
  })

  function addKudos(draft: KudosDraft) {
    const newKudos = createKudos(draft)
    // Read before writing to retain kudos sent from another tab.
    const nextKudos = [newKudos, ...readKudos()]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextKudos))
    setKudos(nextKudos)
  }

  return { kudos, addKudos }
}
