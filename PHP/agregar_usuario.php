<?php
header('Content-Type: application/json');
require_once 'conexion.php';

function agregarUsuario($cliente) {
    $db = new Conexion();
    $conn = $db->conectar();

    // Verificar si el email ya existe
    $sql = "SELECT id FROM Usuarios WHERE email = :email";
    $usuario_existente = $db->obtenerUno($sql, [':email' => $cliente['email']]);

    if ($usuario_existente) {
        return ['success' => false, 'mensaje' => 'El email ya está registrado'];
    }

    // Hash de la contraseña
    $password_hash = password_hash($cliente['password'], PASSWORD_DEFAULT);

    $datos = [
        'nombre' => $cliente['nombre'],
        'email' => $cliente['email'],
        'password' => $password_hash,
        'es_admin' => false
    ];

    $id = $db->insertar('Usuarios', $datos);

    if ($id) {
        return ['success' => true, 'id' => $id, 'mensaje' => 'Usuario registrado con éxito'];
    } else {
        return ['success' => false, 'mensaje' => 'Error al registrar el usuario'];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $cliente = json_decode($json, true);

    if (!$cliente) {
        echo json_encode(['success' => false, 'mensaje' => 'Datos inválidos']);
        exit;
    }

    $resultado = agregarUsuario($cliente);
    echo json_encode($resultado);
}