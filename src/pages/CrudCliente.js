import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ClienteService} from "../service/ClienteService"

const CrudCliente = () => {
    let clienteVacio = {
        id: null,
        nombres: "",
        apellidos: "",
        dni: null,
        direccion: "",
        telefono: null,
        celular: null,
        email: "",
        isActive: false,
    };

    //estados
    const [cliente, setCliente] = useState(clienteVacio);
    const [clientes, setClientes] = useState(null);

    const [clienteDialog, setClienteDialog] = useState(false);
    const [deleteClienteDialog, setDeleteClienteDialog] = useState(false);
    const [deleteClientesDialog, setDeleteClientesDialog] = useState(false);

    const [selectedClientes, setSelectedClientes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        // const provinciaService = new ProvinciaService();
        // provinciaService.getProvincias().then((data) => setProvincias(data));
        const clienteService = new ClienteService();
        clienteService.getClientes().then((data) => setClientes(data));
      }, []);

   

      const openNew = () => {
        setCliente(clienteVacio);
        setSubmitted(false);
        setClienteDialog(true);
      };
    
      const hideDialog = () => {
        setSubmitted(false);
        setClienteDialog(false);
      };
    
      const hideDeleteClienteDialog = () => {
        setDeleteClienteDialog(false);
      };
    
      const hideDeleteClientesDialog = () => {
        setDeleteClientesDialog(false);
      };
    

      const saveCliente = () => {
        setSubmitted(true);
        if (cliente.nombres.trim()) {
          let _clientes = [...clientes];
          let _cliente = { ...cliente };
          if (cliente.id) {
            const index = findIndexById(cliente.id);
    
            _clientes[index] = _cliente;
    
            const clienteServico = new ClienteService();
            clienteServico.putClientes(_cliente);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Cliente actualizado",
              life: 3000,
            });
          } else {
            const clienteServicio = new ClienteService();
            clienteServicio.postClientes(_cliente).then((response) => {
              // hacer peticion a la bdd de la nueva lista de provincias caso contrario no se muestra la nueva provincia ingresada
              clienteServicio.getClientes().then((data) => setClientes(data));
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Cliente Registrado",
                life: 3000,
              });
            });
          }
    
          setClientes(_clientes);
          setClienteDialog(false);
          setCliente(clienteVacio);
        }
      };

      const editCliente = (cliente) => {
        setCliente({ ...cliente });
        setClienteDialog(true);
      };
    
      const confirmDeleteCliente = (cliente) => {
        setCliente(cliente);
        setDeleteClienteDialog(true);
      };
    
      const deleteCliente = () => {
        let _clientes = [...clientes];
        let _cliente = { ...cliente };
        const clienteServicio = new ClienteService();
        console.log("************************");
        console.log(_cliente);
    
        clienteServicio.deleteClientes({ data: _cliente }).then((response) => {
          clienteServicio.getClientes().then((data) => setClientes(data));
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Cliente Eliminado",
            life: 3000,
          });
        });
        setClientes(_clientes);
        setDeleteClienteDialog(false);
        setCliente(clienteVacio);
      };
    
      const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < clientes.length; i++) {
          if (clientes[i].id === id) {
            index = i;
            break;
          }
        }
    
        return index;
      };
    
      const confirmDeleteSelected = () => {
        setDeleteClientesDialog(true);
      };
    
      const deleteSelectedClientes = () => {
        let _cliente = clientes.filter((val) => !selectedClientes.includes(val));
        setClientes(_cliente);
        setDeleteClientesDialog(false);
        setSelectedClientes(null);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Clientes eliminados",
          life: 3000,
        });
      };
    
      const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...cliente };
        _product[`${name}`] = val;
    
        setCliente(_product);
      };
    
      const leftToolbarTemplate = () => {
        return (
          <React.Fragment>
            <div className="my-2">
              <Button
                label="Nuevo"
                icon="pi pi-plus"
                className="p-button-success mr-2"
                onClick={openNew}
              />
            </div>
          </React.Fragment>
        );
      };

     const codeBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Code</span>
        {rowData.id}
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.nombres}
      </>
    );
  };

  const apellidosBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.apellidos}
      </>
    );
  };

  const dniBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.dni}
      </>
    );
  };

  const direccionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.direccion}
      </>
    );
  };

  const celularBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.celular}
      </>
    );
  };

  const telefonoBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.telefono}
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.email}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Image</span>
        <img
          src={`assets/demo/images/product/${rowData.image}`}
          alt={rowData.image}
          className="shadow-2"
          width="100"
        />
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editCliente(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteCliente(rowData)}
        />
      </div>
    );
  };


  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Clientes</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Busqueda..."
        />
      </span>
    </div>
  );
  const clienteDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveCliente}
      />
    </>
  );
  const deleteClienteDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteClienteDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteCliente}
      />
    </>
  );
  const deleteClientesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteClientesDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedClientes}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={clientes}
            selection={selectedClientes}
            onSelectionChange={(e) => setSelectedClientes(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            globalFilter={globalFilter}
            emptyMessage="No existen clientes registrados."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="code"
              header="Id"
              body={codeBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="nombres"
              header="Nombres"
              body={nameBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="name"
              header="Apellidos"
              body={apellidosBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="dni"
              header="Dni"
              body={dniBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="direccion"
              header="Direccion"
              body={direccionBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="celular"
              header="Celular"
              body={celularBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="telefono"
              header="Telefono"
              body={telefonoBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              body={emailBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={clienteDialog}
            style={{ width: "600px" }}
            header="Ingreso de Clientes"
            modal
            className="p-fluid"
            footer={clienteDialogFooter}
            onHide={hideDialog}
          >
            {/* Nombre y Apellido */}
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="nombres">Nombres</label>
                <InputText
                  id="nombres"
                  value={cliente.nombres}
                  onChange={(e) => onInputChange(e, "nombres")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !cliente.nombres,
                  })}
                />
                {submitted && !cliente.nombres && (
                  <small className="p-invalid">
                    Los Nombres del Cliente son Necesarios.
                  </small>
                )}
              </div>

              <div className="field col">
                <label htmlFor="apellidos">Apellidos</label>
                <InputText
                  id="apellidos"
                  value={cliente.apellidos}
                  onChange={(e) => onInputChange(e, "apellidos")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !cliente.apellidos,
                  })}
                />
                {submitted && !cliente.apellidos && (
                  <small className="p-invalid">
                    Los Apellidos del Cliente son Necesarios.
                  </small>
                )}
              </div>
            </div>

            {/* dni y direccion */}
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="dni">dni</label>
                <InputText
                  id="Dni"
                  value={cliente.dni}
                  onChange={(e) => onInputChange(e, "dni")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !cliente.dni,
                  })}
                />
                {submitted && !cliente.dni && (
                  <small className="p-invalid">
                    EL Dni del Cliente es Necesario.
                  </small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="direccion">Dirección</label>
                <InputText
                  id="direccion"
                  value={cliente.direccion}
                  onChange={(e) => onInputChange(e, "direccion")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !cliente.direccion,
                  })}
                />
                {submitted && !cliente.direccion && (
                  <small className="p-invalid">
                    La Dirección del cliente es necesario.
                  </small>
                )}
              </div>
            </div>

            {/* celualr y telefono */}
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="celular">Celular</label>
                <InputText
                  id="celular"
                  value={cliente.celular}
                  onChange={(e) => onInputChange(e, "celular")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !cliente.celular,
                  })}
                />
                {submitted && !cliente.celular && (
                  <small className="p-invalid">
                    El celular del cliente es necesario.
                  </small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="telefono">Teléfono</label>
                <InputText
                  id="telefono"
                  value={cliente.telefono}
                  onChange={(e) => onInputChange(e, "telefono")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !cliente.telefono,
                  })}
                />
                {submitted && !cliente.telefono && (
                  <small className="p-invalid">
                    El Telefono del cliente es necesario.
                  </small>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={cliente.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !cliente.email,
                })}
              />
              {submitted && !cliente.email && (
                <small className="p-invalid">
                  El Email del cliente es necesario.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteClienteDialog}
            style={{ width: "450px" }}
            header="Confirmación"
            modal
            footer={deleteClienteDialogFooter}
            onHide={hideDeleteClienteDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {cliente && (
                <span>
                  Está seguro de borrar la provincia <b>{cliente.nombre}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteClientesDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteClientesDialogFooter}
            onHide={hideDeleteClientesDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {cliente && <span>Está seguro de borrar estas provincias?</span>}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CrudCliente, comparisonFn);