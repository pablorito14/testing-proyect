
moment.locale('es', {
  months: ['enero','febrero','marzo','abril','mayo','junio','julio',
            'agosto','septiembre','octubre','noviembre','diciembre'],
  weekdays: ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
});


const conversionDolares = (dolares) => {
  const impPais = 30; // impuesto pais = 30%
  const impGan = 45; // percepcion adelanto de ganancias 45%
  const impCatar = 25; // impuesto catar para gastos mayores a 300 dolares

  const fechaInicio = moment().subtract(5,'days').format('YYYY-MM-DD');
  const fechaFinal = moment().add(1,'days').format('YYYY-MM-DD');

  let cotizacionDolar = 0;

  // const loader = document.getElementById('conversionProcess');
  // loader.style.display = 'block'

  const boton = document.getElementById('submit');
  boton.value = 'Procesando...';

  fetch(`https://mercados.ambito.com//dolar/oficial/historico-general/${fechaInicio}/${fechaFinal}`)
      .then(res => res.json())
      .then(data => {
        console.log(fechaInicio,fechaFinal,data);
        cotizacionDolar = data[1][2]
        cotizacionDolar = parseFloat(cotizacionDolar.replace(',','.'))

        const fecha = data[1][0].split('/').reverse().join('-');
        let fechaCotizacion = 'actual';

        if(!moment().isSame(fecha,'day')){
          fechaCotizacion = `del ${moment(fecha).format('dddd DD [de] MMMM ')}`;
        }

        const valorOficial = dolares * cotizacionDolar;
        const impPaisVal = valorOficial * (impPais/100);
        const adGananciasVal = valorOficial * (impGan/100);
        const impCatarVal = (dolares >= 300) ? valorOficial * (impCatar/100) : 0;

        const total = valorOficial + impPaisVal + adGananciasVal + impCatarVal;
        
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
        const conversionResultado = document.getElementById('conversionResult');
        
        setTimeout(() => {
          conversionResultado.innerHTML = html;
          boton.value = 'Calcular';
        }, 1000);
        
      })
      .catch(error => console.log(error))

}



const inputDolares = document.getElementById('dolares');

conversionDolares(1)

inputDolares.addEventListener('keyup',(event) => {
  inputDolares.value.replace(',','.')
})


const conversionForm = document.getElementById('conversionForm');
conversionForm.addEventListener('submit',(event) => {
  event.preventDefault();
  const dolarValorInvalido = document.getElementById('dolarValorInvalido');
  dolarValorInvalido.style.display = 'none';
  conversionForm.dolares.classList.remove('invalid-input')

  const dolares = parseFloat(conversionForm.dolares.value);
  if(isNaN(dolares) || dolares <= 0){
    dolarValorInvalido.style.display = 'block';
    conversionForm.dolares.classList.add('invalid-input')
    return;
  }

  conversionDolares(dolares);
})

