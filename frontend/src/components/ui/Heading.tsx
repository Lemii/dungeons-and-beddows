import { ReactElement } from 'react';

type Props = {
	children: ReactElement | ReactElement[];
};

const Heading = ({ children }: Props): ReactElement => {
	return <h1>{children}</h1>;
};

export default Heading;
