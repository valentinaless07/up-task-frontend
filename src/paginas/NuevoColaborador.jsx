import { useEffect } from "react"
import { useParams } from "react-router-dom"
import FormularioColaborador from "../components/FormularioColaborador"
import useProyectos from "../hooks/useProyectos"

const NuevoColaborador = () => {

    const {obtenerProyecto, proyecto, cargando} = useProyectos()
    const params = useParams()

    useEffect(() => {
      
    obtenerProyecto(params.id)

    }, [])
    
    if(cargando) return 'Cargando...'
  return (
    <>
    <h1 className="text-4xl font-black">
        Añadir Colaborador al Proyecto: 
        <span className="text-gray-500 from-neutral-800">
         {` ${proyecto.nombre}`}
        </span>
    </h1>

    <div className="mt-10 flex justify-center">
        <FormularioColaborador/>
    </div>
    </>
  )
}

export default NuevoColaborador