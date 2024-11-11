// Elimina esta línea
// const productos = [ ... ];

let carrito = [];
let usuarioActual = null;
let productos = [];

function renderizarProductos() {
    return fetch('PHP/obtener_productos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Almacenar los productos en la variable global
                productos = data.productos;
                const contenido = document.getElementById('contenido');
                contenido.innerHTML = `
                    <h2>Productos</h2>
                    <div class="row">
                        ${productos.map(producto => `
                            <div class="col-md-4 mb-3">
                                <div class="card">
                                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                                    <div class="card-body">
                                        <h5 class="card-title">${producto.nombre}</h5>
                                        <p class="card-text">${producto.descripcion}</p>
                                        <p class="card-text">Precio: $${producto.precio}</p>
                                        <p class="card-text">Stock: ${producto.stock}</p>
                                        <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                if (usuarioActual && usuarioActual.es_admin) {
                    contenido.innerHTML += `
                        <button class="btn btn-success mt-3" onclick="mostrarFormularioNuevoProducto()">Agregar nuevo producto</button>
                    `;
                }
            } else {
                alert('Error al obtener los productos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al obtener los productos');
        });
}

// Actualiza la función agregarAlCarrito para usar los datos del producto directamente
function agregarAlCarrito(productoId) {
    // Suponemos que tenemos una función que obtiene el producto por su ID
    const producto = obtenerProductoPorId(productoId);
    
    if (producto) {
        const itemExistente = carrito.find(item => item.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        actualizarCarritoEnLocalStorage();
        alert('Producto agregado al carrito');
        renderizarCarrito();
    } else {
        alert('Error al agregar el producto al carrito');
    }
}

// Función auxiliar para obtener un producto por su ID
function obtenerProductoPorId(id) {
    return productos.find(p => p.id === id);
}

// Funciones de renderizado
function renderizarCarrito() {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h2>Carrito de Compras</h2>
        ${carrito.length === 0 ? '<p>El carrito está vacío</p>' : `
            <ul class="list-group">
                ${carrito.map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item.nombre} - $${item.precio} x ${item.cantidad}
                        <span>
                            <button class="btn btn-sm btn-primary" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                            <button class="btn btn-sm btn-primary" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        </span>
                    </li>
                `).join('')}
            </ul>
            <p class="mt-3">Total: $${calcularTotal()}</p>
            <button class="btn btn-success" onclick="realizarCompra()">Finalizar Compra</button>
        `}
    `;
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.id !== id);
        }
        actualizarCarritoEnLocalStorage();
        renderizarCarrito();
    }
}

function renderizarRegistro() {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h2>Registrarse</h2>
        <form onsubmit="registrarse(event)">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Registrarse</button>
        </form>
    `;
}

// Funciones de lógica
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarritoEnLocalStorage();
    renderizarCarrito();
}

function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
}

function realizarCompra() {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para realizar una compra');
        return;
    }

    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const compra = {
        usuario_id: usuarioActual.id,
        productos: carrito.map(item => ({
            id: item.id,
            cantidad: item.cantidad,
            precio: parseFloat(item.precio)
        }))
    };

    fetch('PHP/procesar_compra.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Compra realizada con éxito');
            carrito = [];
            actualizarCarritoEnLocalStorage();
            mostrarComprasUsuario();
        } else {
            alert('Error al realizar la compra: ' + data.mensaje);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al realizar la compra');
    });
}

function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('PHP/autenticacion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            usuarioActual = {
                id: data.usuario.id,
                email: data.usuario.email,
                nombre: data.usuario.nombre,
                es_admin: data.usuario.es_admin
            };
            localStorage.setItem('usuario', JSON.stringify(usuarioActual));
            alert('Sesión iniciada');
            renderizarProductos();
        } else {
            alert(data.mensaje);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    });
}

document.getElementById('login-link').addEventListener('click', renderizarLogin);

function renderizarLogin() {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <form id="login-form">
            <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
        </form>
    `;
    document.getElementById('login-form').addEventListener('submit', iniciarSesion);
}

function registrarse(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('PHP/agregar_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.mensaje);
            renderizarLogin();
        } else {
            alert(data.mensaje);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar usuario');
    });
}

function actualizarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Event listeners
document.getElementById('productos-link').addEventListener('click', renderizarProductos);
document.getElementById('carrito-link').addEventListener('click', renderizarCarrito);
document.getElementById('login-link').addEventListener('click', renderizarLogin);
document.getElementById('registro-link').addEventListener('click', renderizarRegistro);

// Inicialización
function init() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
        usuarioActual = JSON.parse(usuarioGuardado);
    }
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    renderizarProductos();
}

// Asegúrate de llamar a init() cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    init();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        document.getElementById('login-link').classList.add('d-none');
        document.getElementById('logout-item').classList.remove('d-none');
    }

    document.getElementById('logout-link').addEventListener('click', function() {
        localStorage.removeItem('usuario');
        window.location.href = 'index.php';
    });
});

function agregarNuevoProducto(event) {
    event.preventDefault();
    const nuevoProducto = {
        id: productos.length + 1,
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        imagen: document.getElementById('imagen').value
    };
    productos.push(nuevoProducto);
    alert('Producto agregado con éxito');
    renderizarProductos();
}

function mostrarComprasUsuario() {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para ver tus compras');
        return;
    }

    fetch(`PHP/ver_compras_usuario.php?usuario_id=${usuarioActual.id}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data);
            const contenido = document.getElementById('contenido');
            contenido.innerHTML = `
                <h2>Mis Compras</h2>
                ${data.compras.length === 0 ? '<p>No tienes compras realizadas.</p>' : 
                    data.compras.map(compra => `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Producto: ${compra.nombre_producto}</h5>
                                <p class="card-text">Cantidad: ${compra.cantidad}</p>
                                <p class="card-text">Precio unitario: $${compra.precio_unitario}</p>
                                <p class="card-text">Usuario: ${compra.nombre_usuario} </p>
                            </div>
                        </div>
                    `).join('')
                }
            `;
        } else {
            alert('Error al obtener las compras: ' + data.mensaje);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al obtener las compras');
    });
}

// Agregar nuevo event listener
document.getElementById('mis-compras-link').addEventListener('click', mostrarComprasUsuario);
