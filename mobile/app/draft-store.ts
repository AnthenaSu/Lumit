import { NewPostPhoto } from './new-post-store'

export type Draft = {
  id: string
  photos: NewPostPhoto[]
  createdAt: number
}

export const draftStore: Draft[] = []

export function saveDraft(photos: NewPostPhoto[]): string {
  const id = String(Date.now())
  draftStore.push({ id, photos: photos.map(p => ({ ...p })), createdAt: Date.now() })
  return id
}

export function deleteDraft(id: string) {
  const idx = draftStore.findIndex(d => d.id === id)
  if (idx !== -1) draftStore.splice(idx, 1)
}

export function getLatestDraft(): Draft | null {
  if (draftStore.length === 0) return null
  return draftStore[draftStore.length - 1]
}
