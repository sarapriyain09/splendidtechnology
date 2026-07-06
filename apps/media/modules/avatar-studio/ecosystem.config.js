module.exports = {
  apps: [
    {
      name: "avatar-backend",
      cwd: "./backend",
      script: "./venv/bin/uvicorn",
      args: "app.main:app --host 0.0.0.0 --port 8000",
      interpreter: "none",
      env: {
        ENV_FILE: "../.env.production"
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "700M",
      out_file: "./logs/backend/pm2-out.log",
      error_file: "./logs/backend/pm2-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    },
    {
      name: "avatar-frontend",
      cwd: "./frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3008"
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "700M",
      out_file: "./logs/frontend/pm2-out.log",
      error_file: "./logs/frontend/pm2-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    },
    {
      name: "avatar-smoke-monitor",
      cwd: ".",
      script: "./backend/venv/bin/python",
      args: "./scripts/smoke_test.py",
      interpreter: "none",
      env: {
        AVATAR_BASE_URL: "https://avatar.velynxia.com",
        ALERT_EMAIL_TO: "admin@velynxia.com",
        ALERT_EMAIL_FROM: "alerts@velynxia.com",
        ALERT_EMAIL_ENABLED: "true",
        ALERT_EMAIL_ON_RECOVERY: "true"
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: false,
      cron_restart: "*/10 * * * *",
      out_file: "./logs/backend/smoke-out.log",
      error_file: "./logs/backend/smoke-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};
