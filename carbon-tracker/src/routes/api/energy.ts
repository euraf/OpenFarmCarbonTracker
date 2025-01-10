export const apiResponseOptions: ResponseInit = {
  headers: {
    "Content-Type": "application/json",
  },
  status: 200,
};

export async function GET() {
  
  const { spawn } = await import('child_process');
  const contribution: any[] = []; // Store readings
  
  
  const energyCalc = spawn('python3', ['../src/energy/calc.py']);

  
  await new Promise((resolve, reject) => {
    energyCalc.stdout.on('data', function(data) {
      // convert Buffer object to Float
      contribution.push(parseFloat(data));
      
      resolve(true);
    });
  });

  

console.log(contribution)
  return new Response(JSON.stringify(contribution), apiResponseOptions);

  // ...
}