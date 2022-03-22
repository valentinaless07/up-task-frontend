import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import ModalFormularioTarea from '../components/ModalFormularioTarea'


const Proyecto = () => {

  const params = useParams()

  const {id} = params

  const {obtenerProyecto, proyecto, cargando, handleModalTarea} = useProyectos()

  const [modal, setModal] = useState(false)

  useEffect( () => {
    

      obtenerProyecto(id)
      
    
  
  }, [])
  

  const {nombre} = proyecto
  

  return (
    cargando ? '' :
    <>
    <div className='flex justify-between'>
      <h1 className='font-black text-4xl'>{nombre}</h1>
      <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
      <Link to={`/proyectos/editar/${id}`} className='uppercase font-bold'>
      Editar
      </Link>
      </div>
      </div>

      <button 
      onClick={handleModalTarea}
      type='button' className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
        Nueva Tarea
      </button>
      <ModalFormularioTarea/>
      </> 
    
  )
}

export default Proyecto