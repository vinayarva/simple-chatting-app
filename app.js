const express =  require("express")
const bodyparser =  require("body-parser")
const fs =  require("fs")
const cookieParser =  require("cookie-parser")


app = express()


app.use(bodyparser.urlencoded({extended:false}))
app.use(cookieParser());


let username = "Unknown"

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get("/login",(req,res,next)=>{
    res.send("<form action='/log' method='POST'><input type='text' placeholder='username' name='username'><button type='submit'>Login</button></form>")
})

app.post("/log",(req,res,next)=>{
    username =  {...req.body}
    res.cookie('username', username.username, { maxAge: 900000, httpOnly: true });
    res.redirect("/room")
})

app.get("/room",(req,res,next)=>{   

    fs.readFile("./message.txt","utf-8",(err,data)=>{
            if(err) return console.log(err)

            return res.send(`<p>${data}</p><form action='/room' method='POST'><input type='text' placeholder='message' name='message'><button type='submit'>Send</button></form>`)
         })   

})

app.post("/room",(req,res,next)=>{
    const message = {...req.body}
    const usernameFromCookie = req.cookies.username || 'Unknown';
    const text =  usernameFromCookie + ": " + message.message +" "
     fs.appendFile("message.txt",text,(err)=>{
        if(err) return console.log(err)

            return res.redirect("/room")
     })
})
app.listen(3000)