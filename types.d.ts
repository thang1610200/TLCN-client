export type course = {
  id: string
  topic_id: string
  owner_id: string
  title: string
  description: string
  learning_outcome: string
  picture: string
  slug: string
  isPublished: boolean
  create_at: Date
  update_at: Date

};

export type IUser = {
  id: number
  username: string
  email: string
  password: string
  image: string
  role: string
  facebook_id: string
  youtube_id: string
  titok_id: string
  registration_date: string
  status: string
}