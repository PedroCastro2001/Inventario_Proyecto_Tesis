import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Leer token desde localStorage
  const token = localStorage.getItem('token');

  // Si hay token, clonar la request y agregar encabezado Authorization
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  // Si no hay token, continúa normalmente
  return next(req);
};