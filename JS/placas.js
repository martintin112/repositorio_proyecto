// CODIGO JS SECCION PLACAS DE VIDEO
// VARIABLES SECCION PLACAS DE VIDEO
const cardPlacas = document.querySelector("#contenedorPlacas")
const cardTemplate=document.querySelector("#cardTemplate").content
const totalProductos=document.querySelector("#totalProductos")
const carritoTemplate=document.querySelector("#carritoTemplate").content
const footerCarrito=document.querySelector("#footerCarrito")
const footerCarritoTemplate=document.querySelector("#footerCarritoTemplate").content
const cardOtrosProd = document.querySelector("#contenedorOtrosProd")
const fragment = document.createDocumentFragment()
let carrito = {}


// EVENTOS
document.addEventListener('DOMContentLoaded', () => { 
    fetchPlacas()
    if(localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        renderCarrito()
    }
})
cardPlacas.addEventListener("click", e => {
    addCarrito(e)
})
totalProductos.addEventListener("click", e => {
    botonAccion(e)
})
// --------DOM--------
// CREANDO CARDS SECCION PLACAS DE VIDEO
const fetchPlacas = async () => {
    try {
        const res = await fetch("./JS/placas.json")
        const data = await res.json()
        renderPlacas(data)
    } catch (error) {
        console.log(error)
    }
}

const renderPlacas = infoPlacas => {
    infoPlacas.forEach(placas => {
        cardTemplate.querySelector("span").textContent =placas.precio
        cardTemplate.querySelector("p").textContent = placas.nombre
        cardTemplate.querySelector("img").dataset.id = placas.id
        cardTemplate.querySelector("img").setAttribute("src", placas.imagen)
        cardTemplate.querySelector("img").setAttribute("alt", placas.altImg)
        cardTemplate.querySelector("img").setAttribute("title", placas.titleImg)
        cardTemplate.querySelector(".targetBoton").dataset.id = placas.id

        const clone = cardTemplate.cloneNode(true)
        fragment.appendChild(clone)
    })
    cardPlacas.appendChild(fragment)
}

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
        fragment.appendChild(clone)
    })
    totalProductos.appendChild(fragment)
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
    fragment.appendChild(clone)
    footerCarrito.appendChild(fragment)

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

