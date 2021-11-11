import { ReactElement } from 'react';

type Props = {
	message: string;
};

const Error = ({ message }: Props): ReactElement => {
	return <p className="text-red-500 text-xs mb-4">{message}</p>;
};

export default Error;
