var request = require('request');
var async = require("async");
var _ = require('lodash');
// Get the pull request
const getPullRequest = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://' + process.env.BASE_URL + '/repos/'+ process.env.USERNAME + '/' + process.env.REPOSITORIES + '/pulls';
        var options = {
            url: url,
            headers: {'user-agent': 'node.js'},
            auth:{
                user: process.env.USERNAME,
                pass: process.env.PASSWORD,
            },
            method: 'GET',
        }; 
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,{PRs: body}));
        });
    })
}
// Get the lines of code
const getLinesOfCode = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://' + process.env.BASE_URL + '/repos/'+ process.env.USERNAME + '/' + process.env.REPOSITORIES + '/stats/contributors';
        var options = {
            url: url,
            headers: {'user-agent': 'node.js'},
            auth:{
                user: process.env.USERNAME,
                pass: process.env.PASSWORD,
            },
            method: 'GET',
        }; 
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,{Lines_of_Code: body}));
        });
    })
}
// Get single pull request comment
const getComment = (pullNumber,callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://' + process.env.BASE_URL + '/repos/'+ process.env.USERNAME + '/' + process.env.REPOSITORIES +'/pulls/'+pullNumber+'/comments';
        var options = {
            url: url,
            headers: {'user-agent': 'node.js'},
            auth:{
                user: process.env.USERNAME,
                pass: process.env.PASSWORD,
            },
            method: 'GET',
        }; 
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,body));
        });

    })
}
// Get all comments of the pull request
const getCommentsOnPRs = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        var comments = [];
        await getPullRequest(async function(err,pullReqResult){
            if(err){
                return console.log(err);
            }else{
                var data = JSON.parse(pullReqResult.PRs);
                for(let i = 0; i < data.length; i++){
                    if(_.has(data[i], 'number')){
                        await getComment(data[i].number,function(err,comment){
                            if(err){
                                return console.log(err);
                            }else{
                                comments.push(comment);
                            }
                        });
                    }
                }
                callback(null,{Comments_on_PRs:comments});
            }
        })
    })
}
// Get the All issues of the repository
const getIssues = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://' + process.env.BASE_URL + '/repos/'+ process.env.USERNAME + '/' + process.env.REPOSITORIES + '/issues';
        var options = {
            url: url,
            headers: {'user-agent': 'node.js'},
            auth:{
                user: process.env.USERNAME,
                pass: process.env.PASSWORD,
            },
            method: 'GET',
        }; 
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,body));
        });
    })
}
// Get single comment of the issues
const getIssuesComment = (issueNumber,callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://' + process.env.BASE_URL + '/repos/'+ process.env.USERNAME + '/' + process.env.REPOSITORIES +'/issues/'+issueNumber+'/comments';
        var options = {
            url: url,
            headers: {'user-agent': 'node.js'},
            auth:{
                user: process.env.USERNAME,
                pass: process.env.PASSWORD,
            },
            method: 'GET',
        }; 
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,body));
        });
    })
}
// Get comments of the issues
const getCommentsOnIssues = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        var issues = [];
        await getIssues( async function(err,issuesData){
            if(err){
                return console.log(err);
            }else{
                var data = JSON.parse(issuesData);
                for(let i = 0; i < data.length; i++){
                    if(!_.has(data[i], 'pull_request')){
                        await getIssuesComment(data[i].number,function(err,issue){
                            if(err){
                                return console.log(err);
                            }else{
                                issues.push(issue);
                            }
                        })
                    }
                }
                callback(null,{Comments_on_Issues:issues});
            }
        })
    })
}
// Main Function to get data for metrix
const getMetrix = (req,res)=>{
    async.series([
        getPullRequest,
        getLinesOfCode,
        getCommentsOnPRs,
        getCommentsOnIssues
    ],
    // callback
    function(err, results) {
        res.send(results);
    });
}
module.exports = {
	getMetrix : getMetrix
}