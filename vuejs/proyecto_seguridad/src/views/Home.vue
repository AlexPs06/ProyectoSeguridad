<template>
  <v-app class="adminView" :style="{background: '#5d9b9b', }" >
  
   <v-container>
    <v-row justify="space-around">
      <v-col cols="12" md="4">
        


  <v-card
    color="grey lighten-4"
    flat
    tile
    class="d-flex flex-wrap"
  >
    <v-toolbar dense>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> esto falta checar si se queda o se va  -->
    <!-- :loading="loading" :disabled="loading" -->
       <v-btn   color="blue-grey" class="ma-2 white--text" v-on:click ="Firmar()"  >  
              Firmar  <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
         <v-btn  color="blue-grey" class="ma-2 white--text" v-on:click ="Encriptar()"  >  
              Encriptar  <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        

    </v-toolbar>
  </v-card>


  <v-sheet class="pa-12" color="grey lighten-3" elevation="24" style="max-height: 100%; "  >

  <v-textarea  label="Llave privada"  hide-details="auto" v-model="privateKey" clearable class="overflow-y-auto; text-left;"> </v-textarea>
  <!--<v-text-field  label="Llave privada"  hide-details="auto" v-model="privateKey" clearable class="overflow-y-auto; text-left;"> </v-text-field>-->
  <v-textarea  label="Llave publica"  hide-details="auto" v-model="publicKey" clearable class="overflow-y-auto; text-left;"> </v-textarea>
  </v-sheet>


      
      </v-col>



      <v-col >
          <!-- @click="loader = 'loading'" -->
        <v-sheet class="pa-12" color="grey lighten-3" elevation="24" style="max-height: 1000px; " height = "1000" >
        <v-container fluid v-if="textArea!=null" >
            <!-- label="Label" -->
            <v-textarea
            name="input-7-1"
            style="max-height: 100px;  " class="overflow-y-auto; text-left;"
            v-model="textArea"
            rows="30"
            row-height="30"
            :auto-grow="false"
            ></v-textarea>
        </v-container>

        </v-sheet>
        
      </v-col>


    </v-row>
  </v-container>


  </v-app>
</template>


<script lang="ts">
  import Vue from 'vue'
  import { JSEncrypt } from 'jsencrypt' 
  // import { CryptoJS } from 'crypto-js/sha256';
  import { sha256 } from 'js-sha256';
  // import VueCryptojs from 'vue-cryptojs'
  // import HelloWorld from '../components/HelloWorld.vue'

  export default Vue.extend({
    name: 'Home',

    components: {
      // HelloWorld,
    },
    data: () => ({
    textArea:"SOY EL TEXT AREA",
    privateKey: "a",
    publicKey: "a",
    }),
    methods:{
      Encriptar(){
        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.$data.publicKey);
        let result  = encrypt.encrypt(this.$data.textArea);
        alert(result);
        console.log(result)
        let secret = result;
        let decrypt = new JSEncrypt()
        // Set private key
        decrypt.setPrivateKey(this.$data.privateKey)
        // Declassified data
        result = decrypt.decrypt(secret)
        alert(result);
        
      },
      Firmar(){
        let sign = new JSEncrypt();
        sign.setPrivateKey(this.$data.privateKey)

        // let sha256 = new sha256()
        alert(sha256("hola"));

        // console.log(VueCryptojs.AES.encrypt("Hi There!", "Secret Passphrase").toString())
        let signature = sign.sign(this.$data.textArea, sha256, "sha256");


        // Verify with the public key...
        let verify = new JSEncrypt();
        verify.setPublicKey(this.$data.publicKey);
        let verified = verify.verify(this.$data.textArea, signature, sha256);

        // Now a simple check to see if the round-trip worked.
        if (verified) {
          alert('It works!!!');
          alert(verified);
          alert(signature);

        }
        else {
          alert('Something went wrong....');
        }
      }
    },
  })
</script>


<style scoped>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>