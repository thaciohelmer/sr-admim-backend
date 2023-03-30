import { Schema } from 'mongoose'

export const PlayerSchema = new Schema({
  phoneNumber: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  name: {
    type: String,
  },
  ranking: {
    type: String,
  },
  rankingPosition: {
    type: Number,
  },
  avatarUrl: {
    type: String,
  },
}, { timestamps: true, collection: 'players' })
