import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import randToken from 'rand-token'

const Schema = mongoose.Schema

const resetPasswordSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true
  },
  token: {
    type: String,
    unique: true,
    index: true,
    default: () => randToken.uid(32)
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
})

resetPasswordSchema.methods = {
  view(full) {
    return {
      user: this.user.view(full),
      token: this.token
    }
  }
}

resetPasswordSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })

const model = mongoose.model('ResetPassword', resetPasswordSchema)

export const schema = model.schema
export default model
