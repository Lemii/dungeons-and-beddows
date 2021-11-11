import { SellItemAsset } from '../../../../../src/app/modules/rpg/assets/sell_item_asset';

describe('SellItemAsset', () => {
  let transactionAsset: SellItemAsset;

	beforeEach(() => {
		transactionAsset = new SellItemAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(301);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('sellItem');
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
