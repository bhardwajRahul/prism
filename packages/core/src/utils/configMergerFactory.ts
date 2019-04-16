import { PartialPrismConfig, PrismConfig, PrismConfigFactory, resolveConfig } from '..';

const _compact = require('lodash/compact');
const _merge = require('lodash/merge');

/**
 * Merges all passed configs. Each next config wil override each previous config.
 */

export function configMergerFactory<C, I>(
  baseConfig: PrismConfig<C, I>,
  ...configs: Array<PartialPrismConfig<C, I> | undefined>
): PrismConfigFactory<C, I> {
  return (input: I, defaultConfig?: PartialPrismConfig<C, I>): C => {
    const resolvedConfigs =
      // remove any falsy resolved configs
      _compact(
        // remove falsy config props
        _compact([baseConfig, ...configs])
          // resolve each config (resolveConfig is async)
          .map((c: C) => resolveConfig(input, c, defaultConfig))
      );

    if (!resolvedConfigs.length) {
      throw new Error('All configurations passed to the factory are undefined.');
    }

    // merge the configs over each other, in order
    return _merge({}, ...resolvedConfigs);
  };
}