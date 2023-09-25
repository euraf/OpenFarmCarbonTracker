export const apiResponseOptions: ResponseInit = {
  headers: {
    "Content-Type": "application/json",
  },
  status: 200,
};

export async function GET() {
  
  const { spawn } = await import('child_process');
  const temperatures: any[] = []; // Store readings
  
  
  const sensor = spawn('python3', ['../src/energy/calc.py']);

  
  await new Promise((resolve, reject) => {
    sensor.stdout.on('data', function(data) {
      // convert Buffer object to Float
      temperatures.push(parseFloat(data));
      
      console.log(temperatures);
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