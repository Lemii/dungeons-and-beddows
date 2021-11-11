import { ChangeEvent, ReactElement, useState } from 'react';

import { getFromLocalStorage, setToLocalStorage, StorageKey } from '../../utils/storage';

type Props = {
	text?: string;
	storageKey: StorageKey;
	cb?: () => void;
	value?: boolean;
};

const PreferenceCheckbox = ({ text = 'Do not show again', storageKey, cb, value }: Props): ReactElement => {
	const [checked, setChecked] = useState(getFromLocalStorage(storageKey) || false);

	const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;
		setChecked(checked);
		setToLocalStorage(checked, storageKey);
		if (cb) cb();
	};

	return (
		<div className="flex">
			<input type="checkbox" onChange={handleCheck} className="w-6 h-6" checked={value || checked} />
			<p className="align-middle ml-4">{text}</p>
		</div>
	);
};

export default PreferenceCheckbox;
