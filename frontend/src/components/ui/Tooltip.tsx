import 'react-popper-tooltip/dist/styles.css';

import { ReactElement } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

type Props = {
	children: ReactElement | ReactElement[];
	tooltip: ReactElement;
};

const Tooltip = ({ children, tooltip }: Props): ReactElement => {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<div className="inline-block cursor-pointer">
			<div ref={setTriggerRef}>{children}</div>

			{visible && (
				<div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
					<div {...getArrowProps({ className: 'tooltip-arrow' })} />
					{tooltip}
				</div>
			)}
		</div>
	);
};

export default Tooltip;
