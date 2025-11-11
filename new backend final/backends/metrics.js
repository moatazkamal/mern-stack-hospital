import client from "prom-client";

/** Collect default Node/process metrics with a prefix */
client.collectDefaultMetrics({ prefix: "mern_" });

/** Request duration histogram */
const httpRequestDuration = new client.Histogram({
  name: "mern_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.6, 1, 3, 5],
});

/** Middleware to time requests */
export function metricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer({ method: req.method });
  res.on("finish", () => {
    const route = req.route?.path || req.path || "unmatched";
    end({ route, status_code: res.statusCode });
  });
  next();
}

export { client };
