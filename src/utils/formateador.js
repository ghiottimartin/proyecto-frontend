var formateadorMoneda = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: 'ARS'
});

export function formatearMoneda(valor) {
	if (isNaN(valor)) {
		valor = 0.00
	}
	
	var salida = formateadorMoneda.format(valor);
	var partes = salida.split(',');
	if (partes.length === 1) {
		salida += ',00';
	} else if (partes.length > 1) {
		var decimales = partes[partes.length - 1];
		if (decimales.length === 1) {
			salida += '0';
		}
	}
	return salida;
};
