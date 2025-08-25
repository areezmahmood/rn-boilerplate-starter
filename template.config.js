module.exports = {
  placeholderName: "AwesomeProject",
  templateDir: "./template",
  prompts: [
    {
      name: 'camera',
      type: 'confirm',
      message: 'Do you want to include camera support?',
    },
  ],
  postInitScript: './post-init.script.js',

};
