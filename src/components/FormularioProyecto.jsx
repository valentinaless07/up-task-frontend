import React, { useEffect, useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from '../components/Alerta'
import { useParams } from 'react-router-dom'



const FormularioProyecto = () => {

    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos()

    const params = useParams()

    useEffect(() => {
      
    if(params.id){
        setNombre(proyecto.nombre)
        setDescripcion(proyecto.descripcion)
        setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
        setCliente(proyecto.cliente)
        setId(proyecto._id)
    }
    else{
        
    }
      
    }, [params])
    

    

    const handleSubmit = async (e) => {
        e.preventDefault()
        if([nombre, descripcion, cliente, fechaEntrega].includes('')){
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
                
            })
            return
        }

        // Pasar datos al provider
        await submitProyecto({nombre, descripcion, fechaEntrega, cliente, id})
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
        setId(null)
        
    }

    const {msg} = alerta

  return (
    <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
    onSubmit={handleSubmit}
    >

        {msg && <Alerta alerta={alerta} />}

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='nombre'>
                Nombre Proyecto
            </label>

            <input 
            id='nombre'
            type='text'
            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:outline-gray-300'
            placeholder='Nombre del Proyecto'
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            />

        </div>

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='descripcion'>
                Descripción Proyecto
            </label>

            <textarea 
            id='descripcion'
            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:outline-gray-300'
            placeholder='Descripción del Proyecto'
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            />

        </div>

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='fecha-entrega'>
                 Fecha de entrega
            </label>

            <input 
            id='fecha-entrega'
            type='date'
            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:outline-gray-300'
            value={fechaEntrega}
            onChange={e => setFechaEntrega(e.target.value)}
            />

        </div>

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='cliente'>
                Nombre del Cliente
            </label>

            <input 
            id='cliente'
            type='text'
            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:outline-gray-300'
            placeholder='Nombre del Cliente'
            value={cliente}
            onChange={e => setCliente(e.target.value)}
            />

        </div>

        <input type='submit' value={id ? 'Actualizar Proyecto' : 'Crear Proyecto' } className='bg-sky-600 w-full p-3 uppercase font-bold
        text-white rounded cursor-pointer hover:bg-sky-700 transition-colors
        '/>

    </form>
  )
}

export default FormularioProyecto