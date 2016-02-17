var request = require("request")
var fs = require("fs");
var prompt = require("prompt");
prompt.start();

if(!fs.existsSync("./env.js")){
  fs.writeFileSync("./env.js","{}","utf8")
}

var env = JSON.parse(fs.readFileSync("./env.js", "utf8"));

if(!env.token){
  console.log("Please visit https://api.slack.com/web and create an api token")
  prompt.get(['token'], function(err, res){
    env.token = res.token;
    listGroups()
  })
}

function listGroups(){
  request("https://slack.com/api/groups.list?token=" + env.token, function(err,res,body){
    var groups = JSON.parse(body).groups;
    groups.forEach(function(group, i){
      console.log(i + ": " + group.name)
    })
    console.log("please enter number: ")
    prompt.get(['source','destination'], function(err, res){
      env.source = groups[res.source].id;
      env.destination = groups[res.destination].id
    })
  })
}

function duplicate(){
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
}
