// IMPORTS FROM PACKAGES
const express = require('express');
const mongoose = require('mongoose');

// IMPORT FROM OTHER FILES
const authRouter = require('./routes/auth');

// INIT
const app = express();
const PORT = 3000;
const DB = 'mongodb+srv://robyfajar:robyyfajar12@cluster0.sc4e1qt.mongodb.net/?retryWrites=true&w=majority';

// MIDDLEWARE
app.use(express.json());
app.use(authRouter);

// CONNECTIONS
mongoose.connect(DB).then(() => {
    console.log('Koneksi sukses');
}).catch((e)=>{
    console.log(e);
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at Port ${PORT}`);
});