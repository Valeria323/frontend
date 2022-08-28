import axios from 'axios';

export class EquipoService {    
    getProductos (){
        return axios.get('http://localhost:9090/api/v1.0/producto').then(res => res.data.result);
    }
    postProductos (product){
        return axios.post('http://localhost:9090/api/v1.0/producto',product)
    }
    putProductos (produc){
        return axios.put('http://localhost:9090/api/v1.0/producto',produc)
    }
    deleteProductos (id){
        return axios.delete('http://localhost:9090/api/v1.0/producto/' +id)
    }
}