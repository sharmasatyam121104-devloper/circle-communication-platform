import morgan from "morgan";
import chalk from "chalk";

const logger = morgan((tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = Number(tokens.status(req, res));
  const responseTime = tokens["response-time"](req, res);

  let statusColor;

  if (status >= 500) {
    statusColor = chalk.red(status);
  }
  else if (status >= 400) {
    statusColor = chalk.yellow(status);
  }
  else if (status >= 300) {
    statusColor = chalk.cyan(status);
  }
  else {
    statusColor = chalk.green(status);
  }

  return [
    chalk.blue.bold(method),
    chalk.white(url),
    statusColor,
    chalk.magenta(`${responseTime} ms`),
  ].join("  ");
});

export default logger;