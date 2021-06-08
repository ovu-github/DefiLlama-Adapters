const sdk = require("@defillama/sdk");
const {unwrapUniswapLPs} = require('../helper/unwrapLPs')
const BigNumber = require('bignumber.js')

const FraxWethStaking = '0xD875628B942f8970De3CcEaf6417005F68540d4f'
const FraxUSDCStaking = '0xa29367a3f057F3191b62bd4055845a33411892b6'
const FraxFXSStaking = '0xda2c338350a0e59ce71cdced9679a3a590dd9bec'
const FraxWethToken = '0xFD0A40Bc83C5faE4203DEc7e5929B446b07d1C76'
const FraxUSDCSToken = '0x97C4adc5d28A86f9470C70DD91Dc6CC2f20d2d4D'
const FraxFXSToken = '0xE1573B9D29e2183B1AF0e743Dc2754979A40D237'

async function tvl(timestamp, block) {
  let balances = {};
  const dpiLocked = sdk.api.erc20.balanceOf({
    target: dpiToken,
    owner: masterChef,
    block
  })
  const dpiLockedOnMigrator = sdk.api.erc20.balanceOf({
    target: dpiToken,
    owner: continuousMigrator,
    block
  })
  const dpiLPLocked = sdk.api.erc20.balanceOf({
    target: dpiEthToken,
    owner: masterChef,
    block
  })
  const bdpiSupply = sdk.api.erc20.totalSupply({
    target: bDPIToken,
    block
  })
  await unwrapUniswapLPs(balances, [{
    token: dpiEthToken,
    balance: (await dpiLPLocked).output
  }], block)
  sdk.util.sumSingleBalance(balances, dpiToken, (await dpiLocked).output)
  sdk.util.sumSingleBalance(balances, dpiToken, (await dpiLockedOnMigrator).output)

  sdk.util.sumSingleBalance(balances, bDPIToken, (await bdpiSupply).output)
  return balances
}

module.exports = {
  tvl
}
