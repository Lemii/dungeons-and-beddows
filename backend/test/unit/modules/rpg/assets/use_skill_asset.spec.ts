import { UseSkillAsset } from '../../../../../src/app/modules/rpg/assets/use_skill_asset';

describe('UseSkillAsset', () => {
  let transactionAsset: UseSkillAsset;

	beforeEach(() => {
		transactionAsset = new UseSkillAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(203);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('UseSkill');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('apply', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
