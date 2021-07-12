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
         <v-btn  color="blue-grey" class="ma-2 white--text" v-on:click ="ObtenerLlaves()"  >  
              ObtenerLlaves  <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        

    </v-toolbar>
  </v-card>


  <v-sheet class="pa-12" color="grey lighten-3" elevation="24" style="max-height: 100%; "  >

  <v-textarea  label="Llave privada"  hide-details="auto" v-model="privateKey" clearable class="overflow-y-auto; text-left;"> </v-textarea>
  <!--<v-text-field  label="Llave privada"  hide-details="auto" v-model="privateKey" clearable class="overflow-y-auto; text-left;"> </v-text-field>-->
  <v-textarea  label="Llave publica"  hide-details="auto" v-model="publicKey" clearable class="overflow-y-auto; text-left;"> </v-textarea>
  <v-textarea  label="Firma de seguridad"  hide-details="auto" v-model="secureSign" clearable class="overflow-y-auto; text-left;"> </v-textarea>
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
  import axios from 'axios'
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
    secureSign:"a",
    }),
    methods:{
      ObtenerLlaves(){
        axios.get('http://127.0.0.1:3333/seguridad/generar').then(response => {
                
                this.$data.secureSign = response.data.sign;
                this.$data.publicKey = response.data.publicKey;
                this.$data.privateKey = response.data.privateKey;
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            }) 
        
      },
      Firmar(){
        const post = {
                    privateKey:this.$data.privateKey,
                    publicKey:this.$data.publicKey,
                    textArea:this.$data.textArea,
                    sign:this.$data.secureSign
            };
        axios.post('http://127.0.0.1:3333/seguridad/firmar', post ).then(response => {
               
                console.log(response.data);
                alert("esta es la firma del text area: "+ response.data.sign)

                
            })
            .catch(function (error) {
                console.log(error);
            })
 
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