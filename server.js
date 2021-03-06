const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//server
const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
//static middleware
app.use(express.static("./public"));

//Api route - GET the request
app.get('/api/notes', function(req,res) {
    readFileAsync('./db/db.json', 'utf-8').then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

//Api route - POST the request
app.post('/api/notes', function(req,res) {
    const note = req.body;
    readFileAsync('./db/db.json', 'utf-8').then(function(data) {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes) {
        writeFileAsync('./db/db.json', JSON.stringify(notes))
        res.json(note);
    })
});
//Api route - Delete the request
app.delete('/api/notes/:id', function(req,res) {
        const idDelete = parseInt(req.params.id);
        readFileAsync('./db/db.json', 'utf-8').then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = []
        for (let i = 0; i<notes.length; i++) {
            if(idDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
    }).then(function(notes) {
        writeFileAsync('./db/db.json', JSON.stringify(notes))
        res.send('saved!');
    })
})

//routes
app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, function() {
    console.log('App listening on PORT' + port);
});