import axios from 'axios';

export class ClienteService {    
    getClientes (){
        return axios.get('http://localhost:9090/api/v1.0/clientes').then(res => res.data.result);
    }
    postClientes (client){
        return axios.post('http://localhost:9090/api/v1.0/clientes',client);
    }
    putClientes (clien){
        return axios.put('http://localhost:9090/api/v1.0/clientes',clien);
    }
    deleteClientes (id){
        return axios.delete('http://localhost:9090/api/v1.0/clientes/+id');
    }
}