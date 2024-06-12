//packages added
import express from 'express';
import { get } from 'axios';

//listening port
const PORT = 8888;

//calls express require function
const app = express();

//path to get, get request, and get respsonse
app.get('/', (req,res) => {
    res.json('Welcome to My Crypto Portfolio API')
})

app.get('/', (req,res) => {
    
    res.json('Portfolio Name')

    get('http://localhost:3000/')

})

app.listen(PORT, () => console.log(`server running on ${PORT}`));

