import lowerToCamel from './lowerToCamel';

describe('Lower to camel case transformer', () => {
  it('Should transform lower_case keys to camelCase', () => {
    const input = {
      one_two: {
        three_four: {
          five_six: true,
        },
      },
      seven_height_nine: null,
      undef: undefined,
      array: [{ a_b_c: 12 }, { d_e_f: 'test', empt_y: [] }],
    };

    expect(lowerToCamel(input)).toEqual({
      oneTwo: { threeFour: { fiveSix: true } },
      sevenHeightNine: null,
      undef: undefined,
      array: [{ aBC: 12 }, { dEF: 'test', emptY: [] }],
    });
  });
});
