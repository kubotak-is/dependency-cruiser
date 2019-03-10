const _get                = require('lodash/get');
const enhancedResolve     = require('enhanced-resolve');
const PnpWebpackPlugin    = require('pnp-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const transpileMeta       = require('../../extract/transpile/meta');

const CACHE_DURATION = 4000;

function pushPlugin(pPlugins, pPluginToPush) {
    return (pPlugins || []).concat(pPluginToPush);
}

function compileResolveOptions(pResolveOptions){
    let DEFAULT_RESOLVE_OPTIONS = {
        // symlinks listens to the 'preserveSymlinks' option - but note
        // that symlinks = true means _follow_, which is the opposite
        // of _preserve_ - which we have on false by default (following)
        // nodejs default behavior.
        //
        // Someday we'll rely on this and remove the code that manually
        // does this in index.js
        symlinks: true,
        // if a webpack config overrides extensions, there's probably
        // good cause. The scannableExtensions are an educated guess
        // anyway, that works well in most circumstances.
        // Note that if extract/transpile/index gets an unknown extension
        // passed, it'll fall back to the javascript parser
        extensions: transpileMeta.scannableExtensions
    };

    const NON_OVERRIDABLE_RESOLVE_OPTIONS = {
        // This should cover most of the bases of dependency-cruiser's
        // uses. Not overridable for now because for other
        // file systems it's not sure we can use sync system calls
        // Also: passing a non-cached filesystem makes performance
        // worse.
        fileSystem: new enhancedResolve.CachedInputFileSystem(
            new enhancedResolve.NodeJsInputFileSystem(),
            CACHE_DURATION
        ),
        // our code depends on sync behavior, so having this
        // overriden is not an option
        useSyncFileSystemCalls: true
    };

    let lResolveOptions = {};

    if (pResolveOptions.tsConfig) {
        lResolveOptions.plugins = pushPlugin(
            lResolveOptions.plugins,
            new TsConfigPathsPlugin({configFile: pResolveOptions.tsConfig})
        );
    }

    if (pResolveOptions.externalModuleResolutionStrategy === 'yarn-pnp') {
        lResolveOptions.plugins = pushPlugin(
            lResolveOptions.plugins,
            PnpWebpackPlugin
        );
    }

    return Object.assign(
        DEFAULT_RESOLVE_OPTIONS,
        lResolveOptions,
        pResolveOptions,
        NON_OVERRIDABLE_RESOLVE_OPTIONS
    );
}

module.exports = (pResolveOptions, pOptions) => compileResolveOptions(
    Object.assign(
        {

            /*
                enhanced-resolve's "symlinks" means "follow symlinks", which is the
                opposite of "preserve symlinks" - hence the negation
             */
            symlinks: !(pOptions.preserveSymlinks),
            tsConfig: _get(pOptions, "ruleSet.options.tsConfig.fileName", null),

            /* squirel the externalModuleResolutionStrategy and combinedDependencies
               thing into the resolve options
                - they're not for enhanced resolve, but they are for what we consider
                resolve options ...
            */
            externalModuleResolutionStrategy: pOptions.externalModuleResolutionStrategy,
            combinedDependencies: pOptions.combinedDependencies
        },
        pResolveOptions || {}
    )
);
