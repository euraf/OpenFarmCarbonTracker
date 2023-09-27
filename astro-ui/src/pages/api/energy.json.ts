
export async function GET({  }) {

  const { spawn } = await import('child_process');
  const contribution: any[] = []; // Store readings
  
  
  const energyCalc = spawn('python', ['../src/energy/calc.py']);
  
  await new Promise((resolve, reject) => {
    energyCalc.stdout.on('data', function(data) {
      // convert Buffer object to Float
      contribution.push(parseFloat(data));
      
      console.log(contribution);
      resolve(true);
    });
  });

  console.log(contribution)
  return new Response(JSON.stringify(contribution), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });


}
