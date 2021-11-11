// Todo: refactor / clean up component
import { ReactElement, useContext, useEffect, useRef, useState } from 'react';

import config from '../../config';
import { PlayerContext } from '../../contexts/playerContext';
import { ActionType, AssetId, EventType } from '../../enums';
import useShopItems from '../../hooks/useShopItems';
import * as api from '../../services/api';
import * as transactions from '../../services/transactions';
import { GenericEventReturnData, Monster } from '../../types';
import { getMonsterAvatar, getPlayerAvatar } from '../../utils/avatars';
import { getDamageRange } from '../../utils/helpers';
import { getGearAttack, getGearDefense } from '../../utils/stats';
import { isInBattle } from '../../utils/validation';
import Inventory from '../Inventory';
import BattleInstructions from '../popups/BattleInstructions';
import FleeScreen from '../screens/FleeScreen';
import MonsterDefeatScreen from '../screens/MonsterDefeatScreen';
import PlayerDefeatScreen from '../screens/PlayerDefeatScreen';
import Empty from '../ui/Empty';
import Modal from '../ui/Modal';
import PingText from '../ui/PingText';
import PixelatedImage from '../ui/PixelatedImage';
import BattleButton from './BattleButton';
import StatusBars from './StatusBars';

const screens = {
	flee: <FleeScreen />,
	playerDefeat: <PlayerDefeatScreen />,
	monsterDefeat: <MonsterDefeatScreen />,
};

const Battle = (): ReactElement => {
	const context = useContext(PlayerContext);
	const [monster, setMonster] = useState<Monster | null>(null);
	const [screenOverride, setScreenOverride] = useState<keyof typeof screens | ''>('');
	const [showInventory, setShowInventory] = useState(false);
	const [showSkills, setShowSkills] = useState(false);
	const [lockButtons, setLockButtons] = useState(false);
	const [battleIsOver, setBattleIsOver] = useState(false);

	const { items } = useShopItems();
	const [currentAction, setCurrentAction] = useState('');

	const playerRef = useRef(context.playerAccount?.rpg);
	const stateRef = useRef(false);

	const player = context.playerAccount?.rpg;
	const credentials = context.playerCredentials;

	useEffect(() => {
		playerRef.current = context.playerAccount?.rpg;
	}, [context]);

	useEffect(() => {
		const updateMonster = async () => {
			const data = await api.invokeAction<Monster>(ActionType.GetMonsterById, {
				id: playerRef.current?.inBattleWith.id,
			});

			if (data) {
				setMonster(data);
			}
		};

		const handleNewBlockEvent = async () => {
			setCurrentAction('');

			if (battleIsOver) {
				return;
			}

			if (!screenOverride) {
				await updateMonster();
			}

			setLockButtons(false);
		};

		const handleMonsterDefeatEvent = async (data: GenericEventReturnData) => {
			if (playerRef.current && data.player === playerRef.current.name) {
				setBattleIsOver(true);

				setTimeout(() => {
					setScreenOverride('monsterDefeat');
				}, config.blockTime);
			}
		};

		const handlePlayerDefeatEvent = async (data: GenericEventReturnData) => {
			if (playerRef.current && data.player === playerRef.current.name) {
				setBattleIsOver(true);

				setTimeout(() => {
					setScreenOverride('playerDefeat');
				}, config.blockTime);
			}
		};

		const handleFleeEvent = async (data: GenericEventReturnData) => {
			if (playerRef.current && data.player === playerRef.current.name) {
				setTimeout(() => {
					setScreenOverride('flee');
				}, config.blockTime);
			}
		};

		api.subscribeToEvent(handleNewBlockEvent, EventType.newBlock);
		api.subscribeToEvent(handleMonsterDefeatEvent, EventType.MonsterDefeat);
		api.subscribeToEvent(handlePlayerDefeatEvent, EventType.PlayerDefeat);
		api.subscribeToEvent(handleFleeEvent, EventType.Flee);

		updateMonster();
	}, []);

	useEffect(() => {
		stateRef.current = lockButtons;
	}, [lockButtons]);

	if (screenOverride) {
		return screens[screenOverride];
	}

	if (!credentials || !player) {
		return <Empty text="You're not logged in" />;
	}

	if (!battleIsOver && !isInBattle(player)) {
		return <Empty text="You're not in battle" />;
	}

	const attack = async () => {
		setCurrentAction('Attacking');
		setLockButtons(true);
		transactions.sendGenericTransaction(credentials.passphrase, AssetId.Attack);
	};

	const defend = async () => {
		setCurrentAction('Defending');
		setLockButtons(true);
		transactions.sendGenericTransaction(credentials.passphrase, AssetId.Defend);
	};

	const flee = async () => {
		setCurrentAction('Fleeing');
		setLockButtons(true);
		transactions.sendGenericTransaction(credentials.passphrase, AssetId.Flee);
	};

	return (
		<div className="text-center flex h-full">
			<div className="m-auto">
				<BattleInstructions />

				{showInventory && (
					<Modal title="Inventory" handleClose={() => setShowInventory(false)}>
						<Inventory cols={4} inventoryItems={player.items} shopItems={items} />
					</Modal>
				)}

				{showSkills && (
					<Modal title="Skills" handleClose={() => setShowSkills(false)}>
						<div>Placeholder</div>
					</Modal>
				)}

				{player && monster && (
					<div
						className={`flex flex-between delay-1000 transition-all duration-2000 ease-in-out  ${
							battleIsOver ? 'opacity-0' : 'opacity-100'
						}`}
					>
						<div style={{ width: '45%' }}>
							<div className="flex justify-center mb-8">
								<PixelatedImage
									src={getPlayerAvatar(player.name)}
									alt="Player Avatar"
									className={`mb-2 opacity-75 w-1/2`}
								/>
							</div>

							<StatusBars entity={player} />

							<div className="text-left mt-2">
								<span className="mr-8">Dmg: {getDamageRange(player.dmg + getGearAttack(player, items), 'player')}</span>
								<span>Def: {player.def + getGearDefense(player, items)}</span>
							</div>
						</div>
						<div style={{ width: '10%' }} className="m-auto text-center animate-pulse">
							<span className="text-sm lg:text-xl xl:text-2xl">vs</span>
						</div>
						<div style={{ width: '45%' }}>
							<div className="flex justify-center mb-8">
								<PixelatedImage src={getMonsterAvatar(monster.id)} alt="Monster Avatar" className={`mb-2 w-1/2`} />
							</div>

							<StatusBars entity={monster} />

							<div className="text-right mt-2">
								<span className="mr-8">Dmg: {getDamageRange(monster.dmg, 'monster')}</span>
								<span>Def: {monster.def}</span>
							</div>
						</div>
					</div>
				)}

				<p className="text-xl md:text-1xl lg:text-2xl xl:text-5xl my-16 uppercase">
					{battleIsOver ? (
						<span className="text-yellow-300">Battle is Over</span>
					) : (
						<PingText text={currentAction || 'FIGHT'} />
					)}
				</p>

				<div className="flex justify-center">
					<div className="flex gap-8">
						<BattleButton type="attack" onClick={attack} disabled={battleIsOver || lockButtons} />
						<BattleButton type="defend" onClick={defend} disabled={battleIsOver || lockButtons} />
						<BattleButton type="item" onClick={() => setShowInventory(true)} disabled={battleIsOver || lockButtons} />
						<BattleButton type="skill" onClick={() => setShowSkills(true)} disabled={battleIsOver || lockButtons} />
						<BattleButton type="flee" onClick={flee} disabled={battleIsOver || lockButtons} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Battle;
