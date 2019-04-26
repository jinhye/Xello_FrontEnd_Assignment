import { Directive, Input, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  @Input('tooltip') tooltipTitle: string;
  @Input() placement: string;
  @Input() delay: number;
  tooltip: HTMLElement;
  element: HTMLElement;
  offset = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  // detect a button
  @HostListener('click', ['$event'])
  onClick(){
    if(document.getElementById('opened')){           
      this.close();
      //this.hide();
      this.show();
    }else{     
      this.show();
    }   
  }

  // detect outside element
  @HostListener('blur', ['$event'])
  outClick(){
    if(document.getElementById('opened')){
      this.close();
      // this.hide();
    } 
  }

  // detect the Esc Key
  @HostListener('keydown', ['$event']) 
  onKeydownHandler(event: KeyboardEvent) {
    if (event.key === "Escape" && document.getElementById('opened')) {
      this.hide();
    }
  }

  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }, this.delay);
  }

  // hide the opposite
  close() {
    this.element = document.getElementById('opened');
    this.element.parentNode.removeChild(this.element);
  }

  create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle) // textNode
    );

    this.renderer.appendChild(document.body, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

    this.renderer.setProperty(this.tooltip, 'id', 'opened');

    // delay set up
    this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
  }

  // place a tooltip
  setPosition() {
    // get the element location
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    // get the tooltip location
    const tooltipPos = this.tooltip.getBoundingClientRect();

    // get the value of scroll position
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    let top, left;
    
    switch(this.placement){
      case 'top':
        top = hostPos.top - tooltipPos.height - this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'bottom':
        top = hostPos.bottom + this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'left':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.left - tooltipPos.width - this.offset;
        break;
      case 'right':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.right + this.offset;
    }
    
    // set up new position when scrolling
    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
