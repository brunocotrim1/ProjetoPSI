import { AuthenticationService } from '../services/authentication.service';
export function AppInitializer(authenticationService: AuthenticationService) {
    return () => new Promise<void>(resolve => {
        console.log("APP INITIALIZER");
        authenticationService.refreshToken()
            .subscribe()
            .add(() => resolve());
    });
}