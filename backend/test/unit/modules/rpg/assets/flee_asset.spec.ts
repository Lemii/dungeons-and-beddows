import { FleeAsset } from '../../../../../src/app/modules/rpg/assets/flee_asset';

describe('FleeAsset', () => {
  let transactionAsset: FleeAsset;

	beforeEach(() => {
		transactionAsset = new FleeAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(205);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('Flee');
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
