const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const argsAfterPassword = process.argv.slice(3)

const url =
  `mongodb+srv://gersonsilva107:${password}@cluster0.7t4jnco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const contact = new Person({
  name: 'Anna',
  number: '040-1234556',
})

contact.save().then(result => {
  console.log('contact saved!')
  mongoose.connection.close()
})