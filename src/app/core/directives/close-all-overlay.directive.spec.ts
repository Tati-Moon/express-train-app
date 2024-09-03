import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CloseAllOverlayDirective } from './close-all-overlay.directive';

@Component({
    template: '<div appCloseAllOverlay (clickOutside)="onClickOutside()"></div>',
})
class TestComponent {
    clickOutside() {}
}

describe('CloseAllOverlayDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CloseAllOverlayDirective],
            declarations: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should emit clickOutside event when clicking outside the element', () => {
        const spy = jest.spyOn(testComponent, 'clickOutside');

        const event = new MouseEvent('click', { bubbles: true });
        document.body.dispatchEvent(event);

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    });

    it('should not emit clickOutside event when clicking inside the element', () => {
        const spy = jest.spyOn(testComponent, 'clickOutside');

        const directiveElement = fixture.debugElement.query(By.directive(CloseAllOverlayDirective)).nativeElement;

        const event = new MouseEvent('click', { bubbles: true });
        directiveElement.dispatchEvent(event);

        fixture.whenStable().then(() => {
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
