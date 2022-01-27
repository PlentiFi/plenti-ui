import { usePopperTooltip } from 'react-popper-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TooltipIcon = ({ children, icon, placement }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    'placement' : placement,
  });

  return (
    <>
      <span ref={setTriggerRef}><FontAwesomeIcon icon={icon} /></span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          {children}
        </div>
      )}
    </>
  )
}

export default TooltipIcon
