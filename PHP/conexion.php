<?php
class Conexion {
    private $host = 'localhost';
    private $db_name = 'tienda_ropa';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function conectar() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                'mysql:host=' . $this->host . ';dbname=' . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo 'Error de conexión: ' . $e->getMessage();
        }

        return $this->conn;
    }
    public function obtenerTodos($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function insertar($tabla, $datos) {
        $campos = implode(', ', array_keys($datos));
        $valores = ':' . implode(', :', array_keys($datos));
        $sql = "INSERT INTO $tabla ($campos) VALUES ($valores)";
        $stmt = $this->conn->prepare($sql);
        foreach ($datos as $campo => $valor) {
            $stmt->bindValue(":$campo", $valor);
        }
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    public function obtenerUno($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}