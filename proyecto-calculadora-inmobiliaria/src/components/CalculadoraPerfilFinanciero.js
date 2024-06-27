import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CalculadoraPerfilFinanciero = () => {
  const [inputs, setInputs] = useState({
    valor_propiedad_inicial: 200000,
    edad_propietario: 71,
    estado_salud: 'bueno',
    años: 10,
    tasa_apreciacion_anual: 0.03,
    tasa_rentabilidad_anual: 0.06,
    costos_mantenimiento_anual: 0.01,
    impuesto_inmueble: 0.002,
    tasa_impuesto_renta: 0.10
  });

  const [resultados, setResultados] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: name === 'estado_salud' ? value : Number(value)
    }));
  };

  const calcularPerfilFinanciero = () => {
    const {
      valor_propiedad_inicial,
      edad_propietario,
      estado_salud,
      años,
      tasa_apreciacion_anual,
      tasa_rentabilidad_anual,
      costos_mantenimiento_anual,
      impuesto_inmueble,
      tasa_impuesto_renta
    } = inputs;

    let factorPagoInicial;
    switch (estado_salud) {
      case 'bueno': factorPagoInicial = 0.50; break;
      case 'regular': factorPagoInicial = 0.60; break;
      case 'malo': factorPagoInicial = 0.75; break;
      default: factorPagoInicial = 0.50;
    }

    const pagoInicial = valor_propiedad_inicial * factorPagoInicial;
    const datosAnuales = [];

    for (let año = 0; año <= años; año++) {
      const valorPropiedad = valor_propiedad_inicial * Math.pow(1 + tasa_apreciacion_anual, año);
      const costoMantenimiento = valorPropiedad * costos_mantenimiento_anual;
      const impuestoPropiedad = valorPropiedad * impuesto_inmueble;
      const rentabilidadBruta = pagoInicial * Math.pow(1 + tasa_rentabilidad_anual, año) - pagoInicial;
      const impuestoRenta = rentabilidadBruta * tasa_impuesto_renta;
      const rentabilidadNeta = rentabilidadBruta - impuestoRenta - costoMantenimiento - impuestoPropiedad;

      datosAnuales.push({
        año,
        valorPropiedad: Math.round(valorPropiedad),
        costoMantenimiento: Math.round(costoMantenimiento),
        impuestoPropiedad: Math.round(impuestoPropiedad),
        rentabilidadBruta: Math.round(rentabilidadBruta),
        impuestoRenta: Math.round(impuestoRenta),
        rentabilidadNeta: Math.round(rentabilidadNeta)
      });
    }

    setResultados({
      pagoInicial: Math.round(pagoInicial),
      datosAnuales
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Perfil Financiero Inmobiliario</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.entries(inputs).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{key.replace(/_/g, ' ')}</label>
            {key === 'estado_salud' ? (
              <select
                name={key}
                value={value}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="malo">Malo</option>
              </select>
            ) : (
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={calcularPerfilFinanciero}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Calcular Perfil Financiero
      </button>
      {resultados && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Resultados</h2>
          <p className="mb-4">Pago Inicial: ${resultados.pagoInicial.toLocaleString()}</p>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={resultados.datosAnuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="año" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valorPropiedad" stroke="#8884d8" name="Valor Propiedad" />
              <Line type="monotone" dataKey="rentabilidadNeta" stroke="#82ca9d" name="Rentabilidad Neta" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Año</th>
                  <th className="px-4 py-2 border">Valor Propiedad</th>
                  <th className="px-4 py-2 border">Costo Mantenimiento</th>
                  <th className="px-4 py-2 border">Impuesto Propiedad</th>
                  <th className="px-4 py-2 border">Rentabilidad Bruta</th>
                  <th className="px-4 py-2 border">Impuesto Renta</th>
                  <th className="px-4 py-2 border">Rentabilidad Neta</th>
                </tr>
              </thead>
              <tbody>
                {resultados.datosAnuales.map((dato) => (
                  <tr key={dato.año}>
                    <td className="px-4 py-2 border">{dato.año}</td>
                    <td className="px-4 py-2 border">${dato.valorPropiedad.toLocaleString()}</td>
                    <td className="px-4 py-2 border">${dato.costoMantenimiento.toLocaleString()}</td>
                    <td className="px-4 py-2 border">${dato.impuestoPropiedad.toLocaleString()}</td>
                    <td className="px-4 py-2 border">${dato.rentabilidadBruta.toLocaleString()}</td>
                    <td className="px-4 py-2 border">${dato.impuestoRenta.toLocaleString()}</td>
                    <td className="px-4 py-2 border">${dato.rentabilidadNeta.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculadoraPerfilFinanciero;
