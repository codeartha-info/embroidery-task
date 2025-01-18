// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const operations = [];
  const targets = input.cart.lines.filter(
    (line) =>
      line.merchandise.__typename === "ProductVariant" &&
      line.color !== null &&
      line.color !== undefined
  );
  if (targets.length) {
    targets.forEach((line) => {
      const color =
        line.color?.value === "gold"
          ? "goldprice"
          : line.color?.value === "white"
          ? "whiteprice"
          : "";
      if (
        line.merchandise.__typename === "ProductVariant" &&
        color !== "" &&
        line.merchandise[color] !== null &&
        line.merchandise[color] !== undefined
      ) {
        const newPrice = parseFloat(line.cost.amountPerQuantity.amount) + parseFloat(line.merchandise[color].value);
        operations.push({
          update: {
            cartLineId: line.id,
            price: {
              adjustment: {
                fixedPricePerUnit: {
                  amount: `${newPrice}`,
                }
              },
            },
          },
        });
      }
    });
  }
  return {
    operations: operations,
  };
}
