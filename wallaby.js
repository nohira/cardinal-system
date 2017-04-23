module.exports = function (wallaby) {
    return {
        files : [
            'src/**/*.ts',
            'test/unit/mock/**/*.ts',
            'lib/index.ts'
        ],
        tests : ['test/**/*.spec.ts*'],
        compilers : {
            '**/*.ts?(x)' : wallaby.compilers.typeScript({
                                                             "target" : "es2015",
                                                             "module" : "commonjs",
                                                             "moduleResolution" : "node",
                                                             "sourceMap" : true,
                                                             "emitDecoratorMetadata" : true,
                                                             "experimentalDecorators" : true,
                                                             "removeComments" : false,
                                                             "noImplicitAny" : false,
                                                             "allowSyntheticDefaultImports" : true,
                                                             "outDir" : "dist"
                                                         })
        },
        env : {
            type : 'node'
        },

        filesWithNoCoverageCalculated : ['test/**/*.ts']
    };
};