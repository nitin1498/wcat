#!/usr/bin/env node
const fs = require('fs');

let arguments = process.argv.slice(2);

let flags = [];
let fileNames = [];
let secondaryArguments = [];

let helpRequest = false

for(let item of arguments) {
    if(item[0] == '-') {
        flags.push(item);
        if(item == '-h' || item == '--help') {
            helpRequest = true;
        }
    } else if(item[0] == '~') {
        secondaryArguments.push(item.slice(1));
    } else {
        fileNames.push(item);
    }
}

if(helpRequest) {
    showHelp();
}

for(let file of fileNames) {
    let fileData = fs.readFileSync(file,"utf-8");
    for(let flag of flags) {
        if(flag == "-rs") {
            fileData = removeAll(fileData," ");
            console.log(fileData);
        }
        if(flag == "-rn") {
            fileData = removeAll(fileData, "\r\n")
            console.log(fileData);
        }
        if(flag == "-rd") {
            for(let secondaryArgument of secondaryArguments) {
                fileData = removeAll(fileData,secondaryArgument);
            }
            console.log(fileData);
        }
        if(flag=="-s"){
            let data=addSequence(fileData);
            console.log(data);
        }
        if(flag=="-sn"){
            let data=addSequenceTnel(fileData);
            console.log(data);
        }
        if(flag=="-rel"){
            let ans=removeExtraLine(fileData);
            for(let i=0;i<ans.length;i++){
                console.log(ans[i]);
            } 
        }
        if(flag == "-rasc") {
            let ans = removeAllSpecialChar(fileData);
            console.log(ans);
        }

        if(flag == '-E') {
            let ans = showEnds(fileData);
            console.log(ans);
        }

        if(flag == '-T') {
            let ans = showTabs(fileData);
            console.log(ans);
        }
    }
    if(flags.length == 0) {
        console.log(fileData);
    }
}

function removeAll(string, removalData) {
    return string.split(removalData).join("");
}

function addSequence(content){
    let contentArr=content.split("\n");
    for(let i=0;i<contentArr.length;i++){
        contentArr[i]=(i+1)+" "+contentArr[i];
    }
    return contentArr;
}

function addSequenceTnel(content){
    let contentArr=content.split("\r\n");
    let count=1;
    for(let i=0;i<contentArr.length;i++){
        if(contentArr[i]!=""){
            contentArr[i]=count+" "+contentArr[i];
            count++;
        }
    }
    return contentArr;
}

function removeExtraLine(fileData){
    let contentArr=fileData.split("\r\n");
    let data=[];
    for(let i=1;i<contentArr.length;i++){
        if(contentArr[i]=="" && contentArr[i-1]==""){
            contentArr[i]=null;
        }
        if(contentArr[i]=="" && contentArr[i-1]==null){
            contentArr[i]=null;
        }
    }

    for(let i=0;i<contentArr.length;i++){
        if(contentArr[i]!=null){
            data.push(contentArr[i]);
        }
    }
    return data;
}

function removeAllSpecialChar(content) {
    let specialCharArr = ['!','"','#','$','%','&',"'",'(',')','*','+',',','-','.',
    '/',':',';','<','=','>','?','@','[',']','^','_','`','{','|','}','~']
    for(let char of specialCharArr) {
        content = content.split(char).join('');
    }
    return content;
}

function showEnds(content) {
    return content.split('\r\n').join('  🔚\r\n');
}

function showTabs(content) {
    return content.split('\t').join(' 💊 ');
}

function showHelp() {
    console.log('Usage: wcat [flag]... [file]...');
    console.log('-T,        shows tabs as 💊');
    console.log('-E,        shows ends as 🔚');
    console.log('-rs,       removes all spaces');
    console.log('-rn,       removes all newline char');
    console.log('-rd,       removes all data after ~ that has been pass in command');
    console.log('-rsc,      removes all special characters');
    console.log('-s,        add numbering to each line');
    console.log('-rel,      removes extra lines ie more than 1 line');
    console.log('-sn,       all numbering to line who is not empty');
}