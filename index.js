const express = require("express");
const morgan = require('morgan')
const cors = require('cors')

const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// 3.4 delete and confirm
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  console.log("person ", person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  response.send(
    `<div><div>Phonebook has info for ${
      persons.length
    } people</div><br/>time is ${JSON.stringify(new Date())}</div>`
  );
});

// 3.5 add new person
app.post("/api/persons", (request, response) => {
  const person = request.body;
  const isFieldMissing = !person.name || !person.number;
  if (isFieldMissing) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }
  const isNameExist = persons.find((p) => p.name === person.name);
  if (isNameExist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  console.log("person ", person);
  const max = 100000;
  person.id = Math.floor(Math.random() * max);
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
