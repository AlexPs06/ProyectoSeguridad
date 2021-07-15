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
    <!-- v-on:click ="Firmar()" -->
       <v-btn   color="blue-grey" class="ma-1 white--text"  @click="signDialog = true"  >  
              Firmar  <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        <!-- v-on:click ="ObtenerLlaves()" -->
         <v-btn  color="blue-grey" class="ma-1 white--text"   @click="keysDialog = true"  >  
              Obtener Llaves  <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        <v-btn  color="blue-grey" class="ma white--text"   @click="verifyDialog = true"  >  
              Verificar documento  <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        

        

    </v-toolbar>
    
  </v-card>

   <v-dialog
        v-model="keysDialog"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-title>
            Ingrese una contraseña
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="Contraseña"
              :rules="rules"
              hide-details="auto"
              v-model="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="keysDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              text
              :disabled="(password.length<=3)"
              v-on:click ="ObtenerLlaves()"
            >
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="signDialog"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-title>
            Ingrese los archivos
          </v-card-title>

          
          <v-card-text>

              <v-container>
            <v-row>
               <v-col cols="12">
                 <v-checkbox
          v-model="checkbox"
          :label="`2 Firmas: ${checkbox.toString()}`"
          ></v-checkbox>
                 <v-text-field
                  label="Contraseña 1"
                  :rules="rules"
                  hide-details="auto"
                  v-model="password"
                  type="password"
                  >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                 <v-text-field
                 v-if="checkbox"
                  label="Contraseña 2"
                  :rules="rules"
                  hide-details="auto"
                  v-model="password2"
                  type="password"
                  >
                </v-text-field>
              </v-col>


              <v-col cols="12">
                 <v-file-input
                  v-on:change="obtenerDatos(file1,file2)"
                  v-model="file1"
                  multiple
                  label="Subir archivo 1"
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                 <v-file-input
                  v-if="checkbox"
                  v-on:change="obtenerDatos(file1,file2)"
                  v-model="file2"
                  multiple
                  label="Subir archivo 2"
                ></v-file-input>
              </v-col>
            </v-row>
              </v-container>

           
            
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="signDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              text
              v-on:click ="Firmar()"
            >
              <!-- :disabled="(password.length<=3 || file1==null) || (   ) " -->

              Aceptar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>



      <v-dialog
        v-model="verifyDialog"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-title>
            Ingrese los archivos
          </v-card-title>

          
          <v-card-text>

              <v-container>
            <v-row>
               <v-col cols="12">
                 <v-checkbox
          v-model="checkbox"
          :label="`2 Firmas: ${checkbox.toString()}`"
          ></v-checkbox>
                 
              </v-col>

              <v-col cols="12">
                 <v-file-input
                  v-on:change="obtenerDatosArchivoLlavePublica(file1,file2)"
                  v-model="file1"
                  multiple
                  label="Llave publica 1"
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                 <v-file-input
                  v-if="checkbox"
                  v-on:change="obtenerDatosArchivoLlavePublica(file1,file2)"
                  v-model="file2"
                  multiple
                  label="Llave publica 2"
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                 <v-file-input
                  
                  v-on:change="obtenerDatosArchivoFirmado()"
                  v-model="file3"
                  multiple
                  label="Archivo firmado"
                ></v-file-input>
              </v-col>

            </v-row>
              </v-container>

           
            
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="verifyDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              text
              v-on:click ="VerificarFirmas()"
            >
              <!-- :disabled="(password.length<=3 || file1==null) || (   ) " -->

              Aceptar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
    privateKey: [],
    publicKey: [],
    secureSign:[],
    password:"",
    password2:"",
    passwordArray:[],
    checkbox:false,
    rules: [
        value => !!value || 'Requerido.',
        value => (value && value.length >= 3) || 'Min 3 caracteres',
      ],
    keysDialog: false,
    verifyDialog: false,
     file1:null,
     file:[],
     file2:null,
     file3:null,
     signDialog:false,
    }),
    methods:{
      obtenerDatos(file: any ,file2 : any ){
        // console.log(this.$data.file.length);
        console.log(file);
        console.log(file2);
        this.$data.publicKey = []
        this.$data.privateKey = []
        this.$data.secureSign = []
        this.$data.file=[]
        if(file!=null){
          this.$data.file.push(file[0])
        }
        if(file2!=null){
          this.$data.file.push(file2[0])
        }
        for (let index = 0; index < this.$data.file.length; index++) {
            const reader = new FileReader()
            reader.readAsText(this.$data.file[index]);
            reader.onload = () => {
              console.log(reader.result);
              let string = ""; 
              if(reader.result != null){
                string = reader.result.valueOf().toString();
                // console.log(string.search("Llave Publica:") );
                // console.log(string.search("Llave Privada:") );
                // console.log(string.search("Certificado:") );
                this.$data.publicKey.push(decode( string.substring(string.search("Llave Publica:")+16, string.search("Llave Privada:")-1) ));
                this.$data.privateKey.push(decode( string.substring(string.search("Llave Privada:")+16, string.search("Certificado:")-1) ));
                this.$data.secureSign.push(decode( string.substring(string.search("Certificado:")+14, string.length) ));
                console.log(this.$data.secureSign[index]);
                
              }
            }
        }
      },
      obtenerDatosArchivoLlavePublica(file: any ,file2 : any ){
        // console.log(this.$data.file.length);
        this.$data.publicKey = []
        this.$data.file=[]
        if(file!=null){
          this.$data.file.push(file[0])
        }
        if(file2!=null){
          this.$data.file.push(file2[0])
        }
        for (let index = 0; index < this.$data.file.length; index++) {
            const reader = new FileReader()
            reader.readAsText(this.$data.file[index]);
            reader.onload = () => {
              console.log(reader.result);
              let string = ""; 
              if(reader.result != null){
                
                
                string = reader.result.valueOf().toString();
                this.$data.publicKey.push(decode( string ));
                console.log(this.$data.publicKey[0]);
              }
            }
        }
      },
      obtenerDatosArchivoFirmado(){
        this.$data.secureSign = []

        const reader = new FileReader()
            reader.readAsText(this.$data.file3[0]);
            reader.onload = () => {
              let string = ""; 
              if(reader.result != null){
                string = reader.result.valueOf().toString();
                this.$data.textArea = string.substring(0, string.search("Firma de seguridad 0")-1 );
                
                if(string.search("Firma de seguridad 0") != -1 && string.search("Firma de seguridad 1") != -1 ){
                  this.$data.secureSign.push(decode( string.substring(string.search("Firma de seguridad 0")+20, string.search("Firma de seguridad 1")) ));

                  this.$data.secureSign.push(decode( string.substring(string.search("Firma de seguridad 1")+20, string.length))  );
                  console.log(this.$data.secureSign);
                }
                if(string.search("Firma de seguridad 0") != -1 && string.search("Firma de seguridad 1") == -1 ){
                  this.$data.secureSign.push(decode( string.substring(string.search("Firma de seguridad 0")+20, string.length))  );
                  console.log(this.$data.secureSign);
                }
                // this.$data.secureSign.push(decode( string.substring(string.search("Firma de seguridad "+index)+14, string.length) ));
                
              }
            }
      },
      ObtenerLlaves(){
         const post = {
            password:this.$data.password,
          };
        axios.post('http://127.0.0.1:3333/seguridad/generar',post).then(response => {
                

                this.$data.secureSign = [];
                this.$data.publicKey = [];
                this.$data.privateKey = [];
                this.$data.secureSign.push(encode(response.data.sign));
                this.$data.publicKey.push(encode(response.data.publicKey)) ;
                this.$data.privateKey.push( encode(response.data.privateKey)) ;
                //Aquí el archivo
                var llavePu = new Blob([encode(response.data.publicKey)], {type: "text/plain;charset=utf-8"});
                saveAs(llavePu, "LlavePublica.txt");
                var llavePrivada = new Blob([encode(response.data.privateKey)], {type: "text/plain;charset=utf-8"});
                saveAs(llavePrivada, "LlavePrivada.txt");
                var certificado = new Blob(["Llave Publica: \n"+encode(response.data.publicKey)+"\nLlave Privada: \n"+encode(response.data.privateKey)+
                "\nCertificado: \n"+encode(response.data.sign)], {type: "text/plain;charset=utf-8"});
                saveAs(certificado, "Certificado.txt");
                this.$data.keysDialog =false;
            })
            .catch(function (error) {
                console.log(error);
            }) 
        
      },
      VerificarFirmas(){
        const post = {
            publicKey:this.$data.publicKey,
            secureSign:this.$data.secureSign,
            text:this.$data.textArea
          };
        axios.post('http://127.0.0.1:3333/seguridad/verificar',post).then(response => {
          alert("Firmas validas");

          })
            .catch(function (error) {
            alert("Firmas invalidas");

                console.log(error);
            }) 

      },
      Firmar(){
        this.$data.passwordArray=[]

        this.$data.passwordArray.push(this.$data.password)
        this.$data.passwordArray.push(this.$data.password2)

        const post = {
                    privateKey:this.$data.privateKey,
                    publicKey:this.$data.publicKey,
                    textArea:this.$data.textArea,
                    sign:this.$data.secureSign,
                    password: this.$data.passwordArray
            };
            
        axios.post('http://127.0.0.1:3333/seguridad/firmar', post ).then(response => {
               
                //Aquí el archivo
                let firmas =this.$data.textArea;
                for (let index = 0; index < response.data.sign.length; index++) {
                  const element = response.data.sign[index];
                  firmas = firmas +"\nFirma de seguridad " +index +"\n"+encode(element);
                }

                var certificado = new Blob([firmas]);
                saveAs(certificado, "DocumentoFirmado.txt");
                this.$data.signDialog =false;
            })
            .catch(function (error) {
                console.log(error);
                alert("Error en las firmas")
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