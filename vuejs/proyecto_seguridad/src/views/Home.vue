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
        

        <v-file-input
        v-on:change="obtenerDatos()"
        v-model="file"
        multiple
        label="Subir archivo"
      ></v-file-input>

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
  import { saveAs } from 'file-saver';
  import { jsPDF } from "jspdf";
  import { encode, decode } from 'js-base64';
  // import {Filereader} from "filereader";
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
     file:null,
    }),
    methods:{
      obtenerDatos(){
       
        console.log(this.$data.file[0]);
        const reader = new FileReader()
        let texto = "";
        reader.readAsText(this.$data.file[0]);
        // reader.onload = e => (texto = e.target.result.toString());    
        // console.log(reader.onload = e => (texto = e.target.result + texto));
        
        reader.onload = () => {
          console.log(reader.result);
          let string = ""; 
          if(reader.result != null){
            string = reader.result.valueOf().toString();
            console.log(string.search("Llave Publica:") );
            console.log(string.search("Llave Privada:") );
            console.log(string.search("Certificado:") );
            this.$data.publicKey = decode( string.substring(string.search("Llave Publica:")+16, string.search("Llave Privada:")-1) );
            this.$data.privateKey = decode( string.substring(string.search("Llave Privada:")+16, string.search("Certificado:")-1) );
            this.$data.secureSign = decode( string.substring(string.search("Certificado:")+14, string.length) );
          }
          
        }
        
      },
      ObtenerLlaves(){
        axios.get('http://127.0.0.1:3333/seguridad/generar').then(response => {
                
                this.$data.secureSign = response.data.sign;
                this.$data.publicKey = response.data.publicKey;
                this.$data.privateKey = response.data.privateKey;
                //Aquí el archivo
                var llavePu = new Blob([encode(response.data.publicKey)], {type: "text/plain;charset=utf-8"});
                saveAs(llavePu, "LlavePublica.txt");
                var llavePrivada = new Blob([encode(response.data.privateKey)], {type: "text/plain;charset=utf-8"});
                saveAs(llavePrivada, "LlavePrivada.txt");
                var certificado = new Blob(["Llave Publica: \n"+encode(response.data.publicKey)+"\nLlave Privada: \n"+encode(response.data.privateKey)+
                "\nCertificado: \n"+encode(response.data.sign)], {type: "text/plain;charset=utf-8"});
                saveAs(certificado, "Certificado.txt");
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
               
                // console.log(response.data);
                // alert("esta es la firma del text area: "+ response.data.sign)
                //alert("esta es la firma del text area: "+ response.data.sign)
                const doc = new jsPDF();
                doc.text( 'Novus Ordo Seclorum', 70,20);
                doc.text( 'Juro solemnemente que mis intenciones no son buenas.',20,30);
                doc.text( this.$data.textArea,20,50);
                var lines = doc.splitTextToSize(encode(response.data.sign), 170);
                doc.text( lines,20,200);
                doc.save("DocumentoFirmado.pdf");
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