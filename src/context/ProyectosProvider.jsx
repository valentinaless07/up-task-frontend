import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import {useNavigate} from 'react-router-dom'
import io from 'socket.io-client'

let socket
const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {
    
    const navigate = useNavigate()
    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [alerta, setAlerta] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    useEffect(() => {
      
    const obtenerProyectos = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios('/proyectos', config)
            setProyectos(data)

        } catch (error) {
        console.log(error)
        }
    }

    obtenerProyectos()
      
    }, [])


    useEffect(() => {
      socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])
    

    const mostrarAlerta = (alerta) =>{
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 3500)
    }

    const submitProyecto = async (proyecto) =>{

        if(proyecto.id){
            await editarProyecto(proyecto)
        }
        else{
            await nuevoProyecto(proyecto)
        }       
            
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`proyectos/${proyecto.id}`, proyecto, config)

            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: 'Proyecto editado con éxito',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos', proyecto, config)

            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto creado con éxito',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
       try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
           const {data} = await clienteAxios(`/proyectos/${id}`, config)
           setProyecto(data)

          setAlerta({})
       } catch (error) {
           navigate('/proyectos')
           setAlerta({
               msg: error.response.data.msg,
               error: true
           })
           setTimeout(() => {
            setAlerta({})
        }, 3000)

       }
       finally{
           setCargando(false)
       }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`proyectos/${id}`, config)

           

            const proyectosActualizados = proyectos.filter(el => el._id !== id)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const editarTarea = async tarea => {
          
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
            
           

            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET
            socket.emit('actualizar tarea', data)

           
        } catch (error) {
            console.log(error)
        }
    }

    const crearTarea = async tarea => {
          
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/tareas', tarea, config)
            
           
            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET IO
            socket.emit('nueva tarea', data)
           
        } catch (error) {
            console.log(error)
        }
    }

    const submitTarea = async tarea => {
        if(tarea?.id){
            await editarTarea(tarea)
        }
        else{
            await crearTarea(tarea)
        }
    }

    const handleModalEditarTarea = async tarea =>{
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = async tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            
            setAlerta({
                msg: data.msg,
                error: false
            })

      
            setModalEliminarTarea(false)
           

            // SOCKET
            socket.emit('eliminar tarea', tarea)

            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        try {
            setCargando(true)
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post("/proyectos/colaboradores", {email}, config)
            setColaborador(data)
            setAlerta({})
            
            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async email  => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config) 

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setColaborador({})
                setAlerta({})
            }, 3000)
            
        } catch (error) {
           setAlerta({
               msg: error.response.data.msg,
               error: true
           })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)

    }


    const eliminarColaborador = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return 
    
                const config = {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config) 

                const proyectoActualizado = {...proyecto}

                proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(el => el._id !== colaborador._id)
                
                setProyecto(proyectoActualizado)

                setAlerta({
                    msg: data.msg,
                    error: false
                })

                setColaborador({})

                setModalEliminarColaborador(false)

                setTimeout(() => {
                    setAlerta({})
                }, 3000)

                
            } catch (error) {
                console.log(error)
            }
    }


    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
        
            setTarea({})
            setAlerta({})

            // SOCKET

            socket.emit('cambiar estado', data)
           
        } catch (error) {
            console.log(error)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // SOCKET IO

    const submitTareasProyecto = (tarea) => {
       
        const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
            setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(el=> el._id !== tarea._id)
       setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(el => el._id === tarea._id ? tarea : el)
        setProyecto(proyectoActualizado)
    }

    const completarTareaProyecto = tarea => {
            
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(el => el._id === tarea._id ? tarea : el)
        setProyecto(proyectoActualizado)


    }

    return (
        <ProyectosContext.Provider
        value={{
            proyectos,
            mostrarAlerta,
            alerta,
            submitProyecto,
            obtenerProyecto,
            proyecto,
            cargando,
            eliminarProyecto,
            handleModalTarea,
            modalFormularioTarea,
            submitTarea,
            handleModalEditarTarea,
            tarea,
            handleModalEliminarTarea,
            modalEliminarTarea,
            eliminarTarea,
            submitColaborador,
            colaborador,
            agregarColaborador,
            handleModalEliminarColaborador,
            modalEliminarColaborador,
            eliminarColaborador,
            completarTarea,
            handleBuscador,
            buscador,
            submitTareasProyecto,
            eliminarTareaProyecto,
            actualizarTareaProyecto,
            completarTareaProyecto
        }}
        
        >
            {children}
        </ProyectosContext.Provider>
    )

}

export {
    ProyectosProvider
}

export default ProyectosContext