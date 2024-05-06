import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)
const roles = ['user', 'admin']

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    maxLength: 100,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxLength: 100
  },
  name: {
    type: String,
    index: true,
    trim: true,
    required: true,
    maxLength: 100
  },
  role: {
    type: String,
    enum: roles,
    default: 'user'
  },
  picture: {
    type: String,
    maxLength: 200,
    trim: true
  }
}, {
  timestamps: true
})

userSchema.path('email').set(function (email) {
  if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
    const hash = crypto.createHash('md5').update(email).digest('hex')
    this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`
  }

  return email
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password, 9).then(hash => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'name', 'picture', 'role']

    if (full) {
      fields = [...fields, 'email', 'createdAt']
    }

    fields.forEach(field => {
      view[field] = this[field]
    })

    return view
  },

  authenticate(password) {
    return bcrypt.compare(password, this.password).then(valid => valid ? this : false)
  }

}

userSchema.statics = {
  roles
}

userSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })
userSchema.plugin(AutoIncrement, {
  id: 'user_seq',
  inc_field: 'id',
  reference_fields: ['tenant']
})

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
