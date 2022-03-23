
export const formatearFecha = fecha => {
    const fechaNueva = new Date(fecha.split('T')[0].split('-'));
    const opciones = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }
    return fechaNueva.toLocaleDateString('es-ES', opciones)
  
  }