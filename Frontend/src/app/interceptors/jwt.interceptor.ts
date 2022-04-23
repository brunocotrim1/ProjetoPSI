import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }
  apiURL: string = "/api";
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user = this.authenticationService.loadUser();
    const isLoggedIn = user && user.accessToken;
    const isApiUrl = request.url.startsWith(this.apiURL);
    if (request.url.includes("/login"))
      return next.handle(request);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${user.accessToken}` }
      });
    }

    return next.handle(request);
  }
}
