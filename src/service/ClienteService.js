import axios from "axios";

export class ClienteService {
  getClientes() {
    return axios
      .get("http://localhost:9090/api/v1.0/clientes")
      .then((res) => res.data.result);
  }
  postClientes(clientes) {
    return axios.post("http://localhost:9090/api/v1.0/clientes", clientes);
  }
  putClientes(clientes) {
    return axios.put("http://localhost:9090/api/v1.0/clientes", clientes);
  }
  deleteClientes(clientes) {
    return axios.delete("http://localhost:9090/api/v1.0/clientes", clientes);
  }
}