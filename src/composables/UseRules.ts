export function rulesValidation() {
  const rules = {
    // Ejemplo de regla con buen uso de expresiones regulares y validación clara
    soloNumerosYComas: (value: any) => {
      if (!value) return true;
      return /^[0-9,]+$/.test(value) || 'Solo números y comas.';
    },
    mayorCero: (value: any) => parseInt(value) > 0 || 'El valor debe ser mayor que 0',
    year: (value: any) => {
      const currentYear = new Date().getFullYear();
      return /^(19\d{2}|20\d{2})$/.test(value) || `Ingrese un año válido (${currentYear} por ejemplo).`;
    },
    required: (value: any) => {
      const isEmpty =
        value == null ||
        value === '' ||
        value == undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && (value.label === '' || value.value === '' || value.value === null));
      return isEmpty ? 'Campo Requerido' : true;
    },
    email: (value: any) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) || 'E-mail inválido.';
    },
    isSimilar: (value: any, text: any, tipo: any) => value === text || `${tipo} no son iguales`,
    emailPart: (value: any) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))$/;
      return pattern.test(value) || 'E-mail inválido.';
    },
    minMaxFile: (value: any, min: any, max: any) => {
      if (value)
        return (
          (value.length >= min && value.length <= max) ||
          `Min: ${min} - Max: ${max} archivos.`
        );
      else return true;
    },
    minimoObjeto: (value: any, minimo: number, tipo: string) => {
      return parseInt(value) >= minimo || `Mínimo ${minimo} ${tipo}.`;
    },
    dniRucFormat: (val: string) => {
      if (val) {
        const dniRegex = /^\d{8}$/;
        const rucRegex = /^\d{11}$/;
        return (
          dniRegex.test(val) ||
          rucRegex.test(val) ||
          'DNI debe tener 8 dígitos o RUC debe tener 11 dígitos'
        );
      } else {
        return true;
      }
    },
    rangoNumerico: (value: any, min: number, max: number) => {
      const pattern = new RegExp(`^\\d{${min},${max}}$`); // Crea el patrón dinámico
      return (
        pattern.test(value) ||
        `Ingrese un número entre ${min} y ${max} dígitos.`
      );
    },
    minMax: (value: any, min: any, max: any) => {
      if (value)
        return (
          (value.length >= min && value.length <= max) ||
          `Min: ${min} - Max: ${max} caract.`
        );
      else return true;
    },
    minLength: (value: any, minLength: number) => {
      if (value) {
        return value.length >= minLength || `Mínimo ${minLength} numeros.`;
      } else {
        return true;
      }
    },
    minLengthStr: (value: any, minLength: number) => {
      if (value) {
        return value.length >= minLength || `Mínimo ${minLength} caracteres.`;
      } else {
        return true;
      }
    },
    minMaxNumeric: (value: any, min: number, max: number) => {
      if (!isNaN(value)) {
        const numericValue = parseFloat(value);
        return (
          (numericValue >= min && numericValue <= max) ||
          `El valor debe estar entre ${min} y ${max}.`
        );
      }
      return 'Por favor ingrese un valor numérico.';
    },
    alfanumerico: (value: any) => {
      const pattern = /^[A-Za-z0-9]+$/;
      return pattern.test(value) || 'El campo debe ser alfanumérico';
    },
    alfabetico: (value: any) => {
      const pattern = /^[A-Za-z\s]+$/;
      return pattern.test(value) || 'El campo debe ser alfabético sin tíldes';
    },
    alfabeticonMinusSinEspacios: (value: any) => {
      const pattern = /^[a-z_-]+$/;
      return (
        pattern.test(value) ||
        'El campo debe ser alfabético con minusculas, sin espacio ni tildes.'
      );
    },
    alfabeticoTildes: (value: any) => {
      const pattern =
        /^[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ\s]+$/;
      return pattern.test(value) || 'El campo debe ser alfabético';
    },
    numerico: (value: any) => {
      const pattern = /^[0-9]+$/;
      return pattern.test(value) || 'El campo debe ser numérico';
    },
    fechaInicio: (valuex: any, fechaFin: any) => {
      const value = new Date(valuex);
      const fechaFin2 = new Date(fechaFin);
      console.log(value <= fechaFin2);
      if (value && fechaFin2)
        return (
          value <= fechaFin2 || 'Fecha inicio debe ser menor/igual a fecha fin'
        );
      else return true;
    },
    fechaFin: (valuex: any, fechaInicio: any) => {
      const value = new Date(valuex);
      const fechaInicio2 = new Date(fechaInicio);
      console.log(value, fechaInicio2);

      if (value && fechaInicio2)
        return (
          value >= fechaInicio2 ||
          'Fecha fin debe ser mayor/igual a fecha inicio'
        );
      else return true;
    },
    fechaPasada: (value: any) => {
      // Verificar que el valor no sea nulo o vacío
      if (!value) {
        return 'Fecha requerida.';
      }

      // Separar la fecha por "/"
      const dateParts = value.split('/');
      if (dateParts.length !== 3) {
        return 'Formato de fecha inválido.';
      }
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Los meses en Date son 0-based
      const year = parseInt(dateParts[2], 10);
      // Validar que día, mes y año sean números válidos
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return 'Fecha inválida.';
      }
      // Crear objeto Date para la fecha ingresada
      const inputDate = new Date(year, month, day);
      if (isNaN(inputDate.getTime())) {
        return 'Fecha inválida.';
      }
      // Crear objeto Date para la fecha actual
      const today = new Date();
      // Establecer las horas a 0 para ambas fechas para una comparación precisa
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      // Comparar las fechas
      if (inputDate < today) {
        return 'La fecha ya venció.'; // Si la fecha es anterior a hoy
      }

      // Si la fecha es hoy o en el futuro, es válida
      return true;
    },
    placaFormat: (value: any) => {
      const pattern = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/;
      return pattern.test(value) || 'Formato de placa inválido (ej. ABC-123).';
    },
    formatoFechaRango: (value: any) => {
      const pattern = /^(0[1-9]|[1-2]\d|3[01])(\/)(0[1-9]|1[012])\2(\d{4})$/;
      const value1 = value.split(' ~ ')[0];
      const value2 = value.split(' ~ ')[1];
      if (value2 == '') return 'La Fecha fin no debe ser vacía';
      if (!pattern.test(value1)) {
        return 'Fecha Inicio inválida';
      }
      if (!pattern.test(value2)) {
        return 'Fecha Fin inválida';
      }
      const day = parseInt(value1.split('/')[0]);
      const month = parseInt(value1.split('/')[1]);
      const year = parseInt(value1.split('/')[2]);
      const day2 = parseInt(value2.split('/')[0]);
      const month2 = parseInt(value2.split('/')[1]);
      const year2 = parseInt(value2.split('/')[2]);
      const monthDays = new Date(year, month, 0).getDate();
      const monthDays2 = new Date(year2, month2, 0).getDate();
      if (day > monthDays) {
        return 'Fecha inválida';
      }
      if (day2 > monthDays2) {
        return 'Fecha inválida';
      }
      return true;
    },
    validFechaRango: (value: any, fecha1: any, fecha2: any) => {
      const value1 = value.split(' ~ ')[0].split('/').reverse().join('-');
      const value2 = value.split(' ~ ')[1].split('/').reverse().join('-');
      const fechaIni = fecha1.split('/').join('-');
      const fechaFin = fecha2.split('/').join('-');
      if (fechaIni != '' && fechaFin != '') {
        if (value2 < fechaFin)
          return 'La fecha fin debe ser mayor o igual a ' + fechaFin;
        if (value1 > fechaIni)
          return 'La fecha inicio debe ser menor o igual a ' + fechaIni;
      }
      if (value2 == value1)
        return 'La fecha inicio no deber ser igual a la fecha fin';
      if (value1 > value2)
        return 'Fecha fin debe ser mayor/igual a fecha inicio';
      return true;
    },
    hora: (value: any) => {
      const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return pattern.test(value) || 'Hora inválida (HH:mm)';
    },
    horaInicio: (value: any, horaFin: any) => {
      if (value && horaFin)
        return (
          value <= horaFin || 'Hora inicio debe ser menor/igual a hora fin'
        );
      else return true;
    },
    horaFin: (value: any, horaInicio: any) => {
      if (value && horaInicio)
        return (
          value >= horaInicio || 'Hora fin debe ser mayor/igual a hora inicio'
        );
      else return true;
    },
    usuario: (value: any) => {
      if (value.includes(' ')) {
        return 'El usuario no debe contener espacios';
      }
      const regex = /^[a-zA-Z0-9_\/]+$/;
      if (!regex.test(value)) {
        return 'El usuario solo puede contener letras sin tildes, números y guiones bajos';
      }
      return true;
    },
    validarRegex: (value: any, regex: any, mensaje: any) => {
      const pattern = new RegExp(regex);
      return pattern.test(value) || mensaje;
    },
    entero: (value: any) => {
      const pattern = /^\d+$/;
      return pattern.test(value) || 'Debe ser un número entero.';
    },
    enteroPositivo: (value: any) => {
      const pattern = /^(?!-)\d+$/;
      return pattern.test(value) || 'Debe ser un número entero positivo.';
    },
    dosDecimalesPositivo: (value: any) => {
      const pattern = /^(?!-)\d+(\.\d{1,2})?$/;
      return (
        (pattern.test(value) && parseFloat(value) > 0) ||
        'Debe ser un número positivo con max. 2 decimales.'
      );
    },
    condicion: (value: any) => {
      if (value == '1' || value == '0') return true;
      else return 'El valor debe ser 1 (Si) o 0 (No)';
    },
    fecha: (value: any) => {
      const pattern = /^[0-9-]+$/;
      return !pattern.test(value)
        ? 'El campo no acepta letras y el formato den fecha es yyyy-mm-dd'
        : value?.toString().split('-')[0].length <= 2
          ? 'Existe Fecha con el formato dd-mm-yyyy deberia enviarse con el formato yyyy-mm-dd'
          : true;
    },
    numericoFecha: (value: any) => {
      const pattern = /^[0-9]+$/;
      return pattern.test(value) || 'El campo debe ser numérico';
    },
    soloNumerosDecimales: (value: any) => {
      const pattern = /^-?\d*\.?\d+$/;
      return (
        pattern.test(value) ||
        'El campo solo acepta números enteros, decimales.'
      );
    },
    validateModelInOptions: (value: any, options: any[]) => {
      const exists = options.some((opt) => opt.value == value?.value);
      return (
        exists ||
        'El valor seleccionado ya no es válido. Por favor, elija otra opción.'
      );
    },
    RucFormat: (val: string) => {
      if (val) {
        const rucRegex = /^\d{11}$/; // Solo permite exactamente 11 dígitos
        return rucRegex.test(val) || 'El RUC debe tener 11 dígitos';
      } else {
        return true;
      }
    },
    telefonoFormat: (val: string) => {
      if (val) {
        const rucRegex = /^\d{9}$/; // Solo permite exactamente 9 dígitos
        return rucRegex.test(val) || 'El Teléfono debe tener 9 dígitos';
      } else {
        return true;
      }
    },
  };

  return { rules };
}
