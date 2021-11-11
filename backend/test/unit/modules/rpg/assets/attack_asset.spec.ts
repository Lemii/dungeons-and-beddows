import { AttackAsset } from '../../../../../src/app/modules/rpg/assets/attack_asset';

describe('AttackAsset', () => {
  let transactionAsset: AttackAsset;

	beforeEach(() => {
		transactionAsset = new AttackAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(201);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('attack');
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
