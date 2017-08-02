import { async, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
describe('LoginComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [LoginComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/luigiventi/Projects/node-boilerplate/node-boilerplate/client/src/app/components/login/login.component.spec.js.map