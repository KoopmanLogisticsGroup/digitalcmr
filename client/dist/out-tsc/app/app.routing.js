import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/index';
import { LoginComponent } from './components/login/login.component';
import { ThingsComponent } from './components/things/things.component';
var appRoutes = [
    { path: 'login', component: LoginComponent },
    { path: 'things', component: ThingsComponent, canActivate: [AuthGuard] },
    // otherwise redirect to login
    { path: '**', redirectTo: 'login' }
];
export var appRoutingProviders = [];
export var routing = RouterModule.forRoot(appRoutes);
//# sourceMappingURL=/Users/luigiventi/Projects/node-boilerplate/node-boilerplate/client/src/app/app.routing.js.map