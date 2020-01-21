const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const generateHTML = require("./generateHTML.js");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer
        .prompt([
            {
                message: "Enter your GitHub username:",
                name: "username"
            },
            {
                message: "What color would you like?",
                name: "color",
                type: "list",
                choices: ["red", "blue", "green", "pink"]
            }
        ])
        .then(function ({ username, color }) {
            console.log(username, color)
            const queryUrl = `https://api.github.com/users/${username}`;

            axios.get(queryUrl).then(function (res) {
                // console.log("image", res.data.avatar_url)
                // console.log("name", res.data.name)
                // console.log("company", res.data.company)
                // console.log("login", res.data.login)
                // console.log("bio", res.data.bio)
                // console.log("public-repos", res.data.public_repos)
                // console.log("followers", res.data.followers)
                // console.log("following", res.data.following)

                let data ={
                    image: res.data.avatar_url,
                    name: res.data.name,
                    company: res.data.company,
                    login: res.data.login,
                    bio: res.data.bio,
                    publicRepos: res.data.public_repos,
                    followers: res.data.followers,
                    following: res.data.following,
                }
                console.log("data object", data);

            }).then(function (res) {
                const starUrl = `https://api.github.com/users/${username}/starred`;

                axios.get(starUrl).then(function (res) {
                    const stars = ("stars", res.data.length)
                    console.log("stars", stars)

                    
                    //generateHTML(data);
                });
            }); 

        })
    }
//promptUser();

async function init() {
    console.log("hi")
    try {
        const data = await promptUser();

        const html = generateHTML(data);

        await writeFileAsync("index.html", html);

        console.log("You did it!");
    } catch(err) {
        console.log(err);
    }
}
  
init();
