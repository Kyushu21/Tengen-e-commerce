<?php
header('Content-Type: application/json');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['usuario_id'])) {
        echo json_encode(['success' => false, 'mensaje' => 'ID de usuario no proporcionado']);
        exit;
    }

    $usuario_id = $_GET['usuario_id'];

    try {
        $db = new Conexion();
        $conn = $db->conectar();

        $sql = "SELECT dv.id, dv.cantidad, dv.precio_unitario,
                       u.nombre as nombre_usuario, 
                       p.nombre as nombre_producto
                FROM detalleventa2 dv
                JOIN usuarios u ON dv.id_usuario = u.id
                JOIN Productos p ON dv.producto_id = p.id
                WHERE dv.id_usuario = :usuario_id
                ORDER BY dv.id DESC";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':usuario_id', $usuario_id, PDO::PARAM_INT);
        $stmt->execute();
        $compras = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($compras) > 0) {
            echo json_encode(['success' => true, 'compras' => $compras]);
        } else {
            echo json_encode(['success' => true, 'mensaje' => 'No se encontraron compras para este usuario']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'mensaje' => 'Error al obtener las compras: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Método de solicitud no válido']);
}
