async function GET({}) {
  const { spawn } = await import('child_process');
  const contribution = [];
  const energyCalc = spawn("python", ["../src/energy/calc.py"]);
  await new Promise((resolve, reject) => {
    energyCalc.stdout.on("data", function(data) {
      contribution.push(parseFloat(data));
      console.log(contribution);
      resolve(true);
    });
  });
  console.log(contribution);
  return new Response(JSON.stringify(contribution), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export { GET };
