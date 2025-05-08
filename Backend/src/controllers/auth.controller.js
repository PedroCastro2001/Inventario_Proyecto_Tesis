import { pool } from "../DB/db.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
    const { full_name, username, password, rol } = req.body;

    if (!username || !password || !rol)
        return res.status(400).json({ error: 'Faltan datos' });

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.execute(
            'INSERT INTO usuario (nombre_usuario, nombre_completo, contrasena, rol) VALUES (?, ?, ?, ?)',
            [username, full_name, hashedPassword, rol]
        );

        res.status(201).json({ message: 'Usuario creado exitosamente' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ error: 'Faltan credenciales' });

    try {
        const [rows] = await pool.execute('SELECT * FROM usuario WHERE nombre_usuario = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = rows[0];

        const validPassword = await bcrypt.compare(password, user.contrasena);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        let idSesion;

        if (user.rol === 'Administrador') {
            const [result] = await pool.execute(
                'INSERT INTO sesion (id_usuario, nombre_real, fecha_inicio) VALUES (?, ?, NOW())',
                [user.id_usuario, user.nombre_completo]
            );
        
            idSesion = result.insertId;
        
        } else if (user.rol === 'Invitado') {
            const [result] = await pool.execute(
                'INSERT INTO sesion (id_usuario, fecha_inicio ) VALUES (?, NOW())',
                [user.id_usuario]
            );
        
            idSesion = result.insertId;
        }

        req.session.user = {
            id: user.id_usuario,
            username: user.nombre_usuario,
            full_name: user.rol === "Administrador" ? user.nombre_completo : null, 
            rol: user.rol,
            id_sesion: idSesion
        };
        

        res.json({
            message: 'Login exitoso',
            usuario: req.session.user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const profile = (req, res) => {
    if (req.session.user) {
        return res.status(200).json(req.session.user);
    } else {
        return res.status(401).json({ error: "No autenticado" });
    }
};

export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }

        res.clearCookie('connect.sid');  
        return res.status(200).json({ message: "Sesión cerrada correctamente" });
    });
};

export const registrarNombreInvitado = async (req, res) => {
    const { nombre_real, id_sesion } = req.body;

    console.log('Datos recibidos:', req.body); 

    if (!req.session.user || req.session.user.rol !== 'Invitado') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    try {
        if (!nombre_real || !id_sesion) {
            return res.status(400).json({ error: 'Faltan parámetros' }); 
        }

        await pool.execute(
            'UPDATE sesion SET nombre_real = ? WHERE id_sesion = ?',
            [nombre_real, id_sesion]
        );

        req.session.user.full_name = nombre_real;
        console.log(req.session); 

        res.status(200).json({ 
            message: 'Nombre real actualizado', 
            id_sesion: id_sesion 
        });

    } catch (err) {
        console.error('Error al guardar el nombre real:', err); 
        res.status(500).json({ error: 'Error al guardar el nombre real' });
    }
};

