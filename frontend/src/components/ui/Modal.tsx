import { ReactElement, useEffect, useRef } from 'react';

import Hr from './Hr';

type Props = {
	title: string;
	children: ReactElement | ReactElement[];
	handleClose: () => void;
	cancelText?: string;
	confirmButton?: {
		text?: string;
		onClick: Function;
	};
	fullScreen?: boolean;
};

const Modal = ({ title, children, handleClose, confirmButton, cancelText, fullScreen }: Props): ReactElement => {
	const ref = useRef(HTMLDivElement);

	useEffect(() => {
		const isClickedOutside = (e: MouseEvent) => {
			// @ts-ignore
			if (ref.current && !ref.current.contains(e.target)) {
				handleClose();
			}
		};

		document.addEventListener('mousedown', isClickedOutside);

		return () => {
			document.removeEventListener('mousedown', isClickedOutside);
		};
	}, [handleClose]);

	const handleConfirm = () => {
		confirmButton && confirmButton.onClick();
		handleClose();
	};

	return (
		<div
			className="fixed z-10 inset-0 overflow-y-auto animate__animated animate__fadeIn animate__faster"
			aria-labelledby={title}
			role="dialog"
			aria-modal="true"
		>
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

				<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
					&#8203;
				</span>

				<div
					className={`inline-block align-bottom bg-blue rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border-2 border-yellow-300 ${
						fullScreen && 'lg:max-w-screen-xl lg:w-3/4 '
					}`}
					// @ts-ignore
					ref={ref}
				>
					<div className="bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="sm:flex sm:items-start">
							<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
								<h1 className="text-lg leading-6 font-medium" id={title}>
									{title}
								</h1>

								<Hr mt={4} mb={8} />
								<div>{children}</div>
							</div>
						</div>
					</div>
					<div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
						{confirmButton && (
							<button type="button" className="btn btn-primary" onClick={handleConfirm}>
								{confirmButton.text || 'Confirm'}
							</button>
						)}
						<button onClick={handleClose} type="button" className="btn btn-primary ">
							{cancelText || 'Close'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
