import axios from 'axios';

export class EquipoService {    
    getEquipos (){
        return axios.get('http://localhost:9090/api/v1.0/producto/').then(res => res.data.result);
    }
    postEquipos (produc){
        return axios.post('http://localhost:9090/api/v1.0/producto/',produc);
    }
    putEquipos (prod){
        return axios.put('http://localhost:9090/api/v1.0/producto/',prod);
    }
    deleteEquipos (id){
        return axios.delete('http://localhost:9090/api/v1.0/producto/'+id);
    }
}