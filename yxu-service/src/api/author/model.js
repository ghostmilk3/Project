import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)
const gender = ['male', 'female']

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    match: /^\S+\.\S+$/,
    maxLength: 100,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: gender,
    default: 'male'
  },
  age: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 150,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
    minLength: 0,
    maxLength: 50
  },
  birthDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    trim: true
  },
  deathDate: {
    type: String,
    match: /^\d{4}-\d{2}-\d{2}$/,
    trim: true
  },
}, {
  timestamps: true
})

authorSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'name', 'age', 'gender']

    if (full) {
      fields = [...fields, 'nationality', 'birthDate', 'deathDate']
    }

    fields.forEach(field => {
      view[field] = this[field]
    })

    return view
  },

}

authorSchema.statics = {
  gender
}

authorSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })
authorSchema.plugin(AutoIncrement, {
  id: 'author_seq',
  inc_field: 'id',
  reference_fields: ['tenant']
})

const model = mongoose.model('Author', authorSchema)

export const schema = model.schema
export default model
