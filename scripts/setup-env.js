const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const environments = ['development', 'staging', 'production'];

async function setupEnvironment(env) {
  const templatePath = path.join(process.cwd(), '.env.example');
  const envPath = path.join(process.cwd(), `.env.${env}`);

  if (!fs.existsSync(templatePath)) {
    console.error('❌ .env.example file not found');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  
  console.log(`\n📝 Setting up ${env} environment variables:\n`);
  
  const variables = template.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const config = {};

  for (const variable of variables) {
    const [key] = variable.split('=');
    const answer = await new Promise(resolve => {
      rl.question(`${key}=`, resolve);
    });
    config[key] = answer;
  }

  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Environment file created: ${envPath}`);
}

async function main() {
  console.log('🔧 Environment Setup\n');
  
  for (const env of environments) {
    const answer = await new Promise(resolve => {
      rl.question(`Set up ${env} environment? (Y/n): `, resolve);
    });
    
    if (answer.toLowerCase() !== 'n') {
      await setupEnvironment(env);
    }
  }
  
  rl.close();
  console.log('\n✨ Environment setup complete!');
}

main().catch(console.error);