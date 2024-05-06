import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)
const state = ['available', 'unborrowable', 'broken']

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    ref: 'Author',
    index: true
  },
  name: {
    type: String,
    index: true,
    maxLength: 100,
    required: true,
    trim: true
  },
  state: {
    type: String,
    enum: state,
    default: 'available'
  },
  language:{
    type: String,
    required: true,
    trim: true,
    maxLength:100
  },
  publicationDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    trim: true
  },
  collectionAmount: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 100
  },
  press: {
    type: String,
    minLength: 0,
    maxLength: 100,
    required: true,
    trim: true
  }

}, {
  timestamps: true
})

bookSchema.methods = {
  view(full) {
    const view = {}
    let fields = [ 'id', 'name', 'state', 'language', 'author']

    if (full) {
      fields = [...fields, 'publicationDate', 'press', 'collectionAmount']
    }

    fields.forEach(field => {
      view[field] = this[field]
    })

    return view
  },

}

bookSchema.statics = {
  state
}

bookSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })
bookSchema.plugin(AutoIncrement, {
  id: 'book_seq',
  inc_field: 'id',
  reference_fields: ['tenant']
})

const model = mongoose.model('Book', bookSchema)

export const schema = model.schema
export default model
