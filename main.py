import requests;
import json;

def getLabels(imagePath ):
    data = {'path': imagePath};
    url = 'http://localhost:3000/analisa';
    res = requests.post(url, json=data);
    
    returned_data = res.json();
    result = returned_data['body'];
    # print("Resposta da API  = ", result);
    return result;


def main():
    path = './images/pikachu.jpg';
    print ( json.dumps ( getLabels(path) , indent = 3));
    return None;


main();