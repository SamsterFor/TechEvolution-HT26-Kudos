import { useState } from 'react'
import { createKudos, isKudos, updateKudos as updateKudosRecord } from './kudos'
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

function writeKudos(kudos: Kudos[]) {
  const sortedKudos = sortNewestFirst(kudos)
  localStorage.setItem(KUDOS_STORAGE_KEY, JSON.stringify(sortedKudos))
  return sortedKudos
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
    setKudos(writeKudos([newKudos, ...readKudos()]))
  }

  function updateKudos(id: string, draft: KudosDraft) {
    const storedKudos = readKudos()
    const existingKudos = storedKudos.find((kudo) => kudo.id === id)
    if (!existingKudos) throw new Error('Kudos could not be found.')

    const updatedKudos = updateKudosRecord(existingKudos, draft)
    setKudos(writeKudos(storedKudos.map((kudo) => kudo.id === id ? updatedKudos : kudo)))
  }

  function deleteKudos(id: string) {
    const storedKudos = readKudos()
    if (!storedKudos.some((kudo) => kudo.id === id)) {
      throw new Error('Kudos could not be found.')
    }

    setKudos(writeKudos(storedKudos.filter((kudo) => kudo.id !== id)))
  }

  return { kudos, addKudos, updateKudos, deleteKudos }
}
