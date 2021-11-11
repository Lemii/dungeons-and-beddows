import { ReactElement, useCallback, useEffect, useState } from 'react';

import { getFromLocalStorage } from '../../utils/storage';

type Props = {
	text: string;
	cb?: Function;
};

const TypeWriter = ({ text, cb }: Props): ReactElement => {
	const [output, setOutput] = useState<string>('');
	const disableEffect = useCallback(() => getFromLocalStorage('disableTypewriterEffect') || false, []);

	useEffect(() => {
		if (disableEffect()) {
			setOutput(text);
			return;
		}

		let index = 0;

		const writer = (str: string) => {
			if (index >= str.length) {
				clearInterval(interval);
			} else {
				// @ts-ignore
				setOutput(prevOutput => prevOutput + str[index]);
				// setOutput(prevOutput => [...prevOutput, str[index]]);
				index++;
			}
		};

		const interval = setInterval(() => {
			writer(text);
		}, 30);

		return () => {
			clearInterval(interval);
		};
	}, [text, disableEffect]);

	useEffect(() => {
		if (output.length === text.length && cb) {
			cb();
		}
	}, [output.length, text.length, cb]);

	return <pre>{output}</pre>;
};

export default TypeWriter;
