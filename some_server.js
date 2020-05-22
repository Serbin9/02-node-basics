const express = require("express")
const server = express();
const PORT = 3050

server.get("/forecast", (req, res, next)=>{
return res.json({
    hello: "Cocumbers"
})
})
server.listen(PORT, ()=>{
    console.log('Congritulations on port 3050 - new treining server')
})