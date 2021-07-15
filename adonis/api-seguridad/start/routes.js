'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() =>{
  //Primer parámetro es la ruta, el segundo parámetro es la función que corresponde la ruta.
  
  Route.post('firmar','CurvasElipController.Firmar')
  Route.post('generar','CurvasElipController.generarLlaves')
  Route.post('verificar','CurvasElipController.comprobarArchivo')

// Prefix dice a quién le pertenece las rutas
} ).prefix('seguridad')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
