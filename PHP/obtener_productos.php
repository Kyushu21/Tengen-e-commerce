<?php

header('Content-Type: application/json');
require_once 'conexion.php';

function obtenerProductos() {
    $db = new Conexion();
    $conn = $db->conectar();

    $sql = "SELECT * FROM Productos";
    return $db->obtenerTodos($sql);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $productos = obtenerProductos();
        echo json_encode(['success' => true, 'productos' => $productos]);
    } catch (Exception $e) {
        \Sentry\captureException($e);
        echo json_encode(['success' => false, 'mensaje' => 'Error al obtener los productos']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
}