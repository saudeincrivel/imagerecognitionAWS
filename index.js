"use strict";

const { promises : { readFile }, fstat , writeFile, readFileSync } = require('fs');
const aws = require('aws-sdk');

aws.config.region = 'us-east-1';
aws.config.credentials = {
    accessKeyId:'',
    secretAccessKey:'',
};



const reko = new aws.Rekognition();
const bodyParser = require('body-parser');
const express = require('express');


const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


async function sleep ( tempo ) {
    await new Promise((resolve) => { setTimeout(resolve, tempo * 1000); });
}


async function labelImage (buffer) {
    const result = await reko.detectLabels({
        Image: {
            Bytes: buffer,
        }
    }).promise();

  return result.Labels;
}

/*
* {imagePath} caminho da imagem no PC
*
*
*/
async function analisa (imagePath ) {
    console.log('image path :', imagePath);
    // writeFile('./output.txt', JSON.stringify(imagePath), (err)=> console.log(err));
    try {
        const imageBuffer = await readFile(imagePath);
        const labels = await labelImage(imageBuffer);
        return  {
            statuScode :200, 
            body: labels,
        };
    }catch (err ){
        return  {
            statuScode :500, 
            body: 'Internal Server error: ' + err.message,
        };
    }
}



app.post("/analisa", async (req, res) => {
    const imagePath = req.body.path;
    const responseObject =  await analisa(imagePath);
    res.json(responseObject);
});


app.listen(PORT, () => console.log(`API node na porta :  ${PORT}!`))

