// VARIABLES SECCION OTROS PRODUCTOS
const cardOtrosProd = document.querySelector("#contenedorOtrosProd")
const cardTemplateOtros=document.querySelector("#cardTemplateOtros").content
const totalProductos=document.querySelector("#totalProductos")
const carritoTemplate=document.querySelector("#carritoTemplate").content
const footerCarrito=document.querySelector("#footerCarrito")
const footerCarritoTemplate=document.querySelector("#footerCarritoTemplate").content
const fragmentOtrosProd = document.createDocumentFragment()
let carrito = {}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => { 
    fetchOtrosProd()
    if(localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        renderCarrito()
    }
})
cardOtrosProd.addEventListener("click", e => {
    addCarrito(e)
})
totalProductos.addEventListener("click", e => {
    botonAccion(e)
})

// --------DOM--------
// creando cards seccion RIGS MINEROS
// CREANDO CARDS SECCION RIGS MINEROS
const fetchOtrosProd = async () => {
    try {
        const res = await fetch("./JS/otrosprod.json")
        const data = await res.json()
        renderOtrosProd(data)
    } catch (error) {
        console.log(error)
    }
}

const renderOtrosProd = infoOtrosProd => {
    infoOtrosProd.forEach(otrosProd => {
        cardTemplateOtros.querySelector("span").textContent =otrosProd.precio
        cardTemplateOtros.querySelector("p").textContent = otrosProd.nombre
        cardTemplateOtros.querySelector("img").dataset.id = otrosProd.id
        cardTemplateOtros.querySelector("img").setAttribute("src", otrosProd.imagen)
        cardTemplateOtros.querySelector("img").setAttribute("alt", otrosProd.altImg)
        cardTemplateOtros.querySelector("img").setAttribute("title", otrosProd.titleImg)
        cardTemplateOtros.querySelector(".targetBoton").dataset.id = otrosProd.id

        const clone = cardTemplateOtros.cloneNode(true)
        fragmentOtrosProd.appendChild(clone)
    })
    cardOtrosProd.appendChild(fragmentOtrosProd)
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
        fragmentOtrosProd.appendChild(clone)
    })
    totalProductos.appendChild(fragmentOtrosProd)
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
    fragmentOtrosProd.appendChild(clone)
    footerCarrito.appendChild(fragmentOtrosProd)

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
