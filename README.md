# Fair Trade Coffee Blockchain

Ett REST-API byggt med Node.js och Express för att spåra Fair Trade-kaffeleveranser med hjälp av en blockkedja och Proof-of-Work.

Projektet är utvecklat med TDD och använder Vitest för enhetstester och Supertest för integrationstester.

## Tekniker

- Node.js
- Express
- Vitest
- Supertest
- Node.js crypto
- Proof-of-Work
- REST API

## Installation

Klona repot:

```bash
git clone https://github.com/KalleElder/fairtrade-coffee-blockchain.git
cd fairtrade-coffee-blockchain
```

Installera projektets dependencies:

```bash
npm install
```

## Starta servern

Starta API-servern med:

```bash
npm start
```

Servern använder port 3000 som standard.

Om port 3000 redan används kan en annan port anges:

```bash
PORT=3001 npm start
```

## Tester

Kör alla tester:

```bash
npm test
```

Kör tester med code coverage:

```bash
npm run coverage
```

Senaste kontrollen av projektet gav följande coverage:

- Statements: 100 %
- Branches: 87,5 %
- Functions: 100 %
- Lines: 100 %

## Proof-of-Work

Blockkedjan använder SHA-256 från Node.js inbyggda `crypto`-modul.

När ett block mine:as ökas ett `nonce` i en loop. Blockets innehåll hash:as på nytt för varje försök tills en hash hittas som börjar med rätt antal nollor.

I vanlig körning används difficulty 2.

När `NODE_ENV` är `test` används difficulty 1 för att testerna ska kunna köras snabbt utan att mining-loopen orsakar timeout.

```javascript
this.difficulty = process.env.NODE_ENV === 'test' ? 1 : 2
```

## Transaktioner

En transaktion representerar en förflyttning av ett parti kaffe och innehåller:

```json
{
  "sender": "Coffee Farm",
  "recipient": "Coffee Roastery",
  "batchId": "batch-100",
  "weightKg": 75
}
```

Nya transaktioner läggs först i `pendingTransactions`.

När ett nytt block mine:as flyttas de väntande transaktionerna till blocket och `pendingTransactions` töms.

## API

### GET /blockchain

Returnerar hela blockkedjan och väntande transaktioner.

Exempel:

```bash
curl http://localhost:3000/blockchain
```

### POST /transactions

Lägger till en ny kaffetransaktion i `pendingTransactions`.

Exempel:

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "Coffee Farm",
    "recipient": "Coffee Roastery",
    "batchId": "batch-100",
    "weightKg": 75
  }'
```

Endpointen använder middleware för indatavalidering.

Följande fält måste finnas:

- `sender`
- `recipient`
- `batchId`
- `weightKg`

Om något obligatoriskt fält saknas returneras statuskod 400.

### POST /mine

Mine:ar väntande transaktioner och skapar ett nytt block.

Exempel:

```bash
curl -X POST http://localhost:3000/mine
```

Det nya blocket läggs till i blockkedjan och `pendingTransactions` töms.

## Blockstruktur

Ett block innehåller:

- `index`
- `timestamp`
- `transactions`
- `previousHash`
- `nonce`
- `hash`

Det första blocket är ett genesis-block.

## TDD

Projektet har utvecklats med Test Driven Development. Tester har skrivits före motsvarande implementation.

Commit-historiken innehåller flera exempel på red-to-green-processen.

### 1. SHA-256-hashning

Testet skrevs först:

[test: lägger till test för SHA-256-hashning](https://github.com/KalleElder/fairtrade-coffee-blockchain/commit/3b2deca)

Därefter implementerades funktionen:

[implementera SHA-256-hashning](https://github.com/KalleElder/fairtrade-coffee-blockchain/commit/0740cc7)

### 2. Proof-of-Work

Testet skrevs först:

[test: lägg till test för Proof-of-Work](https://github.com/KalleElder/fairtrade-coffee-blockchain/commit/8a23fcf)

Därefter implementerades Proof-of-Work:

[implementera Proof-of-Work mining](https://github.com/KalleElder/fairtrade-coffee-blockchain/commit/affa1ba)

### 3. Mining av väntande transaktioner

Testet skrevs först:

[test: lägg till test för mining av väntande transaktioner](https://github.com/KalleElder/fairtrade-coffee-blockchain/commit/8f070ff)

Därefter implementerades funktionen:

[implementera mining av väntande transaktioner](https://github.com/KalleElder/fairtrade-coffee-blockchain/commit/3d626fe)

## Projektstruktur

```text
fairtrade-coffee-blockchain/
├── src/
│   ├── middleware/
│   │   └── validateTransaction.js
│   ├── app.js
│   ├── Blockchain.js
│   └── server.js
├── tests/
│   ├── api.test.js
│   └── blockchain.test.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```
