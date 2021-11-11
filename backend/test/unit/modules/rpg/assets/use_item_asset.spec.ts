import { UseItemAsset } from '../../../../../src/app/modules/rpg/assets/use_item_asset';

describe('UseItemAsset', () => {
  let transactionAsset: UseItemAsset;

	beforeEach(() => {
		transactionAsset = new UseItemAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(204);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('UseItem');
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
