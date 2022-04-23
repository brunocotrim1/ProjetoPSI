import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status) && this.authenticationService.loadUser() !== null) {
        // auto logout if 401 or 403 response returned from api
        this.authenticationService.logout();
      }

      const error = (err && err.error && err.error.message) || err.statusText;
      if (err.error.err)
        return throwError(err.error.err);

      return throwError(err.statusText);
    }))
  }
}
