#! /usr/bin/env node
var request = require('superagent');
var db = require('./repos');

var apiURL = 'https://api.github.com/repos/';
var promises = [];

if (!process.env.GHTOKEN) {
  console.log('environment variable GHTOKEN needed.');
  process.exit(1);
}

var type = 'all';
if (process.argv[2]) {
  type = process.argv[2];
} else {
  console.log('usage: getstars <all|game|spa|webrtc|node>');
  process.exit(2);
}

var repos = [];
for (var key in db) {
  if (type == key || type == 'all') {
    repos = repos.concat(db[key]);
  }
}

function makeRequest(repo) {
  var p = new Promise(function(resolve, reject) {
    request
      .get(apiURL + repo)
      .set('User-Agent', 'superagent')
      .set('Authorization', 'token ' + process.env.GHTOKEN)
      .end(function(err, res) {
        var body = res.body;
        resolve(body);
      });
  });

  return p;
}


for (var repo of repos) {
  p = makeRequest(repo);
  promises.push(p)
}

Promise.all(promises).then(function(results) {
  for (var key in results) {
    var r = results[key];
    console.log(r.full_name + ' : ' + r.stargazers_count);
  }
});

