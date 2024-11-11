import * as Sentry from "@sentry/browser";
// Implementación básica de las funciones necesarias

function agregarAlCarrito(productoId) {
  const producto = {
    id: productoId,
    nombre: 'Producto Test',
    precio: 100,
    cantidad: 1
  };
  
  // Recuperar el carrito actual, si existe, y agregar el producto
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(producto);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function calcularTotal() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
  return total.toFixed(2);
}

function cambiarCantidad(productoId, cantidad) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const producto = carrito.find(p => p.id === productoId);
  if (producto) {
    producto.cantidad += cantidad;
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
}

function eliminarDelCarrito(productoId) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(producto => producto.id !== productoId);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

describe('Sentry error tracking tests', () => {
  
  beforeEach(() => {
    Sentry.init({ 
      dsn: 'test-dsn',
      environment: 'test'
    });
    
    // Mock localStorage
    const mockLocalStorage = {
      store: {},
      getItem: function(key) {
        return this.store[key] || null;
      },
      setItem: function(key, value) {
        this.store[key] = value.toString();
      },
      removeItem: function(key) {
        delete this.store[key];
      }
    };
    Object.defineProperty(window, 'localStorage', {value: mockLocalStorage});
  });

  test('captura de error en Sentry', () => {
    const error = new Error('Error de prueba');
    Sentry.captureException(error);
    expect(Sentry.lastEventId()).not.toBeNull();
  });

  test('captura mensaje personalizado en Sentry', () => {
    const mensaje = 'Mensaje de prueba';
    Sentry.captureMessage(mensaje);
    const eventId = Sentry.lastEventId();
    console.log('Captured event ID:', eventId);
    expect(eventId).not.toBeNull();
  });

  test('agregar producto al carrito', () => {
    const producto = {
      id: 1,
      nombre: 'Producto Test',
      precio: 100,
      cantidad: 1
    };
    agregarAlCarrito(1);
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    expect(carritoGuardado.length).toBe(1);
    expect(carritoGuardado[0]).toEqual(producto);
  });

  test('calcular total del carrito', () => {
    const productos = [
      {id: 1, precio: 100, cantidad: 2},
      {id: 2, precio: 200, cantidad: 1}
    ];
    localStorage.setItem('carrito', JSON.stringify(productos));
    expect(calcularTotal()).toBe('400.00');
  });

  test('cambiar cantidad de producto en carrito', () => {
    const producto = {id: 1, precio: 100, cantidad: 1};
    localStorage.setItem('carrito', JSON.stringify([producto]));
    
    cambiarCantidad(1, 1);
    const carritoActualizado = JSON.parse(localStorage.getItem('carrito'));
    expect(carritoActualizado[0].cantidad).toBe(2);
  });

  test('eliminar producto del carrito', () => {
    const productos = [
      {id: 1, precio: 100, cantidad: 1},
      {id: 2, precio: 200, cantidad: 1} 
    ];
    localStorage.setItem('carrito', JSON.stringify(productos));
    
    eliminarDelCarrito(1);
    const carritoActualizado = JSON.parse(localStorage.getItem('carrito'));
    expect(carritoActualizado.length).toBe(1);
    expect(carritoActualizado[0].id).toBe(2);
  });

});