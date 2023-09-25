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
      
      console.log(contribution);
      resolve(true);
    });
  });

  
  // await sensor.stdout.on('data', function(data) {
    
  //   // convert Buffer object to Float
  //   temperatures.push(parseFloat(data));
  //   console.log(temperatures);
  // });

console.log(temperatures)
  return new Response(JSON.stringify(temperatures), apiResponseOptions);

  // ...
}