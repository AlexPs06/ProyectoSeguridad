'use strict'

var crypto = require("crypto");
var eccrypto = require("eccrypto");
// var JSEncrypt = require('jsencrypt');
class CurvasElipController {
    async Firmar({request,response}){
        
        const archivo = request.only(['privateKey','publicKey', 'textArea' ] )
        console.log(archivo);
        const isBrowser = typeof window !== "undefined"
        // A new random 32-byte private key.
        var privateKey = archivo.privateKey;
        privateKey = eccrypto.generatePrivate();
        // Corresponding uncompressed (65-byte) public key.
        var publicKey = archivo.publicKey 
        publicKey = eccrypto.getPublic(privateKey);

        var str = "message to sign";
        // Always hash you message to sign!
        var msg = crypto.createHash("sha256").update(archivo.textArea).digest();
        console.log("llave privada: ", privateKey );
        // console.log("llave privada: ", eccrypto.generatePrivate());
        // console.log("llave publica: ", eccrypto.getPublic(privateKey).readBigUInt64BE());
        // console.dir(publicKey, {'maxArrayLength': null});
        for (let index = 0; index < privateKey.length; index++) {
            const element = privateKey[index];
            console.log( element.toString(16));
        }
        
        
        // console.log("llave privada: ", privateKey);
        // console.log("llave publica: ", publicKey);


        
        eccrypto.sign(privateKey, msg).then(function(sig) {
            console.log("Signature in DER format:", sig);
            // console.dir(sig, {'maxArrayLength': null});

            eccrypto.verify(publicKey, msg, sig).then(function() {
                console.log("Signature is OK");
                return response.status(200).json({firma:sig,publicKey:publicKey,privateKey:privateKey   });
            }).catch(function() {
                console.log("Signature is BAD");
                return response.status(500).json({data:sig});
            });
        });


      }


      async  generarLlaves({response}){
        
        // A new random 32-byte private key.
        var privateKey = eccrypto.generatePrivate();
        // Corresponding uncompressed (65-byte) public key.
        var publicKey = eccrypto.getPublic(privateKey);

        
        
        console.log("llave privada: ", privateKey );
        console.log("llave publica: ", publicKey);
        // console.dir(publicKey, {'maxArrayLength': null});
        let privateKeyString ="";
        for (let index = 0; index < privateKey.length; index++) {
            const element = privateKey[index];
            privateKeyString+=element.toString(16)+" "
        }

        let publicKeyString ="";
        for (let index = 0; index < publicKey.length; index++) {
            const element = publicKey[index];
            publicKeyString+=element.toString(16)+" "
        }
        console.log("llave privada string: ", privateKeyString );
        console.log("llave publica string: ", publicKeyString);
        // Always hash you message to sign!
        var msg = crypto.createHash("sha256").update("aca iran las llaves a firmas").digest();

        eccrypto.sign(privateKey, msg).then(function(sig) {
            console.log("Signature in DER format:", sig);
            eccrypto.verify(publicKey, msg, sig).then(function() {
                console.log("Signature is OK");
                let sigString ="";
                for (let index = 0; index < sig.length; index++) {
                    const element = sig[index];
                    sigString+=element.toString(16)+" "
                }

                return response.status(200).json({firma:sigString,publicKey:publicKeyString,privateKey:privateKeyString });
            }).catch(function() {
                console.log("Signature is BAD");
                return response.status(500).json({data:sig});
            });
        });


      }

}
module.exports = CurvasElipController
