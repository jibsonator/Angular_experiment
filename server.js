var express = require('express')


var app = express()

app.use(express.static(__dirname + '/static'))

app.get('*', function(req,res){
    res.sendfile('index.html')
//    load the single view file
//    angular handles the routing on the front-end
})


//listening section
var port=8080
app.listen(port,function(){
    console.log('app listening on port '+port)
})