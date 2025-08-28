require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Hello Persons!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <h2>Phonebook has info for ${persons.length} people</h2>
            <p>${new Date()}</p>
        </div>
        `)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    // const existingPerson = person.find(person => person.name.toLowerCase() === body.name.toLowerCase());

    // if(body.content === undefined){
    //     return response.status(400).json({ error: 'content missing' })
    // }

    if(!body.name){
        return response.status(404).json({
            error:'Name missing'
        })
    }

    if(!body.number){
        return response.status(404).json({
            error: 'Number missing'
        })
    }

    // if(existingPerson){
    //     return response.status(404).json({
    //         error: 'Contact already added '
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result =>{
        response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = ((request, response) => {
    response.status(404).send({error: 'Unknown Endpoint'})
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})