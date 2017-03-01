export const hideRestOfDom = (modalSelector) => {
  const focusableSelector = `a[href], area[href], input:not([disabled]):not([type="hidden"]),
                            select:not([disabled]), textarea:not([disabled]), button:not([disabled]),
                            iframe, object, embed, *[tabindex], *[contenteditable]`
  const hide = []
  let hideI
  let tabindex
  const focusable = document.querySelectorAll(focusableSelector)
  let focusableI = focusable.length
  const modal = document.querySelector(modalSelector)
  let modalFocusable = document.querySelectorAll(focusableSelector)
  /* convert to array so we can use indexOf method */
  modalFocusable = Array.prototype.slice.call(modalFocusable)
  /* push the container on to the array */
  modalFocusable.push(modal)
  /* separate get attribute methods from set attribute methods */
  while (focusableI--) {
    /* dont hide if element is inside the modal */
    if (modalFocusable.indexOf(focusable[focusableI]) === -1) {
      /* add to hide array if tabindex is not negative */
      tabindex = parseInt(focusable[focusableI].getAttribute('tabindex'), 10)
      if (isNaN(tabindex)) {
        hide.push([focusable[focusableI], 'inline'])
      } else if (tabindex >= 0) {
        hide.push([focusable[focusableI], tabindex])
      }
    }
  }
  /* hide the dom elements */
  hideI = hide.length
  while (hideI--) {
    hide[hideI][0].setAttribute('data-tabindex', hide[hideI][1])
    hide[hideI][0].setAttribute('tabindex', -1)
  }
}

export const unhideDom = () => {
  const unhide = []
  let unhideI
  let dataTabindex
  const hidden = document.querySelectorAll('[data-tabindex]')
  let hiddenI = hidden.length
  /* separate the get and set attribute methods */
  while (hiddenI--) {
    dataTabindex = hidden[hiddenI].getAttribute('data-tabindex')
    if (dataTabindex !== null) {
      unhide.push([hidden[hiddenI], (dataTabindex === 'inline') ? 0 : dataTabindex])
    }
  }

  /* unhide the dom elements */
  unhideI = unhide.length
  while (unhideI--) {
    unhide[unhideI][0].removeAttribute('data-tabindex')
    unhide[unhideI][0].setAttribute('tabindex', unhide[unhideI][1])
  }
}
