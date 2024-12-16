const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { CronJob } = require("cron");

console.log("Up and Running");
let chains = [];
function getFolderDetails(directoryPath) {
  try {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    chains = entries
      .filter((entry) => entry.isDirectory()) // Filter for directories only
      .map((folder) => ({
        name: folder.name,
        path: path.join(directoryPath, folder.name),
        createdAt: new Date(
          fs.statSync(path.join(directoryPath, folder.name)).birthtime
        ).getTime(),
      }));
  } catch (err) {
    console.error("Error reading directory:", err.message);
  }
}

const directoryPath = "/home/ubuntu/clusters";
const ONE_HOUR = 3600000; //36,00,000 miliseconds = 1 hour
const job = new CronJob(
  "0 * * * *", //after 1 hour
  async function () {
    getFolderDetails(directoryPath);
    if (chains.length) {
      console.log(chains);
    }

    for (const chain of chains) {
      if (Date.now() - chain.createdAt >= ONE_HOUR) {
        console.log(`Destroying ${chains.name}`);
        try {
          exec(`bash ./destroy.sh ${chains.name}`, (error, stdout, stderr) => {
            console.log(stdout);
          });
          await sleep(5000);
        } catch (error) {
          console.error(`An unexpected error occurred: ${error.message}`);
        }
      }
    }
  },
  null, // onComplete
  true // start
);

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
