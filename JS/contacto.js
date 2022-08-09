const totalProductos=document.querySelector("#totalProductos")
const carritoTemplate=document.querySelector("#carritoTemplate").content
const footerCarrito=document.querySelector("#footerCarrito")
const footerCarritoTemplate=document.querySelector("#footerCarritoTemplate").content
const fragmentContacto = document.createDocumentFragment()
let carrito = {}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => { 
    if(localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        renderCarrito()
    }
})
totalProductos.addEventListener("click", e => {
    botonAccion(e)
})

// SECCION AGREGAR CARRITO
const addCarrito = e => {
    if(e.target.classList.contains("targetBoton")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        // imagen: objeto.querySelector("img"),
        id: objeto.querySelector(".targetBoton").dataset.id,
        nombre: objeto.querySelector("p").textContent,
        precio: objeto.querySelector("span").textContent,
        cantidad: 1,
        
    }
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    renderCarrito()
}

const renderCarrito = () => {
    console.log(carrito)
    totalProductos.innerHTML=""
    Object.values(carrito).forEach(producto => {
        // carritoTemplate.querySelector("img").src = producto.imagen
        carritoTemplate.querySelectorAll("span")[0].textContent = producto.precio
        carritoTemplate.querySelector("p").textContent = producto.nombre
        carritoTemplate.querySelector("b").textContent = `Cantidad: ${producto.cantidad}`
        carritoTemplate.querySelectorAll("span")[1].textContent = producto.precio * producto.cantidad

        // botones suma y resta
        carritoTemplate.querySelector(".btn-info").dataset.id = producto.id
        carritoTemplate.querySelector(".btn-danger").dataset.id = producto.id

        const clone = carritoTemplate.cloneNode(true)
        fragmentContacto.appendChild(clone)
    })
    totalProductos.appendChild(fragmentContacto)
    renderFooterCarrito()

    // Guardar en LocalStorage
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

// SECCION FOOTER DEL CARRITO
const renderFooterCarrito = () => {
    footerCarrito.innerHTML=""
    if(Object.keys(carrito).lenght === 0) {
        footerCarrito.innerHTML = `
        <p>Carrito Vacio</p>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad , 0 )
    const nPrecio = Object.values(carrito).reduce ((acc, {cantidad, precio}) => acc + cantidad*precio,0 )

    footerCarritoTemplate.querySelector("span").textContent = nCantidad
    footerCarritoTemplate.querySelector("b").textContent = nPrecio

    const clone = footerCarritoTemplate.cloneNode(true)
    fragmentContacto.appendChild(clone)
    footerCarrito.appendChild(fragmentContacto)

    const botonVaciar = document.getElementById("vaciarCarrito")
    botonVaciar.addEventListener("click", () => {
        carrito = []
        renderCarrito()
        removerLocal()
    } )
}

// FUNCION REMOVER LOCALSTORAGE
const removerLocal = () => {
    localStorage.removeItem("carrito");
}

// BOTONES SUMA Y RESTA
const botonAccion = e => {
    // AUMENTAR PRODUCTOS
    if(e.target.classList.contains("btn-info")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        renderCarrito()
    }
    // DISMINUIR PRODUCTOS
    if(e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        renderCarrito()
    }
    e.stopPropagation()
}