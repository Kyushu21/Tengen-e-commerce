<?php
header('Content-Type: application/json');
require_once 'conexion.php';

function agregarVenta($venta) {
    $db = new Conexion();
    $conn = $db->conectar();

    try {
        $conn->beginTransaction();

        $sql = "INSERT INTO DetalleVenta2 (Id_Usuario, producto_Id, cantidad, precio_unitario) 
                VALUES (:Id_Usuario, :producto_Id, :cantidad, :precio_unitario)";
        
        $stmt = $conn->prepare($sql);

        foreach ($venta['productos'] as $producto) {
            $stmt->execute([
                ':Id_Usuario' => $venta['Id_Usuario'],
                ':producto_Id' => $producto['id'],
                ':cantidad' => $producto['cantidad'],
                ':precio_unitario' => $producto['precio']
            ]);
        }

        $conn->commit();
        return ['success' => true, 'mensaje' => 'Venta registrada con éxito'];
    } catch (Exception $e) {
        $conn->rollBack();
        return ['success' => false, 'mensaje' => 'Error al registrar la venta: ' . $e->getMessage()];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $venta = json_decode($json, true);

    if (!isset($venta['Id_Usuario']) || !isset($venta['productos']) || empty($venta['productos'])) {
        echo json_encode(['success' => false, 'mensaje' => 'Datos de venta inválidos']);
        exit;
    }

    $resultado = agregarVenta($venta);
    echo json_encode(['success' => true, 'mensaje' => 'Método no permitido xd']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
}

