import * as webpack from 'webpack';
import * as path from 'path';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

const config: webpack.Configuration = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    externals: [
        'jgexml/xsd2json',
        'jgexml/xml2json',
        'lodash/get'
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript']
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};

export default config;