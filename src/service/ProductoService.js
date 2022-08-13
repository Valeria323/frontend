import axios from 'axios';

export class ProductoService {    
    getProducto (){
        return axios.get('http://localhost:9090/api/v1.0/producto').then(res => res.data.result);
    }
    postProducto (produc){
        return axios.post('http://localhost:9090/api/v1.0/producto',produc)
    }
    putProducto (produ){
        return axios.put('http://localhost:9090/api/v1.0/producto',produ)
    }
    deleteProducto (id){
        return axios.delete('http://localhost:9090/api/v1.0/producto/' +id)
    }
}