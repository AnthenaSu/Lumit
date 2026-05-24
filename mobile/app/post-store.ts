import { NewPostPhoto } from './new-post-store'

export type SharedPost = {
  id: string
  photos: NewPostPhoto[]
  createdAt: number
}

/** All published posts, newest first */
export const sharedPosts: SharedPost[] = []

export function publishPost(photos: NewPostPhoto[]): string {
  const id = String(Date.now())
  sharedPosts.unshift({ id, photos: photos.map(p => ({ ...p })), createdAt: Date.now() })
  return id
}
