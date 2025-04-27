CREATE DATABASE inventario_lab_bs;

DROP DATABASE inventario_lab_bs;
DROP TABLE area;
DROP TABLE insumo;
DROP TABLE presentacion;
DROP TABLE ingreso;
DROP TABLE egreso;

USE inventario_lab_bs;

CREATE TABLE area (
	cod_area INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE insumo(
    cod_insumo INT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_creacion DATE NOT NULL,
	cant_min INT,
    cant_max INT
);

CREATE TABLE presentacion(
    cod_presentacion INT PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL,
    cod_insumo INT NOT NULL,
    fecha_creacion DATE NOT NULL,
    CONSTRAINT fk_presentacion_insumo FOREIGN KEY (cod_insumo) 
        REFERENCES insumo(cod_insumo) ON DELETE CASCADE,
    UNIQUE (cod_insumo, nombre) 
);

CREATE TABLE transaccion(
	cod_transaccion INT PRIMARY KEY AUTO_INCREMENT,
    tipo_transaccion ENUM('Ingreso','Egreso') NOT NULL,
    fecha DATE NOT NULL
);

CREATE TABLE ingreso(
    cod_ingreso INT PRIMARY KEY AUTO_INCREMENT,
    cod_transaccion INT NOT NULL,
    no_requisicion INT NOT NULL,
    stock VARCHAR(255) DEFAULT 'Principal',
    cod_insumo INT NOT NULL,
    cod_presentacion INT NOT NULL,
    cod_lote VARCHAR(20) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad_ingresada INT NOT NULL,
    cantidad_solicitada INT NOT NULL,
    demanda_insatisfecha INT NOT NULL,
    observaciones VARCHAR(500) NOT NULL,
    CONSTRAINT fk_cod_insumo FOREIGN KEY (cod_insumo)
        REFERENCES insumo(cod_insumo) ON DELETE CASCADE,
    CONSTRAINT fk_cod_transaccion FOREIGN KEY (cod_transaccion)
        REFERENCES transaccion(cod_transaccion) ON DELETE CASCADE,
	CONSTRAINT fk_cod_presentacion FOREIGN KEY (cod_presentacion)
        REFERENCES presentacion(cod_presentacion) ON DELETE CASCADE
);
    
CREATE TABLE egreso (
    cod_egreso INT PRIMARY KEY AUTO_INCREMENT,
    cod_transaccion INT NOT NULL,
    cod_area INT NOT NULL,
    cod_insumo INT NOT NULL,
    cod_presentacion INT NOT NULL,
    cod_lote VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL,
    observaciones VARCHAR(500),
    CONSTRAINT fk_cod_area FOREIGN KEY (cod_area)
        REFERENCES area(cod_area),
    CONSTRAINT fk_cod_insumo2 FOREIGN KEY (cod_insumo)
        REFERENCES insumo(cod_insumo),
	CONSTRAINT fk_cod_presentacion2 FOREIGN KEY (cod_presentacion)
        REFERENCES presentacion(cod_presentacion) ON DELETE CASCADE,
    CONSTRAINT fk_cod_transaccion2 FOREIGN KEY (cod_transaccion)
        REFERENCES transaccion(cod_transaccion) ON DELETE CASCADE
);