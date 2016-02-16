var env = require("./env")
var request = require("request")

request("https://slack.com/api/groups.info?token="+env.token + "&channel=" + env.source ,function(err,response, body){
  var group = JSON.parse(body).group
  for(var i = 0 ; i < group.members.length; i++){
    var user = group.members[i]
    var url ="https://slack.com/api/groups.invite?token="+env.token + "&channel=" + env.destination + "&user=" + user 
    console.log(url)
    request(url, function(err, res, body){
      console.log(body) 
    })
  }
})