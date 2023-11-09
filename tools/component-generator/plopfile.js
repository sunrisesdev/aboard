const PLOP_TEMPLATES_PATH = 'templates';

module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Create a UIKit component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'How should the component be named? (will be capitalized)',
        filter: (name) =>
          name
            .split(' ')
            .map((part) => part.replace(/\b\w/g, (l) => l.toUpperCase()))
            .join(''),
      },
    ],
    actions: () => {
      return [
        {
          type: 'add',
          path: '../../src/components/{{name}}/{{name}}.tsx',
          templateFile: `${PLOP_TEMPLATES_PATH}/component.hbs`,
        },
        {
          type: 'add',
          path: '../../src/components/{{name}}/types.ts',
          templateFile: `${PLOP_TEMPLATES_PATH}/types.hbs`,
        },
        {
          type: 'add',
          path: '../../src/components/{{name}}/{{name}}.module.scss',
          templateFile: `${PLOP_TEMPLATES_PATH}/styles.hbs`,
        },
      ];
    },
  });
};
