import React, {useState, useEffect} from 'react';
import {store} from '../firebaseconfig.js';

const Formulario = () => {

    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [error, setError] = useState('');
    const [idRegistro, setId] = useState('');
    const [registros, setListaAgenda] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const regex = /^[0-9]*$/;

    const resetFormulario = ()=>{
        setNombre('');
        setTelefono('');
        setDireccion('');
    }
    
    
    useEffect(()=>{
         const getAgenda = async ()=>{
            const {docs} = await store.collection('agenda').get();
            const nuevaAgenda = docs.map(item => ({id: item.id,...item.data()}));
            setListaAgenda(nuevaAgenda);
        }
    
        getAgenda();
    }, []);
    

    

    const deleteRegistro = async (id)=>{
        try{
            await store.collection('agenda').doc(id).delete();
            const { docs } = await store.collection('agenda').get();
            const arrayNuevo = docs.map(item => ({id: item.id,...item.data()}));
            setListaAgenda(arrayNuevo);
            setError('');
            
        }catch(e){
            console.log(e);
        }
    }



    const setRegistro = async (e) => {
        e.preventDefault();
        const registro = {};

        try{
            if(nombre.length === 0 || direccion.length === 0 || telefono.length === 0){
                setError('Debe completar todos los campos');
                throw "Debe completar todos los campos";
            }else if(!(regex.test(telefono))){
                setError('El campo Telefono debe ser un numero');
                throw "El campo Telefono debe ser un numero";
            }else{
                const registro = {
                    nombre : nombre,
                    telefono : telefono,
                    direccion : direccion,
                }
                const resAdd = await store.collection('agenda').add(registro);
                const {docs} = await store.collection('agenda').get();
                const agenda = docs.map(item => ({id: item.id,...item.data()}));
                setListaAgenda(agenda);
                setError('');
                resetFormulario();
            }
            

        }catch(e){
            console.log(e);
            
        }
     }

    const actualizarRegistro = async (id) => {
        try{
                const registro = await store.collection('agenda').doc(id).get();
                const {nombre, telefono, direccion} = registro.data();
                setModoEdicion(true);
                setNombre(nombre);
                setDireccion(direccion);
                setTelefono(telefono); 
                setId(id);
        }catch(e){
            console.log(e);
        }      
    }

    const setUpdate =  async (e) => {
        e.preventDefault();
        try{
            if(nombre.length === 0 || telefono.length === 0 || direccion.length === 0){
                setError('Debe completar todos los campos');
                throw "Debe completar todos los campos";
                
            }else if(!( regex.test(telefono))){
                setError('El campo Telefono debe ser un numero');
                throw "El campo Telefono debe ser un numero";
            }else{


                const registroNuevo = {
                    nombre : nombre,
                    telefono : telefono,
                    direccion : direccion,
                }

                await store.collection('agenda').doc(idRegistro).set(registroNuevo);
                const {docs} = await store.collection('agenda').get();
                const agenda= docs.map(item => ({id: item.id,...item.data()}));
                setListaAgenda(agenda);  
                setError(''); 
            }

        }catch(e){
            console.log(e);
        }
        
        setModoEdicion(false);
        setId('');
        resetFormulario();
        
    }

    return (
       <div className="row justify-content-center mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-ms-12 col-12">
                <button  onClick={()=>{setModoEdicion(false); resetFormulario()}}type="button" className="btn btn-success px-5 mb-3" data-toggle="modal" data-target="#exampleModal">Add
                </button>

                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            {
                                modoEdicion ? 
                                (<h5 className="modal-title" id="exampleModalLabel">Actualizar registro</h5>)
                                :
                                (<h5 className="modal-title" id="exampleModalLabel">Registro agenda</h5>)
                            }
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        <form onSubmit={ modoEdicion === true ? setUpdate : setRegistro}>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Ingrese nombre y apellido</label>
                                <input value={nombre} onChange={(e)=>{setNombre(e.target.value)}} type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Ingrese nombre y apellido"/>
                               
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Ingrese telefono</label>
                                <input value={telefono} onChange={(e)=>{setTelefono(e.target.value)}} type="text" class="form-control" id="exampleInputPassword1" placeholder="Ingrese telefono"/>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Ingrese Direccion</label>
                                <input value={direccion} onChange={(e)=>{setDireccion(e.target.value)}} type="text" class="form-control" id="exampleInputPassword1" placeholder="Ingrese direccion"/>
                            </div>
                    
                             <div class="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" aria-label="Close" >Cerrar</button>
                                {
                                    modoEdicion === true?
                                    (
                                        <button id="modal" keyboard="" type="submit" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Editar</button>
                                    )
                                    :
                                    (
                                        <button type="submit" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Registrar</button>
                                    )
                                }
                            </div>
                        </form>
                        
                        </div>
                        </div>
                </div>
            </div>

            <h3 className="text-center text-dark bg-light p-2">Registros</h3>
                {
                        error ? (<div><p className="alert alert-danger" role="alert">{error}</p></div>) : (<span></span>)
                        
                }
                <table className="table border border-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Telefono</th>
                            <th scope="col">Direccion</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                            {
                                    registros.length === 0 ? 
                                    (
                                        <span className="text-info p-3 d-flex w-100 text-center justify-content-center align-items-center">La agenda no presenta registros</span>
                                    ) 
                                    : 
                                    (registros.map(item=>
                                        (
                                            <tr>
                                                <td>{item.nombre}</td>
                                                <td>{item.telefono}</td>
                                                <td>{item.direccion}</td>
                                            
                                                <td>
                                                    
                                                        <button onClick={(id)=>{deleteRegistro(item.id)}} className="btn btn-danger mr-2">Eliminar</button>
                                                        <button onClick={(id)=>{actualizarRegistro(item.id)}} className="btn btn-warning" data-toggle="modal" data-target="#exampleModal">Editar</button>
                                                    
                                                </td>
                                               
                                                
                                            </tr>
                                       
                                        )))
                                    
                            }
                    </tbody>
                    </table>
            </div>
       </div>
    )
}

export default Formulario;