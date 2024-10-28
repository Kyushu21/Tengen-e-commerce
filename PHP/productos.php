<?php
require_once 'conexion.php';

function obtenerProductos() {
    $db = new Conexion();
    $conn = $db->conectar();

    $sql = "SELECT * FROM Productos";
    return $db->obtenerTodos($sql);
}

function agregarProducto($nombre, $descripcion, $precio, $stock, $imagen) {
    $db = new Conexion();
    $conn = $db->conectar();

    $datos = [
        'nombre' => $nombre,
        'descripcion' => $descripcion,
        'precio' => $precio,
        'stock' => $stock,
        'imagen' => $imagen
    ];

    return $db->insertar('Productos', $datos);
}

// Ejemplo de uso:
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $productos = obtenerProductos();
    echo json_encode($productos);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Asegúrate de validar y sanitizar los datos de entrada
    $nombre = $_POST['nombre'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $precio = $_POST['precio'] ?? 0;
    $stock = $_POST['stock'] ?? 0;
    $imagen = $_POST['imagen'] ?? '';

    $id = agregarProducto($nombre, $descripcion, $precio, $stock, $imagen);
    if ($id) {
        echo json_encode(['success' => true, 'id' => $id, 'mensaje' => 'Producto agregado con éxito']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al agregar el producto']);
    }
}