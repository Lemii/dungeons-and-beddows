import { ReactElement, useState } from 'react';

import cog from '../../../assets/ui/cog-a.png';
import { getFromLocalStorage } from '../../../utils/storage';
import Modal from '../Modal';
import PixelatedImage from '../PixelatedImage';
import PreferenceCheckbox from '../PreferenceCheckbox';
import { MenuButton } from './Header';

const DropDown = (): ReactElement => {
	const [show, setShow] = useState(false);

	return (
		<div className="relative inline-block text-left mt-5">
			<MenuButton onClick={() => setShow(!show)}>
				<div>
					Settings <PixelatedImage src={cog} alt="cog" className={`ml-2 inline-block w-7`} />
				</div>
			</MenuButton>

			{show && (
				<Modal title="Settings" handleClose={() => setShow(false)}>
					<div className="flex flex-col gap-4">
						<PreferenceCheckbox
							text="Hide battle button labels"
							storageKey="hideButtonLabels"
							value={getFromLocalStorage('hideButtonLabels') || false}
						/>
						<PreferenceCheckbox
							text="Disable typewriter effect"
							storageKey="disableTypewriterEffect"
							value={getFromLocalStorage('disableTypewriterEffect') || false}
						/>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default DropDown;
