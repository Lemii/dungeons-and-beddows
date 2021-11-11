import { Schema } from 'lisk-sdk';

import { playerDefaults } from '../../defaults';

export const CHAIN_STATE = 'rpg:state';

const buildEntitySummarySchema = (fieldNumber?: number) => ({
	type: 'object',
	required: ['name', 'id'],
	fieldNumber,
	properties: {
		name: {
			fieldNumber: 1,
			dataType: 'string',
		},
		id: {
			fieldNumber: 2,
			dataType: 'string',
		},
	},
});

const baseEntitySchema = {
	id: {
		dataType: 'string',
		fieldNumber: 1,
	},
	status: {
		type: 'object',
		fieldNumber: 2,
		properties: {
			type: {
				dataType: 'string',
				fieldNumber: 1,
			},
			statusUpdated: {
				dataType: 'uint32',
				fieldNumber: 2,
			},
		},
	},
	name: {
		dataType: 'string',
		fieldNumber: 3,
	},
	lvl: {
		dataType: 'uint32',
		fieldNumber: 4,
	},
	hp: {
		type: 'object',
		fieldNumber: 5,
		properties: {
			max: {
				dataType: 'uint32',
				fieldNumber: 1,
			},
			current: {
				dataType: 'uint32',
				fieldNumber: 2,
			},
		},
	},
	mp: {
		type: 'object',
		fieldNumber: 6,
		properties: {
			max: {
				dataType: 'uint32',
				fieldNumber: 1,
			},
			current: {
				dataType: 'uint32',
				fieldNumber: 2,
			},
		},
	},
	dmg: {
		dataType: 'uint32',
		fieldNumber: 7,
	},
	def: {
		dataType: 'uint32',
		fieldNumber: 8,
	},
	inBattleWith: buildEntitySummarySchema(9),
	defeatedBy: buildEntitySummarySchema(10),
	entitiesDefeated: {
		fieldNumber: 11,
		type: 'array',
		items: buildEntitySummarySchema(),
	},
};

export const monsterSchema = {
	type: 'object',
	required: ['id', 'status', 'name', 'lvl', 'hp', 'mp', 'dmg', 'def', 'inBattleWith', 'defeatedBy', 'entitiesDefeated'],
	properties: {
		...baseEntitySchema,
	},
};

export const accountSchema = {
	type: 'object',
	required: [
		'id',
		'status',
		'name',
		'lvl',
		'hp',
		'mp',
		'dmg',
		'def',
		'inBattleWith',
		'defeatedBy',
		'entitiesDefeated',
		'xp',
		'gold',
		'gear',
		'items',
		'totalDamageDealt',
		'totalDamageTaken',
		'timesFled',
	],
	properties: {
		...baseEntitySchema,
		xp: {
			dataType: 'uint32',
			fieldNumber: 12,
		},
		gold: {
			dataType: 'uint32',
			fieldNumber: 13,
		},
		gear: {
			type: 'object',
			fieldNumber: 14,
			properties: {
				weapon: {
					dataType: 'string',
					fieldNumber: 1,
				},
				head: {
					dataType: 'string',
					fieldNumber: 2,
				},
				body: {
					dataType: 'string',
					fieldNumber: 3,
				},
				feet: {
					dataType: 'string',
					fieldNumber: 4,
				},
			},
		},
		items: {
			type: 'array',
			fieldNumber: 15,
			items: {
				type: 'object',
				properties: {
					itemId: {
						fieldNumber: 1,
						dataType: 'string',
					},
					purchaseId: {
						fieldNumber: 2,
						dataType: 'string',
					},
				},
			},
		},
		totalDamageDealt: {
			dataType: 'uint32',
			fieldNumber: 16,
		},
		totalDamageTaken: {
			dataType: 'uint32',
			fieldNumber: 17,
		},
		timesFled: {
			dataType: 'uint32',
			fieldNumber: 18,
		},
	},
	default: {
		id: '',
		status: {
			type: 'unregistered',
			statusUpdated: 0,
		},
		name: '',
		lvl: 1,
		hp: { max: playerDefaults.hp, current: playerDefaults.hp },
		mp: { max: playerDefaults.mp, current: playerDefaults.mp },
		dmg: playerDefaults.dmg.base,
		def: playerDefaults.def,
		inBattleWith: {
			name: '',
			id: '',
		},
		defeatedBy: {
			name: '',
			id: '',
		},
		entitiesDefeated: [],
		xp: 0,
		gold: 0,
		gear: {
			weapon: '',
			head: '',
			body: '',
			FocusEvent: '',
		},
		items: [],
		totalDamageDealt: 0,
		totalDamageTaken: 0,
		timesFled: 0,
	},
};

export const ChainStateSchema: Schema = {
	$id: '/rpg/chain-state',
	type: 'object',
	required: ['monsters', 'players', 'afterlife', 'statistics'],
	properties: {
		monsters: {
			fieldNumber: 1,
			type: 'array',
			items: monsterSchema,
		},
		players: {
			fieldNumber: 2,
			type: 'array',
			items: accountSchema,
		},
		afterlife: {
			fieldNumber: 3,
			type: 'array',
			items: monsterSchema,
		},
		statistics: {
			fieldNumber: 4,
			type: 'object',
			properties: {
				monstersAlive: {
					dataType: 'uint32',
					fieldNumber: 1,
				},
				monstersDefeated: {
					dataType: 'uint32',
					fieldNumber: 2,
				},
				playersAlive: {
					dataType: 'uint32',
					fieldNumber: 3,
				},
				playersDefeated: {
					dataType: 'uint32',
					fieldNumber: 4,
				},
			},
		},
	},
};
