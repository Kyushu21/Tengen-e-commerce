<?php
use PHPUnit\Framework\TestCase;

class SentryTest extends TestCase {
    public function testCapturaDeError() {
        require_once 'PHP/sentry.php'; // Incluir la configuración de Sentry
        \Sentry\init(['dsn' => 'https://efc5bb2bf7d538c9517627d8a56c11a3@o4508277826650112.ingest.us.sentry.io/4508277831630848']); // Inicializar Sentry con tu DSN

        try {
            // Simular un error
            throw new Exception('Error de prueba para Sentry');
        } catch (Exception $e) {
            \Sentry\captureException($e);
            $this->assertTrue(true, 'El error fue capturado por Sentry');
        }
    }
}