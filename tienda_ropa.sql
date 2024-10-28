-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-10-2024 a las 18:27:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda_ropa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalleventa`
--

CREATE TABLE `detalleventa` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalleventa2`
--

CREATE TABLE `detalleventa2` (
  `Id` int(11) NOT NULL,
  `Id_Usuario` int(11) NOT NULL,
  `producto_Id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalleventa2`
--

INSERT INTO `detalleventa2` (`Id`, `Id_Usuario`, `producto_Id`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 3, 2, 79.99),
(2, 1, 2, 4, 49.99),
(3, 1, 3, 2, 79.99),
(4, 3, 1, 1, 19.99),
(5, 3, 2, 3, 49.99),
(6, 3, 1, 3, 19.99),
(7, 3, 2, 1, 49.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `imagen`) VALUES
(1, 'Camiseta Básica', 'Camiseta de algodón 100%, disponible en varios colores', 19.99, 100, 'https://yazbek.com.mx/cdn/shop/products/C0605-camisa-oxford-liso-ml-caballero-75algodon-25poliester-cobalto_1.jpg?v=1693281109'),
(2, 'Pantalón Vaquero', 'Pantalón vaquero clásico, corte recto', 49.99, 50, 'https://veryvaquero.com/cdn/shop/products/VV-pantalon-mezclilla-w17-wrinkler-stone-2.jpg?v=1701190969'),
(3, 'Zapatillas Deportivas', 'Zapatillas ligeras ideales para correr', 79.99, 30, 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/e5dddbebf418f453c4aa298cc4c20d96.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp'),
(4, 'Chaqueta de Cuero', 'Chaqueta de cuero genuino, estilo motero', 199.99, 20, 'https://m.media-amazon.com/images/I/41CmfJKX5LL._AC_.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `es_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `es_admin`) VALUES
(1, 'Admin', 'admin@example.com', 'contraseña_segura_hash', 1),
(2, 'kyushu', 'owen@hotmail.com', '$2y$10$C6ZLKaJabuPFc7IvoXz6TedG0pFaN6hfPTNCtu0XhFsjlmtBGc7c2', 0),
(3, 'luisillo', 'luisillo77@hotmail.com', '$2y$10$eMiyw7L9dQuz7o3zR4zSNuTyLn33ps3hNNCaJMnpZl4x7tylxSyPG', 0),
(4, 'kyushu', 'owenxd@hotmail.com', '$2y$10$vYu4FWtDxgfKOmvdmBTLNeUcqEFnWAVrYOSZFwfMI9i91bsz1j1mS', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `usuario_id`, `fecha`, `total`) VALUES
(1, 1, '2024-10-23 12:29:05', 359.94),
(2, 1, '2024-10-23 12:52:12', 159.98),
(3, 3, '2024-10-23 12:52:23', 19.99),
(4, 3, '2024-10-23 13:06:10', 149.97),
(5, 3, '2024-10-23 13:42:41', 59.97),
(6, 3, '2024-10-23 13:55:19', 49.99);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalleventa`
--
ALTER TABLE `detalleventa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `detalleventa2`
--
ALTER TABLE `detalleventa2`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id_Usuario` (`Id_Usuario`),
  ADD KEY `producto_Id` (`producto_Id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalleventa`
--
ALTER TABLE `detalleventa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalleventa2`
--
ALTER TABLE `detalleventa2`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalleventa`
--
ALTER TABLE `detalleventa`
  ADD CONSTRAINT `detalleventa_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`),
  ADD CONSTRAINT `detalleventa_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `detalleventa2`
--
ALTER TABLE `detalleventa2`
  ADD CONSTRAINT `detalleventa2_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `detalleventa2_ibfk_2` FOREIGN KEY (`producto_Id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
