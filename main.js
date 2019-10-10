/*

  DOMInView - Find DOMElements visible in viewport

  author:   Jens Hjalmarsson
  contact:  jens.hjalmarsson@gmail.com
  date:     2019-10-09

*/
class DOMInView{
  constructor(DOMElements, callbacks, options){
    // make sure there are DOMNodes
    if(!(DOMElements instanceof HTMLElement || DOMElements instanceof NodeList || Array.isArray(DOMElements))){
      throw new Error(`DOMInView requires a valid HTMLElement or NodeList to be provided.`);
    }
    this._matches = [];
    this._callbacks = Object.assign({}, callbacks);
    // defaults
    this._options = Object.assign({
      check: 'visible',
      className: 'dom-in-view',
      autostart: true,
      scroll: true,
      resize: true,
      animationFrame: false,
      ignoreDefaultEvents: false,
    }, options);
    // selectors
    const selectors = DOMElements instanceof HTMLElement ? [DOMElements] : Array.from(DOMElements);
    // get all elements from selectors
    this._elements = selectors.map(el => {
      if(!(el instanceof HTMLElement)){
        throw new Error(`Invalid DOMElement. Expecting HTMLElement got : [${el.constructor.name}]`);
      }
      el.classList.add(this._options.className);
      return el;
    });
    // call init if exists
    if(typeof this._callbacks.init == 'function'){
      this._callbacks.init.call(this, this);
    }
    // if options provided is false ignore events, the user supplies his own
    if(this._options.ignoreDefaultEvents != true){
      // run on start
      if(this._options.autostart == true){
        this.pull();
      }
      // handle scroll listener
      if(this._options.scroll == true && this._options.animationFrame != true){
        window.addEventListener('scroll', _ => this.pull());
      }
      // listen for resize changes
      if(this._options.resize == true && this._options.animationFrame != true){
        window.addEventListener('resize', _ => this.pull());
      }
      // listen on every animation frame
      if(this._options.animationFrame == true){
        const loop = _ => {this.pull();requestAnimationFrame(loop);};
        requestAnimationFrame(loop);
      }
    }
  }
  get elements(){
    return this._elements;
  }
  get options(){
    return this._options;
  }
  get matches(){
    return this._matches;
  }
  inView(element){
    const rect = element.getBoundingClientRect();
    switch(this._options.check){
      // check if all parts is inside viewport
      case 'inside':
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= Math.max(document.documentElement.clientHeight, window.innerHeight) && rect.right <= Math.max(document.documentElement.clientWidth, window.innerWidth);
      break;
      // check if any part is visible on screen
      case 'visible':
        return !(rect.bottom < 0 || rect.top > Math.max(document.documentElement.clientHeight, window.innerHeight) || rect.right < 0 || rect.left > Math.max(document.documentElement.clientWidth, window.innerWidth));
      break;
    }
  }
  pull(){
    // store local matches
    let matches = [];
    for(let element of this._elements){
      if(this.inView(element)){
        // copy local current to instance current
        matches.push(element);
        this._matches = [...matches];
        if(typeof this._callbacks.on == 'function'){
          this._callbacks.on.call(this, element, this._options.className);
        }
      }else{
        if(typeof this._callbacks.off == 'function'){
          this._callbacks.off.call(this, element, this._options.className);
        }
      }
    }
    // NOTE: that we are purposly returning matches and not
    // the class property this._matches
    return matches;
  }
}

export default DOMInView;
