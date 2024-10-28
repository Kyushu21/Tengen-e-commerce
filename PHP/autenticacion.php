<?php
require_once 'conexion.php';

function autenticarUsuario($email, $password) {
    $db = new Conexion();
    $conn = $db->conectar();

    $sql = "SELECT * FROM Usuarios WHERE email = :email LIMIT 1";
    $usuario = $db->obtenerUno($sql, [':email' => $email]);

    if ($usuario && password_verify($password, $usuario['password'])) {
        // Autenticación exitosa
        unset($usuario['password']); // No devolver la contraseña
        return $usuario;
    } else {
        // Autenticación fallida
        return false;
    }
}

// Ejemplo de uso:
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $usuario = autenticarUsuario($email, $password);
    if ($usuario) {
        // Iniciar sesión y redirigir
        session_start();
        $_SESSION['usuario'] = $usuario;
        echo json_encode(['success' => true, 'mensaje' => 'Inicio de sesión exitoso']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Credenciales inválidas']);
    }
}