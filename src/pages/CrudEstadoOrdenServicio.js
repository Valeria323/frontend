import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductoService as ProductoService } from "../service/EstadoOrdenServicioService";

const CrudEstadoOrdenServicio = () => {
    let emptyEstadoOrdenServicio = {
        id: "",
        estado: "",
        empresa:{
            id: null,
            ruc: "",
            nombre: "",
        }
    };

    const [estadoordenservicios, setEstadoOrdenServicios] = useState(null);
    const [estadoordenservicioDialog, setEstadoOrdenServicioDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [estadoordenservicio, setEstadoOrdenServicio] = useState(emptyEstadoOrdenServicio);
    const [selectedEstadoOrdenServicios, setSelectedEstadoOrdenServicios] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const estadoordenservicioService = new ProductoService();
        estadoordenservicioService.getEstadoOrdenServicio().then((data) => setEstadoOrdenServicios(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setEstadoOrdenServicio(emptyEstadoOrdenServicio);
        setSubmitted(false);
        setEstadoOrdenServicioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEstadoOrdenServicioDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (estadoordenservicio.nombre.trim()) {
            let _products = [...estadoordenservicios];
            let _product = { ...estadoordenservicio };
            if (estadoordenservicio.id) {
                const index = findIndexById(estadoordenservicio.id);

                _products[index] = _product;

                const provserv = new ProductoService();
                provserv.putEstadoOrdenServicios(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Estado Orden Servicio actualizada",
                    life: 3000,
                });
            } else {
                const provserv = new ProductoService();
                provserv.postEstadoOrdenServicio(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Estado Orden Servicio creada",
                    life: 3000,
                });
            }

            setEstadoOrdenServicios(_products);
            setEstadoOrdenServicioDialog(false);
            setEstadoOrdenServicio(emptyEstadoOrdenServicio);
        }
    };

    const editProduct = (product) => {
        setEstadoOrdenServicio({ ...product });
        setEstadoOrdenServicioDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setEstadoOrdenServicio(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = estadoordenservicios.filter((val) => val.id !== estadoordenservicio.id);
        setEstadoOrdenServicios(_products);
        setDeleteProductDialog(false);
        setEstadoOrdenServicio(emptyEstadoOrdenServicio);
        const provserv = new ProductoService();
        provserv.deleteEstadoOrdenServicio(estadoordenservicio.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Estado Orden Servicio eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < estadoordenservicios.length; i++) {
            if (estadoordenservicios[i].id === id) {
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
        let _products = estadoordenservicios.filter((val) => !selectedEstadoOrdenServicios.includes(val));
        setEstadoOrdenServicios(_products);
        setDeleteProductsDialog(false);
        setSelectedEstadoOrdenServicios(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Estado Orden Servicio eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...estadoordenservicio };
        _product["category"] = e.value;
        setEstadoOrdenServicio(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...estadoordenservicio };
        _product[`${name}`] = val;

        setEstadoOrdenServicio(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...estadoordenservicio };
        _product[`${nombre}`] = val;

        setEstadoOrdenServicio(_product);
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

    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.nombre}
            </>
        );
    };

    const id_empresaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id_empresa</span>
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
            <h5 className="m-0">Estado Orden Servicio</h5>
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
                        value={estadoordenservicios}
                        selection={selectedEstadoOrdenServicios}
                        onSelectionChange={(e) => setSelectedEstadoOrdenServicios(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen los Estados Ordenes de Servicio registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="estado" header="Estado" body={estadoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="id_empresa" header="Id_empresa" body={id_empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={estadoordenservicioDialog} style={{ width: "450px" }} header="EstadoOrndenServicio" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={estadoordenservicio.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !estadoordenservicio.nombre,
                                })}
                            />
                            {submitted && !estadoordenservicio.nombre && <small className="p-invalid">El nombre del Estado Orden Servicio es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {estadoordenservicio && (
                                <span>
                                    Está seguro de borrar el Estado Orden Servicio <b>{estadoordenservicio.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {estadoordenservicio && <span>Está seguro de borrar estos Estados Ordenes de Servioco?</span>}
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

export default React.memo(CrudEstadoOrdenServicio, comparisonFn);