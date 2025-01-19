const path = require('path');
const { createConfig } = require('@openedx/frontend-build');
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
const CopyPlugin = require('copy-webpack-plugin');

const config = createConfig('webpack-prod');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
];

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

config.plugins.push(
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, './public/robots.txt'),
        to: path.resolve(__dirname, './dist/robots.txt'),
      },
    ],
  }),
);
config.pluginSlots= {
    footer_slot: {
        plugins: [
            {
                // Hide the default footer
                op: PLUGIN_OPERATIONS.Hide,
                widgetId: 'default_contents',
            },
            {
                // Insert a custom footer
                op: PLUGIN_OPERATIONS.Insert,
                widget: {
                    id: 'custom_footer',
                    type: DIRECT_PLUGIN,
                    RenderWidget: () => (
                        <img  src="https://sisadmin.mexicox.gob.mx/extramexicox/eduaprende.jpg" height="90px"/>
                    ),
                },
            },
        ]
    }
}
module.exports = config;
