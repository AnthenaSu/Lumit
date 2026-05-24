export type NewPostPhoto = {
  uri: string
  assetId?: string
  caption: string
  location?: { latitude: number; longitude: number }
  locationLabel?: string
}
export const newPostStore: NewPostPhoto[] = []
