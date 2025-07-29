const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


app.use(express.json())
app.use(morgan('tiny'))
app.use(requestLogger)

const generateId = () => {
     const newId = Math.floor(Math.random() * 1_000_000_000);
    return newId
}

app.get('/', (request, response) => {
    response.send('<h1>Hello Persons!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
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
    const existingPerson = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase());

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

    if(existingPerson){
        return response.status(404).json({
            error: 'Contact already added '
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((person) => person.id !== id)

    response.status(204).end()
})

const unknownEndpoint = ((request, response) => {
    response.status(404).send({error: 'Unknown Endpoint'})
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})