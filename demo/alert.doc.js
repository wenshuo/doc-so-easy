module.exports = {
  name: 'alert',
  category: 'js',
  subcategory: 'components',
  title: 'Alert React Component y',
  description: 'Html Alert component.',
  examples: [
    {
      title: 'alert example',
      type: 'html',
      description: 'hello alert',
      code: `
        <div>hello alert</div>
      `
    }
  ],
  properties: [
    {
      title: 'text',
      type: 'string',
      description: 'alert text'
    },
    {
      title: 'global',
      type: 'boolean',
      description: 'if true, show global alert'
    }
  ]
};
