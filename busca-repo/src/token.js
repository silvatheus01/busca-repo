const { Octokit } = require("@octokit/core");

let token;
    
fetch("token.txt").then(function(response) {
    return response
}).then(function(data) {
    token = data.text()
}).catch(function(err) {
    console.log('Fetch problem show: ' + err.message);
});

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
export const octokit = new Octokit({ auth: 
    token
});




