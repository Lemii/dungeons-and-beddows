import knight_body_t1 from './assets/armor/knight-body_t1_18x18.png';
import knight_feet_t1 from './assets/armor/knight-feet_t1_18x18.png';
import knight_head_t1 from './assets/armor/knight-head_t1_18x18.png';
import mage_body_t1 from './assets/armor/mage-body_t1_18x18.png';
import mage_feet_t1 from './assets/armor/mage-feet_t1_18x18.png';
import mage_head_t1 from './assets/armor/mage-head_t1_18x18.png';
import attack from './assets/battle/attack.png';
import defend from './assets/battle/defend-b.png';
import flee from './assets/battle/flee.png';
import item from './assets/battle/item.png';
import skill from './assets/battle/skill.png';
import hp_t1 from './assets/consumables/hp_t1_18x18.png';
import hp_t2 from './assets/consumables/hp_t2_18x18.png';
import hp_t3 from './assets/consumables/hp_t3_18x18.png';
import mp_t1 from './assets/consumables/mp_t1_18x18.png';
import mp_t2 from './assets/consumables/mp_t2_18x18.png';
import mp_t3 from './assets/consumables/mp_t3_18x18.png';
import placeholder from './assets/placeholder.png';
import gold from './assets/ui/gold_t1_18x18.png';
import halbert_t1 from './assets/weapons/halbert_t1_18x18.png';
import halbert_t2 from './assets/weapons/halbert_t2_18x18.png';
import halbert_t3 from './assets/weapons/halbert_t3_18x18.png';
import halbert_t4 from './assets/weapons/halbert_t4_18x18.png';
import staff_t1 from './assets/weapons/staff_t1_18x18.png';
import staff_t2 from './assets/weapons/staff_t2_18x18.png';
import staff_t3 from './assets/weapons/staff_t3_18x18.png';
import staff_t4 from './assets/weapons/staff_t4_18x18.png';
import sword_t1 from './assets/weapons/sword_t1_18x18.png';
import sword_t2 from './assets/weapons/sword_t2_18x18.png';
import sword_t3 from './assets/weapons/sword_t3_18x18.png';
import sword_t4 from './assets/weapons/sword_t4_18x18.png';

const iconMap: { [key: string]: string } = {
	hp_t1,
	hp_t2,
	hp_t3,
	mp_t1,
	mp_t2,
	mp_t3,
	sword_t1,
	sword_t2,
	sword_t3,
	sword_t4,
	halbert_t1,
	halbert_t2,
	halbert_t3,
	halbert_t4,
	staff_t1,
	staff_t2,
	staff_t3,
	staff_t4,
	knight_head_t1,
	knight_body_t1,
	knight_feet_t1,
	mage_head_t1,
	mage_body_t1,
	mage_feet_t1,
	gold,
	attack,
	defend,
	flee,
	item,
	skill,
};

export const getIcon = (id: string) => {
	const sanitizedId = id.replaceAll('-', '_');
	const icon = iconMap[sanitizedId];
	return icon || placeholder;
};
