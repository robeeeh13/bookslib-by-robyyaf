// IMPORTS FROM PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');

// IMPORT FROM OTHER FILES
const authRouter = require('./routes/auth');

// INIT
const app = express();
const PORT = 3000;
const DB = 'mongodb+srv://robyfajar:uasppkroby@cluster0.sc4e1qt.mongodb.net/?retryWrites=true&w=majority';

// MIDDLEWARE
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);

// CONNECTIONS
mongoose.connect(DB).then(() => {
    console.log('Koneksi sukses');
}).catch((e)=>{
    console.log(e);
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at Port ${PORT}`);
});