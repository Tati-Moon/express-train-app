import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appCloseAllOverlay]',
    standalone: true,
})
export class CloseAllOverlayDirective {
    @Output() clickOutside = new EventEmitter<void>();

    constructor(private elementRef: ElementRef) {}

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement: HTMLElement): void {
        const isClickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!isClickedInside) {
            this.clickOutside.emit();
        }
    }
}
