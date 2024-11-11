<?php
require_once 'conexion.php';

function autenticarUsuario($email, $password) {
    $db = new Conexion();
    $conn = $db->conectar();
    $sql = "SELECT * FROM Usuarios WHERE email = :email LIMIT 1";
    $usuario = $db->obtenerUno($sql, [':email' => $email]);

    if ($usuario) {
        // Registro de depuración
        error_log("Usuario encontrado: " . print_r($usuario, true));

        if (password_verify($password, $usuario['password'])) {
            // Autenticación exitosa
            unset($usuario['password']); // No devolver la contraseña
            return $usuario;
        } else {
            // Registro de depuración
            error_log("Contraseña incorrecta para el usuario: " . $email);
        }
    } else {
        // Registro de depuración
        error_log("Usuario no encontrado: " . $email);
    }

    // Autenticación fallida
    return false;
}

// Ejemplo de uso:
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $usuario = autenticarUsuario($email, $password);

    if ($usuario) {
        // Iniciar sesión y redirigir
        session_start();
        $_SESSION['usuario'] = $usuario;
        echo json_encode(['success' => true, 'usuario' => $usuario, 'mensaje' => 'Inicio de sesión exitoso']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Credenciales inválidas']);
    }
}