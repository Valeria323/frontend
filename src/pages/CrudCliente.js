import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../service/ProductService";
import { ClienteService as ClienteService } from "../service/ClienteService"

const CrudCliente = () => {
    let emptyCliente = {
        id: null,
        nombres: "",
        apellidos: "",
        dni: "",
        direccion: "",
        telefono: "",
        celular: "",
        email: "",
        estado: "",
    };

    const [clientes, setClientes] = useState(null);
    const [clienteDialog, setClienteDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [cliente, setCliente] = useState(emptyCliente
);
    const [selectedClientes, setSelectedClientes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const clienteService = new ClienteService();
        clienteService.getClientes().then((data) => setClientes(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setCliente(emptyCliente
    );
        setSubmitted(false);
        setClienteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setClienteDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (cliente.nombre.trim()) {
            let _products = [...clientes];
            let _product = { ...cliente };
            if (cliente.id) {
                const index = findIndexById(cliente.id);

                _products[index] = _product;

                const provserv = new ClienteService();
                provserv.putClientes(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Cliente actualizada",
                    life: 3000,
                });
            } else {
                const provserv = new ClienteService();
                provserv.postClientes(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Cliente creada",
                    life: 3000,
                });
            }

            setClientes(_products);
            setClienteDialog(false);
            setCliente(emptyCliente
        );
        }
    };

    const editProduct = (product) => {
        setCliente({ ...product });
        setClienteDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setCliente(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = clientes.filter((val) => val.id !== cliente.id);
        setClientes(_products);
        setDeleteProductDialog(false);
        setCliente(emptyCliente
    );
        const provserv = new ClienteService();
        provserv.deleteClientes(cliente.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "cliente eliminada",
            life: 3000,
        });
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

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = clientes.filter((val) => !selectedClientes.includes(val));
        setClientes(_products);
        setDeleteProductsDialog(false);
        setSelectedClientes(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Clientes eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...cliente };
        _product["category"] = e.value;
        setCliente(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...cliente };
        _product[`${name}`] = val;

        setCliente(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...cliente };
        _product[`${nombre}`] = val;

        setCliente(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nombresBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {rowData.nombre}
            </>
        );
    };

    const apellidosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {rowData.nombre}
            </>
        );
    };

    const dniBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Dni</span>
                {rowData.nombre}
            </>
        );
    };

    const direccionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Direccion</span>
                {rowData.nombre}
            </>
        );
    };

    const telefonoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.nombre}
            </>
        );
    };

    const celularBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Celular</span>
                {rowData.nombre}
            </>
        );
    };

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.nombre}
            </>
        );
    };
    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.nombre}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Clientes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
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
                        emptyMessage="No existen provincias registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombres" header="Nombres" body={nombresBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="apellidos" header="Apellidos" body={apellidosBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="dni" header="Dni" body={dniBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="direccion" header="Direccion" body={direccionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="telefono" header="Telefono" body={telefonoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="celular" header="Celular" body={celularBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="estado" header="Estado" body={estadoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={clienteDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombres</label>
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

                        <label htmlFor="name">Apellidos</label>
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

                        <label htmlFor="name">Dni</label>
                            <InputText
                                id="dni"
                                value={cliente.dni}
                                onChange={(e) => onInputChange(e, "dni")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.dni,
                                })}
                            />

                        <label htmlFor="name">Direccion</label>
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

                        <label htmlFor="name">telefono</label>
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

                        <label htmlFor="name">Celular</label>
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

                        <label htmlFor="name">Email</label>
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
                            <label htmlFor="name">Estado</label>
                            <InputText
                                id="estado"
                                value={cliente.estado}
                                onChange={(e) => onInputChange(e, "estado")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.estado,
                                })}
                            />
                            {submitted && !cliente.nombre && <small className="p-invalid">El nombre del cliente es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {cliente && (
                                <span>
                                    Está seguro de borrar al cliente <b>{cliente.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {cliente && <span>Está seguro de borrar estos clientes?</span>}
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