/**
 * moment es una libreria para manejar fechas
 * se usan para evitar problemas entre navegadores porque 
 * el formato de fecha de Date() de javascript no es el mismo en 
 * un navegador chrome que en safari por ejemplo
 */

// cambiamos a idioma español las variables de moment que vamos a usar
moment.locale('es', {
  months: ['enero','febrero','marzo','abril','mayo','junio','julio',
            'agosto','septiembre','octubre','noviembre','diciembre'],
  weekdays: ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
});


/**
 * function que va a convertir el valor ingresado en input a dolares
 * buscando la cotizacion en la api de ambito.com
 */
const conversionDolares = (dolares) => {
  const impPais = 30; // impuesto pais = 30%
  const impGan = 45; // percepcion adelanto de ganancias 45%
  const impCatar = 25; // impuesto catar para gastos mayores a 300 dolares

  // usamos moment para restarle 4 dias a la fecha actual y darle formato 2023-04-07
  const fechaInicio = moment().subtract(4,'days').format('YYYY-MM-DD');

  // usamos moment para agregarle 1 dia a la fecha actual y darle formato 2023-04-07
  const fechaFinal = moment().add(1,'days').format('YYYY-MM-DD');

  let cotizacionDolar = 0;

  // buscamos dentro del DOM el boton con id "submit"
  const boton = document.getElementById('submit');

  // cambiamos el texto del boton mientras se esta procesando la operacion
  boton.value = 'Procesando...';

  // hacemos la llamada a la api de ambito.com
  fetch(`https://mercados.ambito.com//dolar/oficial/historico-general/${fechaInicio}/${fechaFinal}`)
      .then(res => res.json()) // tomamos la respuesta y la convertimos a JSOM
      .then(data => {

        /**
         * --- IMPORTANTE ---
         * la respuesta de la api de ambito.com responde un array de 2 niveles (array con arrays adentro)
         * data = [
              ["Fecha","Compra","Venta"],
              ["05/04/2023","209,77","218,77"],
              ["04/04/2023","209,03","218,03"],
              ["03/04/2023","208,44","217,44"]
            ]
         */

        // accedemos a la posicion 1 de data y como es un array, accedemos a la posicion 2 de ese otro array
        cotizacionDolar = data[1][2]

        /**
         * parseFloat convierte un valor a "decimal", pero solamente si
         * es un numero valido, por lo tanto usamos replace para cambiar la , por el .
         */
        cotizacionDolar = parseFloat(cotizacionDolar.replace(',','.'))

        /**
         * aca la idea es poder mostrar si la cotizacion que se muestra es la de hoy o la de un dia
         * anterior, teniendo en cuenta que fines de semana y feriados no hay variaciones de cotizacion
         * 
         * necesitamos la ultima cotizacion que trae data, entonces para eso
         * accedemos a la posicion 1 de data y a la posicion 0 del array dentro de la posicion 1,
         * pero lo que obtenemos es "05/04/2023" y tenemos que pasarlo a "2023-04-05",
         * usamos 3 funciones de javascript:
         * 
         * - split() => divide un string en array buscando el parametro que le pasamos,
         *              en este caso "/": "05/04/2023" --> ["05","04","2023"]
         * - reverse() => invierte el array: ["05","04","2023"] --> ["2023","04","05"] 
         * - join() => junta los elementos de un array en un string, separandolo por el
         *            valor que pasamos, en este caso "-": "2023-04-05" 
         */
        const fecha = data[1][0].split('/').reverse().join('-');

        // tomamos como que hay cotizacion para el dia de hoy, es decir que estamos obteniendo
        // la cotizacion actual
        let fechaCotizacion = 'actual';

        /**
         * si la fecha de la cotizacion no es la misma que la actual
         * (! lo usamos cuando necesitamos que la condicion se cumpla cuando el resultado sea false)
         */
        if(!moment().isSame(fecha,'day')){
          // formatemaos la fecha de la cotizacion con el formato "miercoles 05 de abril"
          fechaCotizacion = `del ${moment(fecha).format('dddd DD [de] MMMM ')}`;
        }

        // calculamos el valor a partir del input y valor del dolar obtenido de ambito
        const valorOficial = dolares * cotizacionDolar;

        // calculamos el impuesto pais (30%)
        const impPaisVal = valorOficial * (impPais/100);
        
        // calculamos el adelanto de ganancias (45%)
        const adGananciasVal = valorOficial * (impGan/100);

        /**
         * el impuesto de catar (25%) se aplica solo a compras mayores a 300 dolares
         * ternaria -> (condicion) ? si se cumple condicion : si no se cumple condicion
         * 
         * Decir (dolares >= 300) ? valorOficial * (impCatar/100) : 0
         * es lo mismo que decir
         * if(dolares >= 300){
         *    valorOficial * (impCatar/100)
         * } else {
         *    0
         * }  
         */
        const impCatarVal = (dolares >= 300) ? valorOficial * (impCatar/100) : 0;

        // le sumamos al valor oficial todos los impuestos para obtener el total
        const total = valorOficial + impPaisVal + adGananciasVal + impCatarVal;
        
        /**
         * generamos el html que vamos a imprimir
         * usando ` ` podemos interpolar variables con ${variable}
         * 
         * toFixed() --> pone siempre 2 decimales. 
         *               Si hay menos completa con 0, si hay mas redondea.
         *                
         */
        const html = `
          <div class="card">
            <div class="result">
              <p class="text-center conversion-result">
                U$D ${dolares} = $AR ${total.toFixed(2)}<sup>(1)</sup>
              </p>
            </div>

            <p class="text-center conversion-detail">Detalles</p>
            
            <div class="conversion-details d-flex justify-content-between mb-2">
              <p><strong>Conversion al dolar oficial</strong></p>
              <p>$ ${valorOficial.toFixed(2)}</p>
            </div>
            <div class="conversion-details">
              <p><strong>Impuesto PAIS (30%)</strong></p>
              <p>$ ${impPaisVal.toFixed(2)}</p> 
            </div>

            <div class="conversion-details">
              <p><strong>Adelanto de ganancias (45%)</strong></p>
              <p>$ ${adGananciasVal.toFixed(2)}</p> 
            </div>

            <div class="conversion-details">
              <p><strong>Impuesto CATAR (25%) <sup>(2)</sup></strong></p>
              <p>$ ${impCatarVal.toFixed(2)}</p> 
            </div>
            
            
          </div>
          <div class="conversion-footer">
            <sup>(1)</sup> Valor calculado a segun la cotizacion ${fechaCotizacion} 
                          segun ambito.com (U$D 1 = $AR ${cotizacionDolar})
          </div>
          <div class="conversion-footer">
            <sup>(2)</sup> Impuesto aplicable solo a gastos que superen los U$D 300
          </div>
        `

        // buscamos en el DOM donde vamos a imprimir la tarjeta con el resultado
        const conversionResultado = document.getElementById('conversionResult');
        
        /** 
         * setTimeOut ejecuta algo dejando pasar un tiempo (en este caso 1000 milisegundos)
         * generalmente no se usa, pero aca lo use para que simule que tarda 1 segundo
         * en procesar la operacion
         */
        setTimeout(() => {
          // imprimims en el DOM la tarjeta generada mas arriba
          conversionResultado.innerHTML = html;

          // volvemos a cambiar el texto del boton
          boton.value = 'Calcular';
        }, 1000);
        
      })
      .catch(error => console.log(error))

}


// buscamos en el DOM el input
const inputDolares = document.getElementById('dolares');

// por defecto mostramos la conversion de 1 dolar
conversionDolares(1)

/**
 * escuchamos el evento keyup
 * keyup en el evento de soltar una tecla,
 * aca lo usamos para reemplazar "," por "." 
 * y que el input tenga un formato numerico valido
 */
inputDolares.addEventListener('keyup',(event) => {
  inputDolares.value.replace(',','.')
})

// buscamos en el DOM el formulario
const conversionForm = document.getElementById('conversionForm');

// escuchamos el evento submit del formulario
conversionForm.addEventListener('submit',(event) => {

  // evitamos el comportamiento predefinido de los formularios (recargar la pagina)
  event.preventDefault();

  /**
   * LOGICA: cuando el input sea invalido, se le va a agregar un borde rojo al input y 
   *          se va a mostrar un mensaje abajo del input.
   *          al enviar el formulario, necesitamos eliminar el rojo del input y 
   *          ocultar el mensaje, para despues hacer la validacion y mostrarlos en caso
   *          de ser invalido
   * 
   * vamos a acceder al input del formulario por su nombre (atributo name) 
   * formulario.name -> conversionForm.dolares
   */


  // buscamos en el DOM el mensaje de input invalido
  const dolarValorInvalido = document.getElementById('dolarValorInvalido');
  // con elemento.style.display cambiamos la visibilidad del elemento, en este caso se oculta
  dolarValorInvalido.style.display = 'none';
  // con classList.remove() eliminamos una clase de un elemento, en ese caso del input dolares  
  conversionForm.dolares.classList.remove('invalid-input')

  // convertimos a numero el valor del input
  const dolares = parseFloat(conversionForm.dolares.value);

  /**
   * necesitamos saber si el valor del input no es numerico o si es menor o igual a 0
   * isNaN verifica que el valor sea numerico. 
   * Es importante que sea || (o) en lugar de && (y) porque necesitamos que la condicion
   * se cumpla si cualquiera de las dos cosas es verdadera
   */
  
  if(isNaN(dolares) || dolares <= 0){

    // mostramos del mensaje de input invalido. Esto es lo mismo que en css -> display: block;
    dolarValorInvalido.style.display = 'block';

    // agregamos la clase invalid-input al input. Esta clase va a tener el borde rojo
    conversionForm.dolares.classList.add('invalid-input')

    /**
     * return en este caso corta la ejecucion, para que en caso de que el input 
     * no sea un numero o sea menor o igual a 0, no se ejecute lo de mas abajo
     * (llamada a la funcion de conversion)
     */
    // 

    return;
  }

  // llamamos a la funcion conversion pasando por parametro el valor del input
  conversionDolares(dolares);
})

