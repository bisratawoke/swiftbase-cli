const express = require('express')

const app = express()

app.get("/",(req,res) => {

	return res.json("hello from app")
})


app.listen(9000,() => console.log('server started'))
