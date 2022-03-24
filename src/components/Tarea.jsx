import React from 'react'
import { formatearFecha } from '../helpers/formatearFecha'
import useProyectos from '../hooks/useProyectos'

const Tarea = ({tarea}) => {

    const {descripcion, nombre, prioridad, fechaEntrega, _id, estado} = tarea
    const {handleModalEditarTarea , handleModalEliminarTarea} = useProyectos()

  return (
    <div className='border-b p-5 flex justify-between items-center'>
        <div>
            <p className='mb-1 text-xl '>
            {nombre}
            </p>    
            <p className='mb-1 text-sm text-gray-500 uppercase '>
            {descripcion}
            </p>    
            <p className='mb-1 text-sm '>
            {formatearFecha(fechaEntrega)}
            </p>    
            <p className='mb-1 text-gray-600'>
            Prioridad: {prioridad}
            </p>    
        </div>
           
        <div className='flex gap-2'>
        <button className='
            bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg
            '
            onClick={() => handleModalEditarTarea(tarea)}
            >
            
                Editar
            </button>

            {estado ? (
                 <button className='
                 bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg
                 '>
                     Completa
                 </button>
            ):
            (
                <button className='
            bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg
            '>
                Incompleta
            </button>
            )
            }


            <button onClick={handleModalEliminarTarea} className='
            bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg
            '>
                Eliminar
            </button>
        </div>
    </div>
  )
}

export default Tarea