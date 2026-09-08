import { useState } from 'react'
import { createKudos, isKudos } from './kudos'
import type { Kudos, KudosDraft } from './kudos'

export const KUDOS_STORAGE_KEY = 'kudos'

function sortNewestFirst(kudos: Kudos[]): Kudos[] {
  return [...kudos].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

function readKudos(): Kudos[] {
  const raw = localStorage.getItem(KUDOS_STORAGE_KEY)
  if (raw === null) return []

  let stored: unknown
  try {
    stored = JSON.parse(raw)
  } catch {
    throw new Error('Saved kudos could not be read.')
  }

  if (!Array.isArray(stored) || !stored.every(isKudos)) {
    throw new Error('Saved kudos could not be read.')
  }
  return sortNewestFirst(stored)
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
    localStorage.setItem(KUDOS_STORAGE_KEY, JSON.stringify(sortNewestFirst(nextKudos)))
    setKudos(sortNewestFirst(nextKudos))
  }

  return { kudos, addKudos }
}
