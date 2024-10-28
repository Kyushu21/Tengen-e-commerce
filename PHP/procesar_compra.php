<?php
header('Content-Type: application/json');
require_once 'conexion.php';

function procesarCompra($compra) {
    $db = new Conexion();
    $conn = $db->conectar();

    try {
        $conn->beginTransaction();

        // Insertar la venta
        $total = array_reduce($compra['productos'], function($sum, $item) {
            return $sum + ($item['precio'] * $item['cantidad']);
        }, 0);

        $sql = "INSERT INTO Ventas (usuario_id, total) VALUES (:usuario_id, :total)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':usuario_id' => $compra['usuario_id'], ':total' => $total]);
        $venta_id = $conn->lastInsertId();

        // Insertar los detalles de la venta
        $sql = "INSERT INTO DetalleVenta2 (Id_Usuario, producto_Id, cantidad, precio_unitario) VALUES (:Id_Usuario, :producto_Id, :cantidad, :precio_unitario)";
        $stmt = $conn->prepare($sql);

        foreach ($compra['productos'] as $producto) {
            $stmt->execute([
                ':Id_Usuario' => $compra['usuario_id'],
                ':producto_Id' => $producto['id'],
                ':cantidad' => $producto['cantidad'],
                ':precio_unitario' => $producto['precio']
            ]);
        }

        $conn->commit();
        return ['success' => true, 'mensaje' => 'Compra procesada con éxito'];
    } catch (Exception $e) {
        $conn->rollBack();
        return ['success' => false, 'mensaje' => 'Error al procesar la compra: ' . $e->getMessage()];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $compra = json_decode($json, true);

    if (!isset($compra['usuario_id']) || !isset($compra['productos']) || empty($compra['productos'])) {
        echo json_encode(['success' => false, 'mensaje' => 'Datos de compra inválidos']);
        exit;
    }

    $resultado = procesarCompra($compra);
    echo json_encode($resultado);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
}

