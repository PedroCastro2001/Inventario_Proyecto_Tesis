CREATE DATABASE IF NOT EXISTS inventario_bs;

USE inventario_bs;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `area`;
CREATE TABLE `area` (
  `cod_area` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`cod_area`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `detalle_egreso`;
CREATE TABLE `detalle_egreso` (
  `cod_detalle_egreso` int NOT NULL AUTO_INCREMENT,
  `cod_egreso` int NOT NULL,
  `cod_ingreso` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`cod_detalle_egreso`),
  KEY `fk_detalle_egreso_cod_egreso` (`cod_egreso`),
  KEY `fk_detalle_egreso_cod_ingreso` (`cod_ingreso`),
  CONSTRAINT `fk_detalle_egreso_cod_egreso` FOREIGN KEY (`cod_egreso`) REFERENCES `egreso` (`cod_egreso`) ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_egreso_cod_ingreso` FOREIGN KEY (`cod_ingreso`) REFERENCES `ingreso` (`cod_ingreso`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `egreso`;
CREATE TABLE `egreso` (
  `cod_egreso` int NOT NULL AUTO_INCREMENT,
  `cod_transaccion` int NOT NULL,
  `cod_area` int NOT NULL,
  `cod_insumo` int NOT NULL,
  `cod_presentacion` int NOT NULL,
  `cod_lote` varchar(20) NOT NULL,
  `cantidad` int NOT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `id_sesion` int DEFAULT NULL,
  PRIMARY KEY (`cod_egreso`),
  KEY `fk_cod_area` (`cod_area`),
  KEY `fk_cod_insumo2` (`cod_insumo`),
  KEY `fk_cod_presentacion2` (`cod_presentacion`),
  KEY `fk_cod_transaccion2` (`cod_transaccion`),
  KEY `fk_sesion_egreso` (`id_sesion`),
  CONSTRAINT `fk_cod_area` FOREIGN KEY (`cod_area`) REFERENCES `area` (`cod_area`),
  CONSTRAINT `fk_cod_insumo2` FOREIGN KEY (`cod_insumo`) REFERENCES `insumo` (`cod_insumo`),
  CONSTRAINT `fk_cod_presentacion2` FOREIGN KEY (`cod_presentacion`) REFERENCES `presentacion` (`cod_presentacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_cod_transaccion2` FOREIGN KEY (`cod_transaccion`) REFERENCES `transaccion` (`cod_transaccion`) ON DELETE CASCADE,
  CONSTRAINT `fk_sesion_egreso` FOREIGN KEY (`id_sesion`) REFERENCES `sesion` (`id_sesion`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ingreso`;
CREATE TABLE `ingreso` (
  `cod_ingreso` int NOT NULL AUTO_INCREMENT,
  `cod_transaccion` int NOT NULL,
  `no_requisicion` varchar(50) NOT NULL,
  `stock` varchar(255) DEFAULT 'Principal',
  `cod_insumo` int NOT NULL,
  `cod_presentacion` int NOT NULL,
  `cod_lote` varchar(20) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `cantidad_ingresada` int NOT NULL,
  `cantidad_solicitada` int NOT NULL,
  `demanda_insatisfecha` int NOT NULL,
  `observaciones` varchar(500) NOT NULL,
  `id_sesion` int DEFAULT NULL,
  PRIMARY KEY (`cod_ingreso`),
  KEY `fk_cod_insumo` (`cod_insumo`),
  KEY `fk_cod_transaccion` (`cod_transaccion`),
  KEY `fk_cod_presentacion` (`cod_presentacion`),
  KEY `fk_sesion_ingreso` (`id_sesion`),
  CONSTRAINT `fk_cod_insumo` FOREIGN KEY (`cod_insumo`) REFERENCES `insumo` (`cod_insumo`) ON DELETE CASCADE,
  CONSTRAINT `fk_cod_presentacion` FOREIGN KEY (`cod_presentacion`) REFERENCES `presentacion` (`cod_presentacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_cod_transaccion` FOREIGN KEY (`cod_transaccion`) REFERENCES `transaccion` (`cod_transaccion`) ON DELETE CASCADE,
  CONSTRAINT `fk_sesion_ingreso` FOREIGN KEY (`id_sesion`) REFERENCES `sesion` (`id_sesion`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `insumo`;
CREATE TABLE `insumo` (
  `cod_insumo` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `cant_min` int DEFAULT NULL,
  `cant_max` int DEFAULT NULL,
  PRIMARY KEY (`cod_insumo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `presentacion`;
CREATE TABLE `presentacion` (
  `cod_presentacion` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cod_insumo` int NOT NULL,
  `fecha_creacion` date NOT NULL,
  `forma_despacho` int DEFAULT NULL,
  PRIMARY KEY (`cod_presentacion`),
  UNIQUE KEY `cod_insumo` (`cod_insumo`,`nombre`),
  CONSTRAINT `fk_presentacion_insumo` FOREIGN KEY (`cod_insumo`) REFERENCES `insumo` (`cod_insumo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `sesion`;
CREATE TABLE `sesion` (
  `id_sesion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre_real` varchar(100) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_sesion`),
  KEY `fk_usuario_sesion` (`id_usuario`),
  CONSTRAINT `fk_usuario_sesion` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `transaccion`;
CREATE TABLE `transaccion` (
  `cod_transaccion` int NOT NULL AUTO_INCREMENT,
  `tipo_transaccion` enum('Ingreso','Egreso') NOT NULL,
  `fecha` datetime NOT NULL,
  `realizado_por` varchar(50) NOT NULL,
  PRIMARY KEY (`cod_transaccion`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('Administrador','Invitado') NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `nombre_completo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;