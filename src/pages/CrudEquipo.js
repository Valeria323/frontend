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
import { EquipoService } from "../service/EquipoService"

const CrudEquipos = () => {
    let emptyEquipos = {
        id: null,
        codigo: "",
        nombre: "",
        precioventa: "",
        stockMin: "",
        stockMax: "",
        stock: "",
        controlaStock: "",
        aplicaIva: "",
        empresa: "",
    };

    const [equipos, setEquipos] = useState(null);
    const [equipoDialog, setEquipoDialog] = useState(false);
    const [deleteEquipoDialog, setDeleteEquipoDialog] = useState(false);
    const [deleteEquiposDialog, setDeleteEquiposDialog] = useState(false);
    const [equipo, setEquipo] = useState(emptyEquipos
);
    const [selectedEquipos, setSelectedEquipos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const equipoService = new EquipoService();
        equipoService.getEquipos().then((data) => setEquipos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setEquipo(emptyEquipos
    );
        setSubmitted(false);
        setEquipoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEquipoDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteEquipoDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteEquiposDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (equipo.nombre.trim()) {
            let _products = [...equipos];
            let _product = { ...equipo };
            if (equipo.id) {
                const index = findIndexById(equipo.id);

                _products[index] = _product;

                const provserv = new EquipoService();
                provserv.putEquipos(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Equipo actualizado",
                    life: 3000,
                });
            } else {
                const provserv = new EquipoService();
                provserv.postEquipos(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Equipo creado",
                    life: 3000,
                });
            }

            setEquipos(_products);
            setEquipoDialog(false);
            setEquipo(emptyEquipos
        );
        }
    };

    const editProduct = (product) => {
        setEquipo({ ...product });
        setEquipoDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setEquipo(product);
        setDeleteEquipoDialog(true);
    };

    const deleteProduct = () => {
        let _products = equipos.filter((val) => val.id !== equipo.id);
        setEquipos(_products);
        setDeleteEquipoDialog(false);
        setEquipo(emptyEquipos
    );
        const provserv = new EquipoService();
        provserv.deleteEquipos(equipo.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Equipo eliminado",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < equipos.length; i++) {
            if (equipos[i].id === id) {
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
        setDeleteEquiposDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = equipos.filter((val) => !selectedEquipos.includes(val));
        setEquipos(_products);
        setDeleteEquiposDialog(false);
        setSelectedEquipos(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Equipos eliminados",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...equipo };
        _product["category"] = e.value;
        setEquipo(_product);
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...equipo };
        _product[`${nombre}`] = val;

        setEquipo(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...equipo };
        _product[`${nombre}`] = val;

        setEquipo(_product);
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

    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.nombre}
            </>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };

    const precioVentaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Venta</span>
                {rowData.precioVenta}
            </>
        );
    };

    const stockMinBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Stock Minimo</span>
                {rowData.stockMin}
            </>
        );
    };

    const stockMaxBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Stock Maximo</span>
                {rowData.stockMax}
            </>
        );
    };

    const stockBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Stock</span>
                {rowData.stock}
            </>
        );
    };

    const controlaStockBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Controla Stock</span>
                {rowData.controlaStock}
            </>
        );
    };
    const aplicaIvaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Aplica Iva</span>
                {rowData.aplicaIva}
            </>
        );
    };

    const empresaBodyTemplate = (rowData) => {
        return(
            <>
            <span className="p-column-title">Nombre Empresa</span>
                {rowData.empresa.nombre}
            </>
        )
    }

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
            <h5 className="m-0">Equipos</h5>
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
                        value={equipos}
                        selection={selectedEquipos}
                        onSelectionChange={(e) => setSelectedEquipos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen equipos registrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="codigo" header="Codigo" body={codigoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="precioVenta" header="Precio Venta" body={precioVentaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="stockMin" header="Stock Minimo" body={stockMinBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="stockMax" header="stock Maximo" body={stockMaxBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="stock" header="Stock" body={stockBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="controlaStock" header="Controla Stock" body={controlaStockBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="aplicaIva" header="Aplica Iva" body={aplicaIvaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="empresa" header="Empresa" body={empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={equipoDialog} style={{ width: "450px" }} header="Equipo" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Codigo</label>
                            <InputText
                                id="codigo"
                                value={equipo.codigo}
                                onChange={(e) => onInputChange(e, "codigo")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.codigo,
                                })}
                            />

                        <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={equipo.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.nombre,
                                })}
                            />

                        <label htmlFor="name">Precio Venta</label>
                            <InputText
                                id="precioVenta"
                                value={equipo.precioVenta}
                                onChange={(e) => onInputChange(e, "precioVenta")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.precioVenta,
                                })}
                            />

                        <label htmlFor="name">Stock Minimo</label>
                            <InputText
                                id="stockMin"
                                value={equipo.stockMin}
                                onChange={(e) => onInputChange(e, "stockMin")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.stockMin,
                                })}
                            />

                        <label htmlFor="name">Stock Maximo</label>
                            <InputText
                                id="stockMax"
                                value={equipo.stockMax}
                                onChange={(e) => onInputChange(e, "stockMax")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.stockMax,
                                })}
                            />

                        <label htmlFor="name">Stock</label>
                            <InputText
                                id="stock"
                                value={equipo.stock}
                                onChange={(e) => onInputChange(e, "stock")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.stock,
                                })}
                            />

                        <label htmlFor="name">Controla Stock</label>
                            <InputText
                                id="controlaStock"
                                value={equipo.controlaStock}
                                onChange={(e) => onInputChange(e, "controla Stock")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.controlaStock,
                                })}
                            />
                            <label htmlFor="name">Aplica Iva</label>
                            <InputText
                                id="aplicaIva"
                                value={equipo.aplicaIva}
                                onChange={(e) => onInputChange(e, "aplicaIva")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !equipo.aplicaIva,
                                })}
                            />
                            {submitted && !equipo.nombre && <small className="p-invalid">El nombre del equipo es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEquipoDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {equipo && (
                                <span>
                                    Está seguro de borrar al equipo <b>{equipo.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEquiposDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {equipo && <span>Está seguro de borrar estos equipos?</span>}
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

export default React.memo(CrudEquipos, comparisonFn);