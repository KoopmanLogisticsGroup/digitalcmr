var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ThingService } from '../../services/thing.service';
export var ThingsComponent = (function () {
    function ThingsComponent(_thingsService) {
        this._thingsService = _thingsService;
    }
    ThingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._thingsService.getThingsByUser().subscribe(function (things) {
            console.log(things);
            _this.things = things;
        });
    };
    ThingsComponent = __decorate([
        Component({
            selector: 'app-things',
            templateUrl: './things.component.html',
            styleUrls: ['./things.component.css']
        }), 
        __metadata('design:paramtypes', [ThingService])
    ], ThingsComponent);
    return ThingsComponent;
}());
//# sourceMappingURL=/Users/luigiventi/Projects/node-boilerplate/node-boilerplate/client/src/app/components/things/things.component.js.map