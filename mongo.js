// mongo.js
const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.env.MONGO_PWD
const argsAfterPassword = process.argv.slice(3) // nome e número (se houver)

const url = `mongodb+srv://gersonsilva107:${password}@cluster0.7t4jnco.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String, // usar String para aceitar hífens, parênteses, zeros à esquerda etc.
})

const Person = mongoose.model('Person', personSchema)

const main = async () => {
  try {
    await mongoose.connect(url)

    if (argsAfterPassword.length === 0) {
      // listar todos
      const persons = await Person.find({})
      console.log('phonebook:')
      persons.forEach(p => {
        console.log(`${p.name} ${p.number}`)
      })
    } else if (argsAfterPassword.length === 2) {
      // adicionar
      const [name, number] = argsAfterPassword
      const person = new Person({ name, number })
      await person.save()
      console.log(`added ${name} number ${number} to phonebook`)
    } else {
      console.log('Usage:')
      console.log('  To add:   node mongo.js <password> <name> <number>')
      console.log('  To list:  node mongo.js <password>')
    }
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await mongoose.connection.close()
  }
}

main()
