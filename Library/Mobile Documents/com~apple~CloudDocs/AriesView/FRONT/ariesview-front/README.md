# AriesView Dashboard v6.0

AriesView is a comprehensive asset managment dashboard suite that provides real-time insights and analytics for property managers and real estate professionals.

## Quick Start

### On Windows

1. Navigate to the root folder (`ariesview-italy-v6`)
2. Double-click on `start-ariesview.bat`
3. Wait for the application to start (you'll see "Ready" in the console)
4. Open your browser and navigate to http://localhost:3000

### Manual Start

If the batch file doesn't work, follow these steps:

1. Open a command prompt
2. Navigate to the project directory:
   ```
   cd C:\path\to\ariesview-italy-v6
   ```
3. Clean up previous installations:
   ```
   rmdir /s /q node_modules
   del package-lock.json yarn.lock pnpm-lock.yaml
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Start the application:
   ```
   npx next dev
   ```
6. Open your browser and navigate to http://localhost:3000

## Features

AriesView Dashboard v6.0 includes the following features:

- **Executive Dashboard**: High-level overview of portfolio performance, occupancy rates, and key financial metrics.

- **Cash Flow Dashboard**: Detailed analysis of income, expenses, and net cash flow with trend visualization.

- **Budget vs Actual Dashboard**: Compare budgeted amounts to actual performance across various categories.

- **Occupancy Dashboard**: Track occupancy rates, lease expirations, and tenant turnover metrics.

- **Maintenance Dashboard**: Monitor work orders, response times, and maintenance costs.

- **Benchmark Center**: Compare your property performance against industry benchmarks.

## Troubleshooting

If you encounter issues when starting the application:

1. **Port conflicts**: If port 3000 is already in use, try starting with a different port:
   ```
   npx next dev -p 3001
   ```

2. **Dependency issues**: Make sure you have Node.js v16 or higher installed:
   ```
   node -v
   ```

3. **Permission issues**: Try running the commands as administrator.

4. **"Missing script: dev" error**: This is expected. Use `npx next dev` instead of `npm run dev`.

5. **PowerShell script execution policy**: If you're running in PowerShell and encounter permission issues:
   ```
   Set-ExecutionPolicy Unrestricted -Scope Process
   ```

## System Requirements

- Node.js 16.0 or higher
- Windows 10 or higher (for the batch file)
- Modern web browser (Chrome, Firefox, Edge, or Safari)
- Minimum 4GB RAM
- Internet connection for initial setup

## Support

For additional support or questions, please contact the AriesView support team:

- Email: support@ariesview.com
- Phone: +1 (555) 123-4567
- Hours: Monday - Friday, 9:00 AM - 5:00 PM EST

## License

© 2023 AriesView Systems. All rights reserved. 