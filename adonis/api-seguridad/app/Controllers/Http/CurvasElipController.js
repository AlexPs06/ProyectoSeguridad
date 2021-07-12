'use strict'

var crypto = require("crypto");
var eccrypto = require("eccrypto");
function convertStringToBuffer(string){
    var arreglo = string.split(" ");
    let publicKeyBuffer  = new Buffer.alloc(arreglo.length);
    for (let index = 0; index < publicKeyBuffer.length; index++) {
        const element = arreglo[index];
        let number = parseInt(element, 16)
        publicKeyBuffer[index]=number;
    }
    return publicKeyBuffer;
}

// var JSEncrypt = require('jsencrypt');
class CurvasElipController {
    

    async Firmar({request,response}){
        let publicKeyOriginal = "04 34 34 68 c9 cf e6 ce d0 51 38 1 8a 6e 30 e9 ba 8d b7 49 5e ae c0 3c 54 a5 29 bb 39 86 41 fb cc 96 70 93 12 87 8b ee fb 8d 1a 36 10 8d 88 2f 6d 20 c6 a1 73 f6 37 79 6a 16 17 4e cf 53 65 b3 54";
        
        const archivo = request.only(['privateKey','publicKey', 'textArea', 'sign'  ] )
        console.log(archivo);

        var msg = crypto.createHash("sha256").update(archivo.privateKey+" "+archivo.publicKey).digest();
        
        var arreglo = publicKeyOriginal.split(" ");
        let publicKeyBuffer  = new Buffer.alloc(arreglo.length);
        for (let index = 0; index < publicKeyBuffer.length; index++) {
            const element = arreglo[index];
            let number = parseInt(element, 16)
            publicKeyBuffer[index]=number;
        }
        arreglo = archivo.sign.split(" ");
        let signBuffer  = new Buffer.alloc(arreglo.length);
        for (let index = 0; index < signBuffer.length; index++) {
            const element = arreglo[index];
            let number = parseInt(element, 16)
            signBuffer[index]=number;
        }


        eccrypto.verify(publicKeyBuffer, msg, signBuffer).then(function() {
            console.log("Signature is OK");
            let privateKeyBuffer = convertStringToBuffer(archivo.privateKey);
            msg = crypto.createHash("sha256").update(archivo.textArea).digest();
            eccrypto.sign(privateKeyBuffer, msg).then(function(sig){

                let sigString ="";
                for (let index = 0; index < sig.length; index++) {
                    const element = sig[index];
                    if(index == 0){
                        sigString=element.toString(16)
                    }else{
                        sigString=sigString+" "+element.toString(16)
                    }
                }
                return response.status(200).json({sign:sigString});

            });

        }).catch(function(e) {
            console.log("Signature is BAD");
            return response.status(500).json({data:e});
        });

      }


      async  generarLlaves({response}){
        
        let privateKeyOriginal= "8f 9e 1 33 61 b8 4 c2 c6 68 c1 fd 8f 72 25 c1 39 5c 4 e8 c3 29 32 58 1b ff f9 70 de c8 b0 29";

        // A new random 32-byte private key.
        var privateKey = eccrypto.generatePrivate();
        // Corresponding uncompressed (65-byte) public key.
        var publicKey = eccrypto.getPublic(privateKey);
        
        let privateKeyString ="";
        for (let index = 0; index < privateKey.length; index++) {
            const element = privateKey[index];
            if(index == 0){
                privateKeyString=element.toString(16)
            }else{
                privateKeyString=privateKeyString+" "+element.toString(16)
            }
        }

        let publicKeyString ="";
        for (let index = 0; index < publicKey.length; index++) {
            const element = publicKey[index];
            if(index == 0){
                publicKeyString=element.toString(16)
            }else{
                publicKeyString=publicKeyString+" "+element.toString(16)
            }
        }

        var arreglo = privateKeyOriginal.split(" ");
        let privateKeyBuffer  = new Buffer.alloc(arreglo.length);
        for (let index = 0; index < privateKeyBuffer.length; index++) {
            const element = arreglo[index];
            let number = parseInt(element, 16)
            privateKeyBuffer[index]=number;
        }

        
        var msg = crypto.createHash("sha256").update(privateKeyString+" "+publicKeyString).digest();

        eccrypto.sign(privateKeyBuffer, msg).then(function(signPrivateKey) {
            let sigString ="";
            for (let index = 0; index < signPrivateKey.length; index++) {
                const element = signPrivateKey[index];
                if(index == 0){
                    sigString=element.toString(16)
                }else{
                    sigString=sigString+" "+element.toString(16)
                }
            }
            return response.status(200).json({sign:sigString,publicKey:publicKeyString,privateKey:privateKeyString });
        });
     


      }

}
module.exports = CurvasElipController
