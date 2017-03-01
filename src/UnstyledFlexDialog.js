import React, { PropTypes, Component } from 'react'
import dynamics from 'dynamics.js'
import EventStack from 'active-event-stack'
import keycode from 'keycode'
import { inject } from 'narcissus'
import CloseCircle from './CloseCircle'
import { hideRestOfDom, unhideDom } from './tabHelper'

const styles = {
  closeButton: {
    position: 'absolute',
    top: 0,
    left: -50,
    display: 'block',
    width: 40,
    height: 40,
    transition: 'transform 0.1s',
    '&&:hover': {
      transform: 'scale(1.1)'
    }
  }
}

class UnstyledFlexDialog extends Component {
  componentWillMount = () => {
    /**
     * This is done in the componentWillMount instead of the componentDidMount
     * because this way, a modal that is a child of another will have register
     * for events after its parent
     */
    this.eventToken = EventStack.addListenable([
      ['click', this.handleGlobalClick],
      ['keydown', this.handleGlobalKeydown]
    ])
  }
  componentDidMount = () => {
    this.animateIn()
    hideRestOfDom(this.props.classReference)
    document.body.classList.add('modal-open')
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.componentIsLeaving && !this.props.componentIsLeaving) {
      const node = this.flexDialog
      dynamics.animate(node, {
        scale: 1.2,
        opacity: 0
      }, {
        duration: 300,
        type: dynamics.easeIn
      })
    }
  }
  componentWillUnmount = () => {
    EventStack.removeListenable(this.eventToken)
    unhideDom()
    document.body.classList.remove('modal-open')
  }
  didAnimateInAlready = false
  shouldClickDismiss = (event) => {
    const { target } = event
    // This piece of code isolates targets which are fake clicked by things
    // like file-drop handlers
    if (target.tagName === 'INPUT' && target.type === 'file') {
      return false
    }

    if (target === this.flexDialog || this.flexDialog.contains(target)) return false
    return true
  }
  handleGlobalClick = (event) => {
    if (this.shouldClickDismiss(event)) {
      if (typeof this.props.onClose === 'function') {
        this.props.onClose()
      }
    }
  }
  handleGlobalKeydown = (event) => {
    if (keycode(event) === 'esc') {
      if (typeof this.props.onClose === 'function') {
        this.props.onClose()
      }
    }
  }
  animateIn = () => {
    this.didAnimateInAlready = true

    // Animate this node once it is mounted
    const node = this.flexDialog

    // This sets the scale...
    if (document.body.style.transform == null) {
      node.style.WebkitTransform = 'scale(0.5)'
    } else {
      node.style.transform = 'scale(0.5)'
    }

    dynamics.animate(node, {
      scale: 1
    }, {
      type: dynamics.spring,
      duration: 500,
      friction: 400
    })
  }
  render = () => {
    const {
        children,
        componentIsLeaving, // eslint-disable-line no-unused-vars, this line is used to remove parameters from rest
        onClose,
        style,
        className
    } = this.props

    return (
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          width: '100%',
          minHeight: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
          <div
            ref={(c) => { this.flexDialog = c }}
            style={{
              display: 'block',
              backgroundColor: 'white',
              // Position is important for the close circle
              position: 'relative',
              ...style
            }}
            className={className}
          >
            {
              onClose != null &&
              <a className={inject(styles.closeButton)} onClick={onClose}>
                <CloseCircle diameter={40} />
              </a>
            }
            {children}
          </div>
        </div>
      </div>
    )
  }
}

UnstyledFlexDialog.propTypes = {
  children: PropTypes.node.isRequired,
  componentIsLeaving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  style: PropTypes.object,
  classReference: PropTypes.string,
  className: PropTypes.string
}
UnstyledFlexDialog.defaultProps = {
  style: {},
  classReference: '',
  componentIsLeaving: false,
  className: 'iagModal'
}

export default UnstyledFlexDialog
