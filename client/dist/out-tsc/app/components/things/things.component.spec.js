import { async, TestBed } from '@angular/core/testing';
import { ThingsComponent } from './things.component';
describe('ThingsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ThingsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ThingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/luigiventi/Projects/node-boilerplate/node-boilerplate/client/src/app/components/things/things.component.spec.js.map