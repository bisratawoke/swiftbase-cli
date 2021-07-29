const express = require('express')

const app = express()

app.get("/",(req,res) => {

	return res.json("hello from app")
})


app.listen(80,() => console.log('server started'))
