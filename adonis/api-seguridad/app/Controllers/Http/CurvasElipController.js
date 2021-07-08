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
        var privateKey = eccrypto.generatePrivate();
        // Corresponding uncompressed (65-byte) public key.
        var publicKey = eccrypto.getPublic(privateKey);

        var str = "message to sign";
        // Always hash you message to sign!
        var msg = crypto.createHash("sha256").update(archivo.textArea).digest();
        console.log("llave privada: "+ privateKey);
        console.log("llave publica: "+publicKey);



        
        eccrypto.sign(privateKey, msg).then(function(sig) {
            console.log("Signature in DER format:", sig);
            eccrypto.verify(publicKey, msg, sig).then(function() {
                console.log("Signature is OK");
                return response.status(200).json({data:sig,llave:publicKey  });
            }).catch(function() {
                console.log("Signature is BAD");
                return response.status(500).json({data:sig});
            });
        });


      }

}
module.exports = CurvasElipController
