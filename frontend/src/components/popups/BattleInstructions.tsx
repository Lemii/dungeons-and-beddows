import { ReactElement, useState } from 'react';

import { getFromLocalStorage } from '../../utils/storage';
import BattleButton from '../battle/BattleButton';
import Modal from '../ui/Modal';
import PreferenceCheckbox from '../ui/PreferenceCheckbox';

const BattleInstructions = (): ReactElement => {
	const [hideModal, setHideModal] = useState(getFromLocalStorage('hideBattleInstructions') || false);

	return (
		<div>
			{!hideModal && (
				<Modal title="Battle Instructions" handleClose={() => setHideModal(true)} fullScreen>
					<p className="mb-12">
						D&amp;B is a turn-based RPG game. This means that you and the monster both take one turn at the time. The
						player may always move first. Each of the available moves (as seen below) counts as a turn. After your move,
						the monster automatically performs its move.
					</p>

					<div className="grid grid-cols-2 gap-8">
						<div>
							<div className="flex flex-start mb-4">
								<BattleButton type="attack" onClick={() => null} />

								<p className="my-auto ml-4">Attack the monster for your base dmg + gear bonus dmg.</p>
							</div>

							<div className="flex flex-start mb-4">
								<BattleButton type="defend" onClick={() => null} />
								<p className="my-auto ml-4">
									Block incoming damage for your (base def + gear bonus def) * 2. Most effective when the monster uses a
									skill.
									<br />
									<span className="text-xxs text-red-300">
										(Monster skills are not yet implemented in this version)
									</span>
								</p>
							</div>
							<div className="flex flex-start mb-4">
								<BattleButton type="item" onClick={() => null} />
								<p className="my-auto ml-4">Use item from your inventory. Counts as a turn.</p>
							</div>
						</div>

						<div>
							<div className="flex flex-start mb-4">
								<BattleButton type="skill" onClick={() => null} />
								<p className="my-auto ml-4">
									Use one of your skills. Costs mp.
									<br />
									<span className="text-xxs text-red-300">(Skills are not yet implemented in this version)</span>
								</p>
							</div>
							<div className="flex flex-start mb-4">
								<BattleButton type="flee" onClick={() => null} />
								<p className="my-auto ml-4">Be a chicken and flee the battle. Lose gold, but survive the battle.</p>
							</div>
						</div>

						<div className="mt-16">
							<PreferenceCheckbox storageKey="hideBattleInstructions" />
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default BattleInstructions;
