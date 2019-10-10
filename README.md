# dom-in-view

Select DOMElement(s) that is currently inside or visible in current viewport.

#### install
`npm i dom-in-view`


### DOMInView Instance
```js
// import it
import DOMInView from 'dom-in-view';
// instance
new DOMInView(HTMLElement || NodeList || Array<HTMLElement> : elements, Object : callbacks, Object : options);
```
##### accessors
* _**elements**_:*Array* - Returns an array of all the elements provided.  
* _**options**_:*Object* - Current defined options object.
* _**matches**_:*Array* - Reference to matches at the point in time of it being called.
* _**pull()**_:*Array* - Returns an array of all the matches from the pull. (*note: does not point to the matches array*)

##### arguments
* _**elements**_ - Elements requires a single valid HTMLElement, NodeList or an Array.
```js
  new DOMInView(document.querySelector('p#single-paragraph'), Object : callbacks, Object : options);
  new DOMInView(document.querySelectorAll('p, div, h1, h2'), Object : callbacks, Object : options);
  new DOMInView([document.querySelector('p#single-paragraph'), document.querySelector('div#single-div')], Object : callbacks, Object : options);
```
* _**callbacks**_ - There are 3 available callbacks
  * _**init**_ - Will be called on initialization. A helper implementation function to run when the class is instantiated.
  * _**on**_ - Gets called on each element visible or inside(depending on options) the viewport
  * _**off**_ - Gets called on each element when it's *NOT* visible or inside the viewport
  ```js
  {
      init: function(DOMInView : self){},
      on: function(HTMLElement : element, String : className){},
      off: function(HTMLElement : element, String : className){}
  }
  ```
* _**options**_ - Available options. Defaults in _**bold**_
  * _**check**_ - String : _**'visible'**_ ||  *'inside'*
  * _**className**_ - String : _**'dom-in-view'**_
  * _**autostart**_ - Boolean : _**true**_
  * _**scroll**_ - Boolean : _**true**_
  * _**resize**_ - Boolean : _**true**_
  * _**animationFrame**_ - Boolean : _**false**_. If animationFrame is set to true *autostart*, *scroll* and *resize* will be ignored since it will use the requestAnimationFrame and pull on every frame.
  * _**ignoreDefaultEvents**_ - Boolean : _**false**_. If ignoreDefaultEvents is set to true *autostart*, *scroll*, *resize* and *animationFrame* will be ignored, useful for when you want to pull on your own eventlisteners
  ```js
    // default options
    const options = {
      check: 'visible',
      className: 'dom-in-view',
      autostart: true,
      scroll: true,
      resize: true,
      animationFrame: false,
      ignoreDefaultEvents: false,
    }
  ```


### Examples
Add class to elements that has been visible in view
```js
// default options will be applied
new DOMInView(document.querySelectorAll('p'), {
  on: function(element){
    element.classList.add('element-visible');
  }
});
```

Pulling after your own events
```js
// default options will be applied
new DOMInView(document.querySelectorAll('p'), {
  init: function(){
    // check all elements being listened to manually in a window click event
    window.addEventListener('click', _ => this.pull());
  },
  on: function(element){
    element.classList.add('element-visible');
  }
// override ignoreDefaultEvents
}, {ignoreDefaultEvents: true});
```

If you prefer not to use the init callback you may access instance accessors like you'd normally do.
```js
const dv = new DOMInView(document.querySelectorAll('p'), {
  on: function(element){
    element.classList.add('element-visible');
  }
}, {ignoreDefaultEvents: true});

// check all elements being listened to manually in a window click event
window.addEventListener('click', _ => dv.pull());
```

#### Extended example
Note that anonymouse functions don't have `this` context so if you need to access the instance inside a callback, use a normal `function(){}` instead.
```js
const options = {
  check: 'inside',
  ignoreDefaultEvents: true,
}
new DOMInView(document.querySelectorAll('p'), {
  init: (self) => {
    setInterval(() => {
      self.pull();
    }, 3000);
  },
  on: (element) =>{
    element.classList.add('element-visible');
  },
  off: (element) => {
    element.classList.remove('element-visible');
  }
}, options);
```
