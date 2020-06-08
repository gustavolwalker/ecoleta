import express, { request, response } from "express";

const app = express();

app.use(express.json());

const users = [
    'Joao',
    'Maria',
    'Fulano'
];

app.get('/users', (request, response) => {
    const search = request.query.search;

    console.log('Listagem de usuários, search: '+search);
    search ?
        response.send(users.filter((val) => val.toLowerCase().includes(String(search).toLowerCase()))) :
        response.send(users);
});

app.get('/users', (request, response) => {
    const id = Number(request.params.id);
    response.json(users[id]);
});


app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);
    response.json(users[id]);
});

app.post('/users', (request, response) => {
    const data = request.body;

    users.push(data.name);
    
    response.json(data);
});

app.listen(3333, () => {
    console.log('Server stated at 3333 port');
});


