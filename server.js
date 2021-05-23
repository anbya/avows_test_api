const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const avowstest= require("./routes/avowstest")

const PORT = process.env.PORT || 3009

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", function(req,res){
    res.send(`Hello World dari AVOWSTEST API`);
})
app.use("/avowstest", avowstest);

app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`);
});