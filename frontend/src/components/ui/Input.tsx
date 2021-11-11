import { ReactElement } from 'react';

type Props = {
	value: string;
	type?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	label: string;
	placeholder?: string;
	isValid?: boolean;
	disabled?: boolean;
	autocomplete?: string;
};

const Input = ({
	value,
	type = 'text',
	onChange,
	label,
	placeholder,
	isValid,
	disabled,
	autocomplete = 'off',
}: Props): ReactElement => {
	const getContextualMarkup = () => (isValid ? 'border-green-500 bg-green-100' : 'border-indigo-500 bg-indigo-100');

	return (
		<input
			autoFocus
			value={value}
			id={label}
			className={`border-2 custom-rounded-sm w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline ${getContextualMarkup()}`}
			type={type}
			onChange={onChange}
			placeholder={placeholder}
			disabled={disabled}
			autoComplete={autocomplete}
		/>
	);
};

export default Input;
