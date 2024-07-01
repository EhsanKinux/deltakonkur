module.exports = {
    apps: [
      {
        name: 'my-react-app',
        script: 'serve',
        args: '-s dist -l 3000',
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 3000, // Ensure the port is set to 3000 for production
          HOST: '185.206.93.104' // Set the host address here if required
        }
      }
    ]
  };
  