import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        return handle401Error(clonedReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();
    const token = authService.getAccessToken();

    if (refreshToken && token) {
      return authService.refreshToken(token, refreshToken).pipe(
        switchMap((res: any) => {
          isRefreshing = false;
          refreshTokenSubject.next(res.accessToken);
          return next(request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + res.accessToken)
          }));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          return throwError(() => err);
        })
      );
    }
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => {
      return next(request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      }));
    })
  );
}
