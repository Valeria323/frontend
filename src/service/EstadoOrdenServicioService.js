import axios from 'axios';

export class ProductoService {    
    getEstadoOrdenServicio (){
        return axios.get('http://localhost:9090/api/v1.0/estadoordenservicio').then(res => res.data.result);
    }
    postEstadoOrdenServicio (estadoordenservici){
        return axios.post('http://localhost:9090/api/v1.0/estadoordenservicio',estadoordenservici)
    }
    puteEstadoOrdenServicio (estadoordenservic){
        return axios.put('http://localhost:9090/api/v1.0/estadoordenservicio',estadoordenservic)
    }
    deleteEstadoOrdenServicio (id){
        return axios.delete('http://localhost:9090/api/v1.0/estadoordenservicio/' +id)
    }
}