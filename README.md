# PocketProfits

Like PocketRockets but with profits! A simple, secure poker bankroll / bet tracking app with PIN protection. Track your innage and winnage (coined by ![VegasMatt & Team](https://www.youtube.com/@VegasMatt)) with a clean, modern interface. Easily selfhost via docker!

![Image](https://github.com/user-attachments/assets/1cd79d2a-bdcc-450f-aaf8-b3856d86fa6a)

Forked & Repurposed from <a href="https://github.com/DumbWareio/DumbBudget" target="_blank">DumbBudget by Dumbwareio</a>

## Features

- 🔒 PIN-protected access
- 💰 Track in-for and out-for
- 📊 Real-time balance calculations
- 🏷️ Categorize transactions
- 📅 Date range filtering
- 🔄 Sort by date or amount
- 📱 Responsive design
- 🌓 Light/Dark theme
- 📤 Export to CSV or PDF
- 🔍 Filter transactions by type
- 💱 Multi-currency support
- 🌐 PWA Support

## Supported Currencies

PocketProfits supports the following currencies:
- USD (US Dollar) 🇺🇸
- EUR (Euro) 🇪🇺
- GBP (British Pound) 🇬🇧
- JPY (Japanese Yen) 🇯🇵
- AUD (Australian Dollar) 🇦🇺
- CAD (Canadian Dollar) 🇨🇦
- CHF (Swiss Franc) 🇨🇭
- CNY (Chinese Yuan) 🇨🇳
- HKD (Hong Kong Dollar) 🇭🇰
- NZD (New Zealand Dollar) 🇳🇿
- MXN (Mexican Peso) 🇲🇽
- RUB (Russian Ruble) 🇷🇺
- SGD (Singapore Dollar) 🇸🇬
- KRW (South Korean Won) 🇰🇷
- INR (Indian Rupee) 🇮🇳
- BRL (Brazilian Real) 🇧🇷
- ZAR (South African Rand) 🇿🇦
- TRY (Turkish Lira) 🇹🇷  
- PLN (Polish Złoty) 🇵🇱  
- SEK (Swedish Krona) 🇸🇪  
- NOK (Norwegian Krone) 🇳🇴  
- DKK (Danish Krone) 🇩🇰  
- IDR (Indonesia Rupiah) 🇮🇩

Set your preferred currency using the `CURRENCY` environment variable (defaults to USD if not set).

### Using Docker

```bash
docker run -d \
  -p 3000:3000 \
  -v /path/to/your/data:/app/data \
  -e POCKETPROFITS_PIN=12345 \
  -e CURRENCY=USD \
  -e BASE_URL=http://localhost:3000 \
  -e SITE_TITLE='My Account' \
  gitmotion/pocketprofits:latest
```

```yaml
services:
  pocketprofits:
    image: gitmotion/pocketprofits:latest
    container_name: pocketprofits
    restart: unless-stopped
    ports:
      - ${POCKETPROFITS_PORT:-3000}:3000
    volumes:
      - ${POCKETPROFITS_DATA_PATH:-./data}:/app/data
    environment:
      - POCKETPROFITS_PIN=${POCKETPROFITS_PIN:-} # PIN to access the site
      - BASE_URL=${POCKETPROFITS_BASE_URL:-http://localhost:3000} # URL to access the site
      - CURRENCY=${POCKETPROFITS_CURRENCY:-USD} # Supported Currency Codes: 
      - SITE_TITLE=${POCKETPROFITS_SITE_TITLE:-PocketProfits} # Name to show on site
      - INSTANCE_NAME=${POCKETPROFITS_INSTANCE_NAME:-} # Name of instance/account
      # (OPTIONAL)
      # Restrict origins - ex: https://subdomain.domain.tld,https://auth.proxy.tld,http://internalip:port' (default is '*')
      # - ALLOWED_ORIGINS=${POCKETPROFITS_ALLOWED_ORIGINS:-http://localhost:3000}
    # healthcheck:
    #   test: wget --spider -q  http://127.0.0.1:3000
    #   start_period: 20s
    #   interval: 20s
    #   timeout: 5s
    #   retries: 3
```

> **Note**: Replace `/path/to/your/data` with the actual path where you want to store your transaction data on the host machine.

### Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `POCKETPROFITS_PIN` | PIN code for accessing the application | Yes | - | `12345` |
| `PORT` | Port number for the server | No | `3000` | `8080` |
| `CURRENCY` | Currency code for transactions | No | `USD` | `EUR` |
| `BASE_URL` | Base URL for the application | No | `http://localhost:PORT` | `https://budget.example.com` |
| `SITE_TITLE` | Allows you to name each instance should you have multiple. | No | - | `My Account` |

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/gitmotion/PocketProfits.git
cd PocketProfits
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
POCKETPROFITS_PIN=12345
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
CURRENCY=USD
SITE_TITLE='PocketProfits'
INSTANCE_NAME='My Account'
ALLOWED_ORIGINS=* # Restrict origins - ex: https://subdomain.domain.tld,https://auth.proxy.tld,http://internalip:port' (default is '*')
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Building from Source

```bash
# Build the Docker image
docker build -t gitmotion/pocketprofits:latest .

# Create a directory for persistent data
mkdir -p ~/data

# Run the container
docker run -d \
  -p 3000:3000 \
  -v ~/data:/app/data \
  -e POCKETPROFITS_PIN=12345 \
  -e BASE_URL=http://localhost:3000 \
  -e SITE_TITLE='My Account' \
  gitmotion/pocketprofits:latest
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

PocketProfits includes several security features:
- PIN protection for access
- Rate limiting on PIN attempts
- Temporary lockout after failed attempts
- No sensitive data stored in browser storage
- Secure session handling

## Support

- Report bugs by opening an issue
- Request features through issues

## Support the Project

<a href="https://www.buymeacoffee.com/gitmotion" target="_blank" rel="noopener noreferrer">
  <img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy me a coffee" />
</a>

